#ifndef INNER_CORE_BLOCKS_LEGACY_H
#define INNER_CORE_BLOCKS_LEGACY_H

#include <vector>
#include <string>
#include <unordered_map>

#include "block_registry.h"


namespace LegacyBlockRegistry {
    class BlockVariant {
    public:
        struct AABB {
            float aabb[6];
        } shape;
        bool isFullCubeShape = true;

        int variant = 0;
        std::string nameToDisplay;
        struct { char filler[72]; } textureData;
        bool addToCreative = true;

        BlockVariant();
        BlockVariant(int variant, std::string const& name, bool addToCreative);
        void setShape(AABB& aabb);
    };

    class LegacyBlockFactoryBase {
    public:
        struct Properties {
            enum BlockColorSource : int {
                NONE = 0,
                LEAVES = 1,
                GRASS = 2,
                WATER = 3
            };

            int material = 0;
            int materialBaseBlockId = 0; // 0 turns off this parameter
            int creativeCategory = 1;

            bool isSolid = false;
            bool isRedstoneTile = false;
            bool isConnectedToRedstone = false;
            bool isRedstoneEmitter = false;
            bool isTickingTile = false;
            bool isAnimatedTile = false;
            bool isTransparent = false; // for internal hooks
            bool canContainLiquid = false;
            bool canBeExtraBlock = false;

            bool isReceivingEntityInsideEvent = false;
            bool isReceivingNeighbourChangedEvent = false;
            bool isReceivingStepOnEvent = false;

            float destroyTime = 0;
            float explosionResistance = 0;
            float translucency = 0;
            float friction = 1.0f;
            int lightLevel = 0;
            int lightOpacity = 0;
            int renderLayer = 0;
            int renderType = 0;
            unsigned int mapColor = 0;
            std::string soundType = "";
            BlockColorSource blockColorSource = NONE;

            Material* getMaterial();
            void apply(BlockLegacy* block, int variantCount);
            void applyGraphics(BlockLegacy* block, int variantCount);

            Properties();
            ~Properties();
        };

		// currently registered block
		BlockLegacy* block = nullptr;
        int id;
        std::string nameId;
        std::vector<BlockVariant> variants;
        
        Properties props;

        LegacyBlockFactoryBase();
        ~LegacyBlockFactoryBase();
        
		virtual void registerBlock();
		void initParameters(int id, std::string nameId);
        BlockVariant* addVariant(std::string name, bool addToCreative);
        virtual void applyProperties();
        virtual void applyBlockGraphicsProperties();
    };

    class LegacyBlockFactory : public LegacyBlockFactoryBase {
    public:
        LegacyBlockFactory();
        ~LegacyBlockFactory();

		virtual void registerBlock();
    };


    class LegacyBlockProviderBase : public BlockProvider {
    public:
        LegacyBlockProviderBase();
        ~LegacyBlockProviderBase();

        void _setupFactory();
        virtual void setupBlock();
        virtual void patchVtable(void** vtable);
        virtual void onAddToCreative();
        virtual void onGraphicsInit(BlockGraphics& graphics);
        
        virtual TextureUVCoordinateSet* getCustomWorldTexture(BlockPos& pos, int side, int variant);
        virtual TextureUVCoordinateSet* getCustomCarriedTexture(int side, int variant);
	    virtual stl_vector<TextureUVCoordinateSet>* getTexturesForBreakingParticles(int side, int variant);
        virtual bool isFullAndOpaque(int variant);

        virtual std::string getNameForBlock(Block& block);
        virtual std::string getNameForItemStack(ItemStack& stack);
        virtual int getCreativeCategoryForStack(ItemStack& stack);
        
		virtual LegacyBlockFactoryBase* getFactory();
        std::vector<BlockVariant>& getVariants();
    };

    class LegacyBlockProvider : public LegacyBlockProviderBase {
    public:
        LegacyBlockFactory* factory = nullptr;
        LegacyBlockProvider(LegacyBlockFactory* factory);
        ~LegacyBlockProvider();

		virtual LegacyBlockFactoryBase* getFactory();
    };


    void registerBlockFactory(LegacyBlockFactoryBase* factory);
	LegacyBlockFactoryBase* findFactoryById(int id);
	
    extern std::unordered_map<int, LegacyBlockFactoryBase*> registeredFactories;
	
};

#endif
