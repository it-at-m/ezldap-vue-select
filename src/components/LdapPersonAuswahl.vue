<script lang="ts"></script>

<script setup lang="ts">
import { ref, watch, useAttrs } from "vue";
import { ApiError, ERROR } from "./error";

type Props = {
  modelValue: any;
  baseUrl?: string;
  debounce?: number;
  mucatarBaseUrl?: string;
  mucatarMode?: string;
  id?: string;
  initialLookup?: boolean;
  defaultSlots?: boolean;
};

const props: Props = withDefaults(defineProps<Props>(), {
  baseUrl: "https://ezldap.muenchen.de",
  debounce: 300,
  mucatarBaseUrl: "https://mucatar.muenchen.de",
  mucatarMode: "404",
  id: "ldap-person-auswahl",
  initialLookup: false,
  defaultSlots: true
});

const emit = defineEmits<{
  (e: "loading", isLoading: boolean): void;
  (e: "fetch-error", error: ApiError): void;
  (e: "update:modelValue", value: any): void;
}>();

const item = ref();
const search = ref<string>();
let isLoading = ref(false);
const items = ref(new Array<any>());

const attrs = useAttrs();

function mucatarURL(username: string) {
  return `${props.mucatarBaseUrl}/avatar?uid=${username}&m=${props.mucatarMode}`;
}

async function updateValue(newVal: any) {
  item.value = newVal;
  if (attrs.multiple) {
    items.value = [...newVal];
    // lookup on multiple not yet supported
  } else {
    if (_isDataProvided(newVal)) {
      // dont do a lookup, data already provided
      items.value = [newVal];
    } else if (props.initialLookup == true) {
      if (newVal != null && newVal.lhmObjectId) {
        // just lhmObjectId provided, lookup by doing api call
        let lookedupUser = await _findByLhmObjectId(
          props.baseUrl!,
          newVal.lhmObjectId
        );
        if (lookedupUser != null) {
          // strip down full response
          let entry = _extractData(lookedupUser);
          items.value = [entry];
          emit("update:modelValue", entry);
        }
      } else if (newVal != null && newVal.uid) {
        // just uid provided, lookup by doing api call
        let lookedupUser = await _findByUid(props.baseUrl!, newVal.uid);
        if (lookedupUser != null) {
          // strip down full response
          let entry = _extractData(lookedupUser);
          items.value = [entry];
          emit("update:modelValue", entry);
        }
      }
    }
  }
}

function _isDataProvided(val: any) {
  return val != null && val.lhmObjectId && val.cn && val.ou;
}

function _extractData(lookedupUser: any) {
  return {
    lhmObjectId: lookedupUser.lhmObjectId,
    cn: lookedupUser.cn,
    uid: lookedupUser.uid,
    ou: lookedupUser.ou,
    anrede: lookedupUser.anrede,
    vorname: lookedupUser.vorname,
    nachname: lookedupUser.nachname
  };
}

if (props.modelValue) {
  updateValue(props.modelValue);
}

watch(search, (newVal: any, _oldVal: any) => {
  if (newVal && newVal.length >= 3) {
    debouncedSearch(props.baseUrl, newVal);
  }
});

watch(
  () => props.modelValue,
  (newVal, _oldVal) => {
    updateValue(newVal);
  }
);

watch(isLoading, (newVal: boolean, _oldVal: boolean) => {
  emit("loading", newVal);
});

async function _performLookupRequest(url: string) {
  isLoading.value = true;
  try {
    let response = await fetch(url, {
      mode: "cors"
    });
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (e) {
    if (e instanceof Error) {
      let error = new ApiError(ERROR, "Aufruf von ezLDAP fehlgeschlagen", e);
      emit("fetch-error", error);
      throw error;
    } else {
      throw e;
    }
  } finally {
    isLoading.value = false;
  }
}

async function _findByLhmObjectId(baseUrl: string, val: string) {
  return await _performLookupRequest(`${baseUrl}/v1/ldap/user/${val}`);
}

async function _findByUid(baseUrl: string, val: string) {
  return await _performLookupRequest(
    `${baseUrl}/v1/ldap/search/findByUid?uid=${val}`
  );
}

async function _performSearchRequest(baseUrl: string, val: string) {
  isLoading.value = true;
  try {
    let response = await fetch(
      `${baseUrl}/v1/ldap/search/findByUidWildcard?uid=*${val}*`,
      {
        mode: "cors"
      }
    );
    if (response.ok) {
      let data = await response.json();
      items.value = data;
    } else {
      if (!response.ok) {
        throw new Error("ezLDAP request failed with status " + response.status);
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      let error = new ApiError(ERROR, "Aufruf von ezLDAP fehlgeschlagen", e);
      emit("fetch-error", error);
      throw error;
    } else {
      throw e;
    }
  } finally {
    isLoading.value = false;
  }
}

const debounce = (fn: Function) => {
  if (props.debounce !== undefined && props.debounce > 0) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), props.debounce);
    };
  } else {
    return function (this: any, ...args: any[]) {
      fn.apply(this, args);
    };
  }
};
const debouncedSearch = debounce(_performSearchRequest);
</script>

<template>
  <v-autocomplete
    v-bind="$attrs"
    :id="id"
    v-model:model-value="item"
    v-model:search="search"
    :loading="isLoading"
    :items="items"
    item-title="uid"
    item-value="uid"
    return-object
    no-filter
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- default selection slot -->
    <template v-if="props.defaultSlots" #selection="data">
      <template v-if="data.item.raw.cn && data.item.raw.ou">
        {{ data.item.raw.cn }} ({{ data.item.raw.ou }})
      </template>
      <template v-else-if="data.item.raw.uid">
        {{ data.item.raw.uid }}
      </template>
      <template v-else-if="data.item.raw.lhmObjectId">
        lhmObjectId: {{ data.item.raw.lhmObjectId }}
      </template>
    </template>
    <!-- default item slot -->
    <template v-if="props.defaultSlots" #item="itemSlot">
      <v-list-item
        :data-testid="`${props.id}-${itemSlot.item.raw.uid}`"
        v-bind="itemSlot.props"
        :title="itemSlot.item.raw.cn"
        :subtitle="itemSlot.item.raw.ou"
      >
        <template #prepend>
          <v-avatar>
            <v-img :src="mucatarURL(itemSlot.item.raw.uid)">
              <template #placeholder>
                <v-icon size="x-large">mdi-account</v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
