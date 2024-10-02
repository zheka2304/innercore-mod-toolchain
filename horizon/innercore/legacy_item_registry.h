#ifndef INNER_CORE_ITEMS_LEGACY_H
#define INNER_CORE_ITEMS_LEGACY_H

#include <string>
#include <unordered_map>
#include <vector>
#include "item_extra.h"
#include "item_registry.h"


namespace LegacyItemRegistry {
	enum LegacyItemProviderType {
		PROVIDER_TYPE_INVALID,
		PROVIDER_TYPE_ITEM,
		PROVIDER_TYPE_ARMOR,
		PROVIDER_TYPE_THROWABLE
	};

	class LegacyItemFactoryBase {
	public:
		struct Properties {
			// basic parameters
			std::string nameToDisplay = "<unknown>";
			std::string iconName = "missing_item";
			int iconIndex = 0;

			// basic properties
			int durability = 0;
			int stack = 64;
			int animationId = -1;
			int maxUseDuration = -1;
			int creativeCategory = -1;
			int enchantType = 0;
			int enchantValue = 0;
			std::vector<int> repairItemIds;

			// flags
			bool isGlint = false;
			bool isHandEquipped = false;
			bool isLiquidClip = false;
			bool isIconControlled = false;
			bool isIconAnimated = false;
			bool isArmorDamageable = false;
			bool isStackedByData = true;
			bool isAllowedInOffhand = false;

			// init
			std::string initProperties = "";

			void apply(Item* item);

            Properties();
            ~Properties();
		};

		// currently registered item
		Item* item = nullptr;
		int id = 0;
		std::string nameId;
		Properties props;

        LegacyItemFactoryBase();
        ~LegacyItemFactoryBase();

		virtual void registerItem();
		void initParameters(int id, std::string nameId, std::string name, std::string textureName, int textureIndex);
		void applyProperties();
		virtual int getType();
	};

	class LegacyItemFactory : public LegacyItemFactoryBase {
	public:
        LegacyItemFactory();
        ~LegacyItemFactory();

		virtual void registerItem();
		virtual int getType();
	};
    
	
	class LegacyItemProviderBase : public ItemProvider {
	public:
		struct { char filler[72]; } iconOverride;

        LegacyItemProviderBase();
        ~LegacyItemProviderBase();

		virtual void onItemCreated();
		virtual void onGraphicsUpdate();

		virtual void preSetup();
		void setupVtable();
		virtual void setupVtable(void*);
		virtual void setupProperties();
		virtual LegacyItemFactoryBase* getFactory();
		
		virtual bool isAnimatedIcon(ItemStack& stack);
		virtual void updateCustomIcon(ItemStack& stack, int, bool);
		virtual std::string getNameForItemStack(ItemStack&);
        virtual int getCreativeCategoryForStack(ItemStack& stack);
		virtual bool isArmorDamageable(ItemDescriptor&);
	};

	class LegacyItemProvider : public LegacyItemProviderBase {
	public:
		LegacyItemFactory* factory;
		LegacyItemProvider(LegacyItemFactory*);
        ~LegacyItemProvider();

		virtual LegacyItemFactoryBase* getFactory();
	};


	void registerItemFactory(LegacyItemFactoryBase*);
	LegacyItemFactoryBase* findFactoryById(int id);
	void addItemToCreative(std::string id, int count, int data, ItemInstanceExtra* extra);
	void addItemToCreative(int id, int count, int data, ItemInstanceExtra* extra);
	
	extern std::unordered_map<int, LegacyItemFactoryBase*> registeredFactories;
	
};

#endif
