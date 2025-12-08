#ifndef INNER_CORE_ITEM_EXTRA_H
#define INNER_CORE_ITEM_EXTRA_H

#include <map>
#include <mutex>
#include <string>


class ItemStack;
class CompoundTag;

class ItemInstanceExtra {
public:
    bool isFinalizable = false;
    bool isNull = true;

    std::mutex mutex;
    std::map<int, int> enchantMap;
    bool hasName = false;
    std::string name = "";
    bool hasModExtra = false;
    std::string modExtra = "";
    CompoundTag* itemTag = nullptr;

    ItemInstanceExtra();
    ItemInstanceExtra(ItemStack* itemStack);
    ~ItemInstanceExtra();

    // Retrieves extra data from ItemStack
    void pull(ItemStack* itemInstance);
    void pullModData(ItemStack* itemInstance);
    
    // Applies extra data to ItemStack
    void apply(ItemStack* itemInstance);

    // clones from another ItemInstanceExtra
    void clone(ItemInstanceExtra* extra);

    bool isEnchanted();
    void addEnchant(int type, int level);
    void removeEnchant(int type);
    int getEnchantLevel(int id);
    void removeAllEnchants();
    int getEnchantCount();

    const char* getModExtra();
    void setModExtra(const char* extra);
    const char* getCustomName();
    void setCustomName(const char* name);
    CompoundTag* getCompoundTag(); // returned tag is cloned from owned tag, it must be destroyed
    void setCompoundTag(CompoundTag* tag); // copies tag inside this function, pointer will not be owned
};


#endif