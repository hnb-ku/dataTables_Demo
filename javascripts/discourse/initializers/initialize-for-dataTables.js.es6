import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

export default {
  name: "my-initializer",
  initialize() {
    withPluginApi("0.8", api => {
      // Decorates posts with dataTables
      api.decorateCooked(
        $elem => {
          const dataTables = $('[data-wrap="dataTables"] table', $elem);
          if (!dataTables.length) return;

          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js"
          ).then(() => {
            dataTables.dataTable();
          });
        },
        { id: "discourse-dataTables", onlyStream: true }
      );

      // Handles translations for composer
      let translations = I18n.translations[I18n.currentLocale()].js;
      if (!translations) {
        translations = {};
      }

      if (!translations.composer) {
        translations.composer = {};
      }

      translations.dataTables_button = "foobar";
      translations.composer.dataTables_add_table_prompt = "lol";

      // Adds dataTable button to the composer
      api.onToolbarCreate(function(toolbar) {
        toolbar.addButton({
          trimLeading: true,
          id: "DataTables",
          group: "insertions",
          icon: "table",
          title: "Datatables_button",
          perform: function(e) {
            return e.applySurround(
              "[wrap=dataTables]\n\n",
              "\n\n[/wrap]",
              "dataTables_add_table_prompt",
              { multiline: false }
            );
          }
        });
      });
    });
  }
};
