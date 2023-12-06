<script setup lang="ts">
import { computed, reactive, ref, VueElement } from "vue";
import { useTheme } from "vuetify";

import { LdapPersonAuswahl } from "./components/index";

export type VForm = VueElement & {
  validate: () => boolean;
  resetValidation: () => void;
  reset: () => void;
};

const theme = useTheme();

const backends = [
  {
    value: "https://virtserver.swaggerhub.com/ITMKM23/ezLDAP/2.0.5",
    title: "virtserver.swaggerhub.com",
  },
  {
    value: "https://ezldap.muenchen.de",
    title: "https://ezldap.muenchen.de",
  },
  {
    value: "https://ezldap-testldap.apps.capk.muenchen.de",
    title: "https://ezldap-testldap.apps.capk.muenchen.de",
  },
];

const inputVariants = ["solo", "outlined", "filled", "underlined", "plain"];

const densities = ["default", "comfortable", "compact"];

const slotVariants = ["ezldap-default", "v-autocomplete-default"];

const defaultState = {
  baseUrl: "https://virtserver.swaggerhub.com/ITMKM23/ezLDAP/2.0.5",
  density: "default",
  label: "LdapPersonAuswahl",
  placeholder: "Suche nach Person im LDAP ...",
  noDataText: "Keine Daten gefunden.",
  requiredRule: false,
  multiple: false,
  chips: false,
  debounce: 300,
  inputVariant: undefined,
  initialLookup: true,
  slotVariant: "ezldap-default",
  disabled: false,
};

const configDrawer = ref<boolean>();

const state = reactive({
  baseUrl: defaultState.baseUrl,
  density: defaultState.density,
  label: defaultState.label,
  placeholder: defaultState.placeholder,
  requiredRule: defaultState.requiredRule,
  multiple: defaultState.multiple,
  chips: defaultState.chips,
  debounce: defaultState.debounce,
  inputVariant: defaultState.inputVariant,
  initialLookup: defaultState.initialLookup,
  slotVariant: defaultState.slotVariant,
  noDataText: defaultState.noDataText,
  disabled: defaultState.disabled,
});

const computedRules = computed(() => {
  if (state.requiredRule) {
    if (state.multiple) {
      return [
        (v: any) =>
          !v ||
          !Array.isArray(v) ||
          v.length > 0 ||
          "Required validation rule text!!",
      ];
    } else {
      return [(v: any) => !!v || "Required validation rule text!!"];
    }
  } else {
    return [];
  }
});

const initialData1 = {
  lhmObjectId: "123456789",
  uid: "erika.musterfrau",
  cn: "Erika Musterfrau",
  ou: "REF-A1",
};

const initialData2 = {
  lhmObjectId: "987654321",
  uid: "max.mustermann",
  cn: "Max Mustermann",
  ou: "REF-A2",
};

const initialDataWithLookup = {
  lhmObjectId: "123456789",
};

const initialDataWithLookupUid = {
  uid: "erika.musterfrau",
};

const demoForm = ref();

const modelData = ref();

function resetDemoSettings() {
  Object.assign(state, defaultState);
  toggleDarkMode();
}

function resetComponent() {
  (demoForm.value as VForm).reset();
}

function resetComponentValidation() {
  (demoForm.value as VForm).resetValidation();
}

function validate() {
  return (demoForm.value as VForm).validate();
}

function toggleDarkMode() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    console.log("change default light to dark theme");
    theme.global.name.value = "dark";
  }
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

modelData.value = initialData1;

function prefillValue() {
  if (!state.multiple) {
    modelData.value = initialData1;
  } else {
    modelData.value = [initialData1, initialData2];
  }
}

function prefillValueLookupLhmObjectId() {
  if (!state.multiple) {
    modelData.value = initialDataWithLookup;
  }
}

function prefillValueLookupUid() {
  if (!state.multiple) {
    modelData.value = initialDataWithLookupUid;
  }
}

function onChanged(event: any) {
  setSnackbar(
    "Event '@change:modelValue' triggered - new input modelValue: " +
      JSON.stringify(event)
  );
}

toggleDarkMode();

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarTimeout = ref(2000);

function setSnackbar(text: string) {
  snackbar.value = true;
  snackbarText.value = text;
}

