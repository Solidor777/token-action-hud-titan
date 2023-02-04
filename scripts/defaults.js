import { localize, getSetting } from "./utils";

/**
 * Default categories and subcategories
 */
export function createDefaults() {
   const maxWeapons = getSetting('maxWeapons');
   const maxSpells = getSetting('maxSpellTraditions');

   // Get the main categories for weapons
   function getWeaponCategories(maxIdx) {
      const retVal = [];
      for (let idx = 0; idx < maxIdx; idx++) {
         retVal.push({
            nestId: `weapons_weapon_${idx}`,
            id: `weapon_${idx}`,
            name: '',
            type: 'system',
            hasDerivedSubcategories: false
         });
      }

      return retVal;
   }

   // Get the nested subcategories for weapons
   function getWeaponSubcategories(maxIdx) {
      const retVal = [];
      for (let idx = 0; idx < maxIdx; idx++) {
         retVal.push({
            id: `weapon_${idx}`,
            name: '',
            type: 'system',
            hasDerivedSubcategories:
               false
         });
      }

      return retVal;
   }

   // Geet the main categories for spell traditions
   function getSpellTraditionCategories(maxIdx) {
      const retVal = [];
      for (let idx = 0; idx < maxIdx; idx++) {
         retVal.push({
            nestId: `spells_tradition_${idx}`,
            id: `tradition_${idx}`,
            name: '',
            type: 'system',
            hasDerivedSubcategories: false
         });
      }

      return retVal;
   }

   // Get the nested subcategories for spells
   function getSpellTraditionSubcategories(maxIdx) {
      const retVal = [];
      for (let idx = 0; idx < maxIdx; idx++) {
         retVal.push({
            id: `tradition_${idx}`,
            name: '',
            type: 'system',
            hasDerivedSubcategories:
               false
         });
      }

      return retVal;
   }

   return {
      categories: [
         {
            nestId: 'attributes',
            id: 'attributes',
            name: localize('attributes'),
            subcategories: [{
               nestId: 'attributes_attributes',
               id: 'attributes',
               name: localize('attributes'),
               type: 'system',
               hasDerivedSubcategories: false
            }],
         },
         {
            nestId: 'resistances',
            id: 'resistances',
            name: localize('resistances'),
            subcategories: [{
               nestId: 'resistances_resistances',
               id: 'resistances',
               name: localize('resistances'),
               type: 'system',
               hasDerivedSubcategories: false
            }],
         },
         {
            nestId: 'skills',
            id: 'skills',
            name: localize('skills'),
            subcategories: [{
               nestId: 'skills_skills',
               id: 'skills',
               name: localize('skills'),
               type: 'system',
               hasDerivedSubcategories: false
            }],
         },
         {
            nestId: 'weapons',
            id: 'weapons',
            name: localize('weapons'),
            subcategories: getWeaponCategories(maxWeapons)
         },
         {
            nestId: 'equipment',
            id: 'equipment',
            name: localize('equipment'),
            subcategories: [{
               nestId: 'equipment_equipment',
               id: 'equipment',
               name: localize('equipment'),
               type: 'system',
               hasDerivedSubcategories: false
            }],
         },
         {
            nestId: 'abilities',
            id: 'abilities',
            name: localize('abilities'),
            subcategories: [{
               nestId: 'abilities_abilities',
               id: 'abilities',
               name: localize('abilities'),
               type: 'system',
               hasDerivedSubcategories: false
            }],
         },
         {
            nestId: 'spells',
            id: 'spells',
            name: localize('spells'),
            subcategories: getSpellTraditionCategories(maxSpells)
         },
         {
            nestId: 'utility',
            id: 'utility',
            name: localize('utility'),
            subcategories: [
               {
                  nestId: 'utility_recovery',
                  id: 'recovery',
                  name: localize('recovery'),
                  type: 'system'
               },
               {
                  nestId: 'utility_resources',
                  id: 'resources',
                  name: localize('resources'),
                  type: 'system'
               },
               {
                  nestId: 'utility_effects',
                  id: 'effects',
                  name: localize('effects'),
                  type: 'system'
               },
            ],
         }
      ],
      subcategories: [
         { id: 'attributes', name: localize('attributes'), type: 'system', hasDerivedSubcategories: false },
         { id: 'skills', name: localize('skills'), type: 'system', hasDerivedSubcategories: false },
         { id: 'resistances', name: localize('resistances'), type: 'system', hasDerivedSubcategories: false },
         ...getWeaponSubcategories(maxWeapons),
         { id: 'abilities', name: localize('abilities'), type: 'system', hasDerivedSubcategories: false },
         ...getSpellTraditionSubcategories(maxSpells),
         { id: 'recovery', name: localize('recovery'), type: 'system', hasDerivedSubcategories: false },
         { id: 'resources', name: localize('resources'), type: 'system', hasDerivedSubcategories: false },
         { id: 'effects', name: localize('effects'), type: 'system', hasDerivedSubcategories: false },
      ]
   }
}