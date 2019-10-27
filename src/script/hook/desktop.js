(function(k, factory) {
  'use strict';

  factory(new Kluginn.default());

})(kintone, function(p){

  var K = p;
  var $ = K.$;

  var C = {
  };

  var S = {
    config: K.config.fetch(),
    properties: null
  };

  var A = {
    link_clickable: {
      on: [
        'app.record.edit.show'
      ],
      opt: {
        sel: '.control-link-field-gaia',
        match: function(el){
          var hr = el.find('input').val();
          if(hr.match(/^http(s)?\:\/\//)){
            return hr;
          }else{
            return false;
          }
        }
      },
      run: function(config, ename, e){
        var act = A[config.name];
        var sel = act.opt.sel;
        $(sel).each(function(){
          var el = $(this);
          if(act.opt.match(el)){
            el.find("*").css({ "cursor": "pointer" });
          }
        });
      },
      bind: function(config, ename, e){
        var act = A[config.name];
        $(document).on('click', act.opt.sel + ' .control-value-gaia', function(){
          var hr = act.opt.match($(this));
          if(hr){
            window.open(hr);
          }
        });
      }
    },
    auto_lookup_init: {
      on: [
        //'app.record.create.show',
        //'app.record.edit.show'
      ],
      opt: {
      },
      run: function(config, ename, e){
        var act = A[config.name];
        var record = e.record;
        for(var k in record){
          var f = record[k];
          if(f.value != "" && f.lookup !== true){
            f.lookup = true;
          }
        }
        return e;
       },
      bind: function(config, ename, e){
      }
    },
    "focus_error_input": {
      on: [
        'app.record.create.submit',
        'app.record.edit.submit',
        'app.record.index.edit.submit'
      ],
      opt: {
      },
      run: function(config, ename, e){
        $("html head").append('<style type="text/css">'
          + '.notifier-error-cybozu {cursor: pointer;}'
          + '.notifier-error-cybozu .notifier-body-cybozu:before {content: "🖱️ Click here and check a first Error."}'
          + '</style>');
        return e;
       },
      bind: function(config, ename, e){
        $(document).on('click', '.notifier-error-cybozu', function(){
          var fe = $('.input-error-cybozu').first().get(0).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inine: "center",
          });
        });
      }
    }

  }

  var ready = K.init().then(main);

  [
    ['app.record.create.show', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
    ['app.record.detail.show', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
    ['app.record.edit.show', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
    ['app.record.create.submit', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
    ['app.record.edit.submit', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
    ['app.record.index.submit', function(ename, e){
      flush_all_action(ename, e);
      return e;
    }],
  ].map(function(cnr){
    var ename = cnr[0];
    var clb = cnr[1];
    K.$k.events.on(ename, function(e){
      return clb(ename, e);
    });
  });

  /* Put kintone-event listener on top level.
   *
   * K.$k.events.on()
   */

  function main(){
    return Promise.all([
      K.api.fetch('app/form/fields')
        .then(function(p){
          S.properties = p.properties;
        })
    ]);
  }

  function each_misc(clb){
    for(var a of S.config.json.table || []){
      clb(a);
    }
  }

  function flush_all_action(ename, e){
    each_misc(function(a){
      if(a.toggle == "on"){
        call_action(a, ename, e);
      }
    });
    return e;
  }

  function call_action(a, ename, e){
    var act = A[a.name];
    if(!act) return;
    if(act.on.includes(ename)){
      act.run(a, ename, e);
      if(!act.is_bound){
        act.bind(a, ename, e);
        act.is_bound = true;
      }
    }
  }

 });