function onLoading(isLoading: boolean) {
  console.log("LOADING: " + isLoading);
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-avatar
        size="32"
        image="/logo.svg"
      />
      <v-toolbar-title class="ps-2"
        >LdapPersonAuswahl - Demo Page</v-toolbar-title
      >
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="configDrawer = !configDrawer">
        <v-icon>mdi-cog</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model:model-value="configDrawer"
      location="right"
      width="400"
    >
      <v-card>
        <v-card-text>
          <v-select
            v-model="state.baseUrl"
            :items="backends"
            label="Base-URL"
            density="compact"
          ></v-select>
          <v-text-field
            v-model="state.label"
            label="label"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="state.placeholder"
            label="placeholder"
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="state.noDataText"
            label="no-data-text"
            density="compact"
          ></v-text-field>
          <v-select
            v-model="state.inputVariant"
            :items="inputVariants"
            label="variants"
            density="compact"
            clearable
          ></v-select>
          <v-row>
            <v-col>
              <v-switch
                v-model="state.multiple"
                density="compact"
                label="multiple"
              />
            </v-col>
            <v-col>
              <v-switch
                v-model="state.chips"
                density="compact"
                label="chips"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                v-model="state.disabled"
                density="compact"
                label="disabled"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                v-model="state.debounce"
                label="debounce (ms)"
                min="0"
                max="5000"
                density="compact"
              >
                <template #append>
                  <v-text-field
                    v-model="state.debounce"
                    class="mt-0 pt-0"
                    type="number"
                    style="width: 60px"
                  ></v-text-field> </template
              ></v-slider>
            </v-col>
          </v-row>
          <v-divider />
          <v-select
            v-model="state.density"
            :items="densities"
            label="density"
            density="compact"
          ></v-select>
          <v-select
            v-model="state.slotVariant"
            :items="slotVariants"
            label="slots"
            density="compact"
          ></v-select>
          <v-switch
            v-model="state.initialLookup"
            density="compact"
            label="mit initialem Lookup"
          ></v-switch>
          <v-switch
            v-model="state.requiredRule"
            density="compact"
            label="mit 'required' Rule"
          ></v-switch>
          <v-divider />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            variant="elevated"
            @click="toggleTheme"
            >Toggle theme</v-btn
          >
          <v-spacer />
          <v-btn
            color="primary"
            variant="elevated"
            @click="resetDemoSettings"
          >
            <template #prepend>
              <v-icon>mdi-refresh</v-icon>
            </template>
            Reset settings</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
    <v-main>
      <v-snackbar
        v-model="snackbar"
        :timeout="snackbarTimeout"
      >
        {{ snackbarText }}
        <template #actions>
          <v-btn
            color="blue"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-form ref="demoForm">
                  <v-row class="ma-8">
                    <LdapPersonAuswahl
                      v-model="modelData"
                      :base-url="state.baseUrl"
                      :debounce="state.debounce"
                      :density="state.density"
                      :variant="
                        state.inputVariant !== ''
                          ? state.inputVariant
                          : undefined
                      "
                      :label="state.label"
                      :placeholder="state.placeholder"
                      :rules="computedRules"
                      :multiple="state.multiple"
                      :chips="state.chips"
                      :initial-lookup="state.initialLookup"
                      :default-slots="state.slotVariant == 'ezldap-default'"
                      :no-data-text="state.noDataText"
                      :disabled="state.disabled"
                      clearable
                      @update:model-value="onChanged"
                      @loading="onLoading"
                    >
                      <!-- custom slots override-->
                      <template
                        v-if="state.slotVariant == 'custom'"
                        #selection="data"
                      >
                        {{ data.item.uid }}
                      </template>
                      <!-- custom item slot -->
                      <template
                        v-if="state.slotVariant == 'custom'"
                        #item="{ item }"
                      >
                        <v-list-item-title>{{ item.cn }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.lhmObjectId }} ({{ item.ou }})
                        </v-list-item-subtitle>
                      </template>
                    </LdapPersonAuswahl>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  prepend-icon="mdi-check-circle"
                  variant="outlined"
                  @click="validate"
                  >Validate</v-btn
                >
                <v-btn
                  prepend-icon="mdi-map-marker-plus-outline"
                  variant="outlined"
                  @click="prefillValue"
                  >Prefill value</v-btn
                >
                <v-btn
                  prepend-icon="mdi-map-marker-plus-outline"
                  variant="outlined"
                  @click="prefillValueLookupLhmObjectId"
                  >Prefill lhmObjectId only</v-btn
                >
                <v-btn
                  prepend-icon="mdi-map-marker-plus-outline"
                  variant="outlined"
                  @click="prefillValueLookupUid"
                  >Prefill uid only</v-btn
                >
                <v-spacer />
                <v-btn
                  prepend-icon="mdi-refresh"
                  variant="outlined"
                  @click="resetComponentValidation"
                  >Reset validation</v-btn
                >
                <v-btn
                  prepend-icon="mdi-refresh"
                  variant="outlined"
                  @click="resetComponent"
                  >Reset form</v-btn
                >
              </v-card-actions>
            </v-card>
            <v-card class="mt-2">
              <v-card-text>
                <pre class="text-body-2">{{
                  JSON.stringify(modelData, null, 2)
                }}</pre>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.textarea {
  font-size: 0.8em;
  line-height: normal;
}
</style>
