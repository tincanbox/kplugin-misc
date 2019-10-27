export default class SharedLib {
  constructor(){
  }

  default_data(){
    return [
      {
        name: "link_clickable",
        toggle: "on",
        value: "",
        desc: "Forces 'Link' field to be clickable."

      },
      {
        name: "auto_lookup_init",
        toggle: "off",
        value: "",
        desc: "Automatically initialize Lookup when edit"
      },
      {
        name: "focus_error_input",
        toggle: "on",
        value: "",
        desc: "Scrolls to error input when click global error."
      }
    ];
  }

}
