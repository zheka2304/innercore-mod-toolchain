#ifndef INNER_CORE_BLOCK_REGISTRY_H
#define INNER_CORE_BLOCK_REGISTRY_H

#include <string>


class Block;
class BlockLegacy;
class BlockPos;
class ItemStack;
class TextureUVCoordinateSet;

class BlockProvider {
public:
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
	virtual void* getTexturesForBreakingParticles(int side, int variant);
	virtual bool isFullAndOpaque(int variant);
};


namespace BlockRegistry {
	BlockLegacy* getBlockById(int id);
	BlockLegacy* getBlockByName(std::string name);
	Block* getBlockStateForIdData(int id, int data);
	BlockGraphics* getBlockGraphicsForIdData(int id, int data);
	BlockProvider* getBlockProviderById(int id);
};

#endif //INNER_CORE_BLOCK_REGISTRY_H