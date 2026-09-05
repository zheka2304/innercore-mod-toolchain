//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_BLOCK_H
#define HORIZON_BLOCK_H

#include <stdlib.h>
#include <string.h>

#include "types.h"

class BlockLegacy;
class BlockGraphics;
class TextureAtlas;
class Material;
class Item;
class IdentifierPool;


enum MaterialType {
    MATERIAL_DEFAULT = 0
};


enum BlockSoundType {
    SOUND_TYPE_DEFAULT = 0
};


class BlockGraphicsInterface {
public:
    BlockGraphics* graphics = NULL;
    BlockLegacy* block = NULL;

    void setSoundType(BlockSoundType type);
    void setTextureAtlas(std::shared_ptr<TextureAtlas> atlas);
    void setMapColor(Color const& color);
    void setVisualShape(AABB const& shape);
    void setVisualShape(Vec3 const& v1, Vec3 const& v2);
    void setCarriedTextureItem(std::string const& s1);
    void setCarriedTextureItem(std::string const& s1, std::string const& s2, std::string const& s3);
    void setCarriedTextureItem(std::string const& s1, std::string const& s2, std::string const& s3, std::string const& s4, std::string const& s5, std::string const& s6);
    void setTextureItem(std::string const& s1);
    void setTextureItem(std::string const& s1, std::string const& s2, std::string const& s3);
    void setTextureItem(std::string const& s1, std::string const& s2, std::string const& s3, std::string const& s4, std::string const& s5, std::string const& s6);
};


class CustomBlock : public BlockLegacy {
public:
    CustomBlock(std::string const& name, Material const& material, int numBlockStates);
    CustomBlock(std::string const& name, Material const& material);
    CustomBlock(std::string const& name);
    CustomBlock(std::string const& name, MaterialType material, int numBlockStates);
    CustomBlock(std::string const& name, MaterialType material);
    BlockGraphicsInterface* getGraphics();
    Item* getBlockItem();
};



namespace BlockRegistry {
    const int BLOCK_REGISTER_OFFSET = 1024;
    const int BLOCK_REGISTER_MAX = 64502;
    const int BLOCK_REGISTER_COUNT = BLOCK_REGISTER_MAX - BLOCK_REGISTER_OFFSET;

    IdentifierPool* Pool;

    BlockGraphicsInterface* getGraphics(BlockLegacy* block);
}

#endif //HORIZON_BLOCK_H
