
#ifndef INNER_CORE_ITEM_REGISTRY_H
#define INNER_CORE_ITEM_REGISTRY_H

#include <string>
#include <logger.h>

#include "common.h"
#include "id_pool.h"


class Item;
class ItemDescriptor;
class ItemStack;

// provider class represents set of callbacks for given item to simplify work with it
class ItemProvider {
public:
	Item* item;
	
	// more callbacks will be added
	virtual void onItemCreated();  // called just after item is registered
	virtual void patchVtable(void**); // patch item vtable (if onItemCreated was not overloaded)
	virtual void setupItem(); // run item setup (if onItemCreated was not overloaded)
	virtual void onAddToCreative();  // called as the item may be added to creative inv
	virtual void onGraphicsUpdate();  // called as the graphics updated and by default resets item icon
	
	virtual std::string getNameForItemStack(ItemStack& stack);
	virtual int getCreativeCategoryForStack(ItemStack& stack);
	virtual bool isAnimatedIcon(ItemStack& stack);
	virtual void updateCustomIcon(ItemStack& stack, int, bool);

	virtual bool isArmorDamageable(ItemDescriptor& stack);
};

namespace ItemRegistry {
	Item* getItemById(int id);
	Item* getItemByName(std::string name);
	ItemProvider* getItemProviderById(int id);
	
	IdPool* getItemIdPool();
	Item* registerItem(Item* item, ItemProvider* provider);

	template<class ItemClass, class ...Args>
	ItemClass* registerItemFixed(ItemProvider* provider, int id, std::string nameId, Args... args) {
		IdPool* pool = getItemIdPool();
		id = pool->allocateId(nameId, id, IdPool::FLAG_ID_USED);
	    if (id != INVALID_ID) {
	    	ItemClass* item = new ItemClass(to_stl(nameId), id, args...);
	    	registerItem((Item*) item, provider);
	    	return item;
		} else {
			Logger::error("InnerCore-ItemRegistry", "failed to register item for id '%s': cannot allocate id for some reason", nameId.data());
			return NULL;
		}
	};
};

#endif