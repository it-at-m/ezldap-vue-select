import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VAutocomplete } from "vuetify/components";
import { nextTick } from "vue";
import { LdapPersonAuswahl } from "../src/components/index";
import { describe, it, vi, expect } from "vitest";

describe("LdapPersonAuswahl.vue", () => {
  // eslint-disable-next-line no-unused-vars
  const vuetify = createVuetify({ components, directives });

  const initialValue = {
    lhmObjectId: "123456789",
    uid: "vorname.nachname",
    cn: "Vorname Nachname",
    ou: "ABO-123"
  };

  it("kann über modelValue prop (v-model) initialisiert werden", async () => {
    const wrapper = shallowMount(LdapPersonAuswahl, {
      props: {
        label: "my custom label",
        modelValue: initialValue
      }
    });
    await nextTick();

    expect(wrapper.vm.modelValue.lhmObjectId).toEqual(initialValue.lhmObjectId);
  });

  it("hat eine default-id", async () => {
    const wrapper = shallowMount(LdapPersonAuswahl, {
      props: {
        modelValue: null
      }
    });
    console.log(wrapper.html());
    await nextTick();

    expect(wrapper.find("#ldap-person-auswahl").exists()).toBeTruthy();
  });

  it("hat customizable id", async () => {
    const wrapper = shallowMount(LdapPersonAuswahl, {
      props: {
        modelValue: null,
        id: "my-custom-id"
      }
    });

    expect(wrapper.find("#my-custom-id").exists()).toBe(true);
  });

  it("passes through props to v-autocomplete", async () => {
    const wrapper = shallowMount(LdapPersonAuswahl, {
      props: {
        modelValue: null,
        density: "compact",
        variant: "outlined",
        unknownprop: "unknownValue"
      }
    });

    let vAutocompleteStub = wrapper.findComponent(VAutocomplete);
    expect(vAutocompleteStub.exists()).toBeTruthy();
    expect(vAutocompleteStub.props().density).toBe("compact");

    expect(vAutocompleteStub.props().variant).toBe("outlined");
    // is passed through
    expect(vAutocompleteStub.attributes().unknownprop).toBeTruthy();
    // but is not a known prop of the component VAutocomplete
    expect(vAutocompleteStub.props().unknownprop).toBeUndefined();
  });

  it("passes through events from v-autocomplete", async () => {
    const onChange = vi.fn();
    const wrapper = shallowMount(LdapPersonAuswahl, {
      props: {
        "onUpdate:modelValue": (e) => onChange(e)
      }
    });
    let vAutocompleteStub = wrapper.findComponent(VAutocomplete);
    vAutocompleteStub.vm.$emit("update:modelValue", {});
    await nextTick();

    expect(onChange).toHaveBeenCalled();
  });
});
