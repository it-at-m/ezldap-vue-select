import LdapPersonAuswahl from "./LdapPersonAuswahl.vue";

describe("<LdapPersonAuswahl />", () => {
  it("renders", () => {
    // intercept api and mucatar requests
    cy.intercept(
      "GET",
      "http://api.example.com/v1/ldap/search/findByUidWildcard?uid=*",
      {
        fixture: "ezldap-findByUidWildcard.json",
      }
    ).as("anyApiRequest");
    cy.intercept("GET", "http://mucatar.example.com/avatar?uid=michaela*", {
      fixture: "avatar.png,null",
    }).as("mucatarRequestMichaela");
    cy.intercept("GET", "http://mucatar.example.com/avatar?uid=amicha*", {
      fixture: "avatar.png,null",
    }).as("mucatarRequestAmicha");

    cy.mount(LdapPersonAuswahl, {
      props: {
        label: "the custom label",
        modelValue: undefined,
        mucatarBaseUrl: "http://mucatar.example.com",
        baseUrl: "http://api.example.com",
      },
    });

    cy.get("#ldap-person-auswahl").type("mich");

    cy.wait("@anyApiRequest");
    cy.get(
      '[data-testid="ldap-person-auswahl-amicha.miller"] .v-list-item-title'
    ).contains("Amicha Miller");
    cy.get(
      '[data-testid="ldap-person-auswahl-amicha.miller"] .v-list-item-subtitle'
    ).contains("ORG-A1-A12");
    cy.get(
      '[data-testid="ldap-person-auswahl-michaela.miller"] .v-list-item-title'
    ).contains("Michaela Miller");
    cy.get(
      '[data-testid="ldap-person-auswahl-michaela.miller"] .v-list-item-subtitle'
    ).contains("ORG-A2-A24");
    cy.wait("@mucatarRequestMichaela");
    cy.wait("@mucatarRequestAmicha");
    cy.get(
      '[data-testid="ldap-person-auswahl-michaela.miller"] .v-list-item__prepend'
    )
      .find("img")
      .should(
        "have.prop",
        "src",
        "http://mucatar.example.com/avatar?uid=michaela.miller&m=404"
      );

    cy.get(
      '[data-testid="ldap-person-auswahl-michaela.miller"] .v-list-item-title'
    ).click();

    cy.get(".v-autocomplete__selection").should(
      "contain.text",
      "Michaela Miller (ORG-A2-A24)"
    );
  });
});
