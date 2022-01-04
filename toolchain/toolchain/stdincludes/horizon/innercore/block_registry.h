

#ifndef INNER_CORE_BLOCK_REGISTRY_H
#define INNER_CORE_BLOCK_REGISTRY_H

#include <string>
#include <logger.h>
#include "common.h"


class Block;
class BlockLegacy;
class BlockGraphics;
class BlockPos;
class ItemStack;
class TextureUVCoordinateSet;
class Material;


class BlockProvider {
public:
	BlockLegacy* block;
	
	BlockProvider();

	virtual void onBlockCreated();  // called when block is created, by default creates states and registers block item for default state
	virtual void onBlockItemCreated(); // used for item setup from default onBlockCreated
	virtual void onAddToCreative();  
	virtual void onGraphicsInit(BlockGraphics& graphics);  // by default sets missing texture to all sides
	virtual void setupBlock(); // used for block setup from default onBlockCreated
	virtual void patchVtable(void** vtable); // used for block vtable patching from default onBlockCreated
	virtual void patchItemVtable(void** vtable); // used for block item vtable patching from default onBlockItemCreated & onBlockCreated

	virtual std::string getNameForBlock(Block& variant);
	virtual std::string getNameForItemStack(ItemStack& stack);
	virtual int getCreativeCategoryForStack(ItemStack& stack);
	virtual TextureUVCoordinateSet* getCustomWorldTexture(BlockPos& pos, int side, int variant);
	virtual TextureUVCoordinateSet* getCustomCarriedTexture(int side, int variant);
	virtual stl_vector<TextureUVCoordinateSet>* getTexturesForBreakingParticles(int side, int variant);
	virtual bool isFullAndOpaque(int variant);
};


namespace BlockRegistry {
	BlockLegacy* getBlockById(int id);
	BlockLegacy* getBlockByName(std::string name);
	Block* getBlockStateForIdData(int id, int data);
	BlockGraphics* getBlockGraphicsForIdData(int id, int data);
	BlockProvider* getBlockProviderById(int id);

	IdPool* getBlockIdPool();
	BlockLegacy* registerBlock(BlockLegacy* block, BlockProvider* provider);

	template<class BlockClass, class ...Args>
	BlockClass* registerBlockFixed(BlockProvider* provider, int id, std::string nameId, Args... args) {
		IdPool* pool = getBlockIdPool();
		id = pool->allocateId(nameId, id, IdPool::FLAG_ID_USED);
	    if (id != INVALID_ID) {
	    	BlockClass* block = new BlockClass(to_stl(nameId), id, args...);
	    	registerBlock((BlockLegacy*) block, provider);
	    	return block;
		} else {
			Logger::error("InnerCore-BlockRegistry", "failed to register block for id '%s': cannot allocate id for some reason", nameId.data());
			return NULL;
		}
	};
};

#endif