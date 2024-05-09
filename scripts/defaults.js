import { localize, getSetting } from './utils';

/**
 * Default categories and groups
 */
export function createDefaults() {
   const maxWeapons = getSetting('maxWeapons');
   const maxSpellTraditions = getSetting('maxSpellTraditions');

   // Get the groups for weapons
   const weaponSubGroups = [];
   for (let idx = 0; idx < maxWeapons; idx++) {
      weaponSubGroups.push({
         nestId: `weapons_weapon${idx}`,
         id: `weapon${idx}`,
         name: '',
         type: 'system'
      });
   }

   // Get the groups for spells
   const spellTraditionSubGroups = [];
   for (let idx = 0; idx < maxSpellTraditions; idx++) {
      spellTraditionSubGroups.push({
         nestId: `spells_tradition${idx}`,
         id: `tradition${idx}`,
         name: '',
         type: 'system'
      });
   }

   // attributes sub group
   const attributes_attributes = {
      nestId: 'attributes_attributes',
      id: 'attributes',
      name: localize('attributes'),
      type: 'system'
   };
   // attributes sub group
   const attributes_test = {
      nestId: 'attributes_test',
      id: 'test',
      name: 'test',
      type: 'system'
   };

   // Resistances sub group
   const resistances_resistances = {
      nestId: 'resistances_resistances',
      id: 'resistances',
      name: localize('resistances'),
      type: 'system'
   };

   // Skills sub group
   const skills_skills = {
      nestId: 'skills_skills',
      id: 'skills',
      name: localize('skills'),
      type: 'system'
   };

   // Equipment sub group
   const equipment_equipment = {
      nestId: 'equipment_equipment',
      id: 'equipment',
      name: localize('equipment'),
      type: 'system'
   };

   // Abilities sub group
   const abilities_abilities = {
      nestId: 'abilities_abilities',
      id: 'abilities',
      name: localize('abilities'),
      type: 'system'
   };

   // Recovery sub group
   const utility_recovery = {
      nestId: 'utility_recovery',
      id: 'recovery',
      name: localize('recovery'),
      type: 'system'
   };

   // Resources sub group
   const utility_resources = {
      nestId: 'utility_resources',
      id: 'resources',
      name: localize('resources'),
      type: 'system'
   };

   // Utility sub group
   const utility_effects = {
      nestId: 'utility_effects',
      id: 'effects',
      name: localize('effects'),
      type: 'system'
   };

   // Create of all sub groups
   const subGroupsArray = [
      attributes_attributes,
      attributes_test,
      resistances_resistances,
      skills_skills,
      ...weaponSubGroups,
      equipment_equipment,
      abilities_abilities,
      ...spellTraditionSubGroups,
      utility_recovery,
      utility_resources,
      utility_effects
   ];

   // Create the group layout
   const layout = [
      {
         nestId: 'attributes',
         id: 'attributes',
         name: localize('attributes'),
         groups: [attributes_attributes, attributes_test]
      },
      {
         nestId: 'resistances',
         id: 'resistances',
         name: localize('resistances'),
         groups: [resistances_resistances]
      },
      {
         nestId: 'skills',
         id: 'skills',
         name: localize('skills'),
         groups: [skills_skills]
      },
      {
         nestId: 'weapons',
         id: 'weapons',
         name: localize('weapons'),
         groups: weaponSubGroups
      },
      {
         nestId: 'equipment',
         id: 'equipment',
         name: localize('equipment'),
         groups: [equipment_equipment]
      },
      {
         nestId: 'abilities',
         id: 'abilities',
         name: localize('abilities'),
         groups: [abilities_abilities]
      },
      {
         nestId: 'spells',
         id: 'spells',
         name: localize('spells'),
         groups: spellTraditionSubGroups
      },
      {
         nestId: 'utility',
         id: 'utility',
         name: localize('utility'),
         groups: [
            utility_recovery,
            utility_resources,
            utility_effects
         ]
      }
   ];

   return {
      layout: layout,
      groups: subGroupsArray
   };
}
