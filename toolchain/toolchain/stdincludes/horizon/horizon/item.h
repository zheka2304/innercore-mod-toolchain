//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_ITEM_H
#define HORIZON_ITEM_H

#include <stdlib.h>
#include <string.h>

class Item;
class IdentifierPool;

class CustomItem : public Item {
public:
    CustomItem(std::string const& nameId);
};



namespace ItemRegistry {
    const int ITEM_REGISTER_OFFSET = 1024;
    const int ITEM_REGISTER_MAX = 64502;
    const int ITEM_REGISTER_COUNT = ITEM_REGISTER_MAX - ITEM_REGISTER_OFFSET;

    struct Extra {
        bool graphicsUpdateRequired = true;
    };

    IdentifierPool* Pool;

    Item* getItemForId(unsigned short id);
    Item* getItemForId(std::string name);
    unsigned int registerVanillaItem(Item* item, std::string nameId, unsigned int numericId);
    unsigned int registerNewFixedItem(Item* item, std::string nameId, unsigned int id);
    unsigned int registerNewItem(Item* item, std::string nameId);
    Extra* getRegistrationExtra(int id);
    Extra* getRegistrationExtra(Item* item);
}


#endif //HORIZON_ITEM_H
