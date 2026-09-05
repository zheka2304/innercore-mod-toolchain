//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_POOL_H
#define HORIZON_POOL_H

#include <string.h>
#include <stdlib.h>

class IdentifierPool;

struct RegisteredIdentifier {
    IdentifierPool* pool;
    unsigned int id;
    RegisteredIdentifier();
    RegisteredIdentifier(IdentifierPool* pool, unsigned int id);
};

class IdentifierPool {
public:
    static const unsigned int INVALID_ID = 4294967295u;

private:
    IdentifierPool* parent;

    const char* prefix;
    unsigned int boundMin = 0u;
    unsigned int boundMax = 4294967295u;
    unsigned int unique = 0u;

    std::map<std::string, IdentifierPool*> children;
    std::map<std::string, RegisteredIdentifier> identifiers;
    std::map<std::string, bool> localNames;
    std::map<unsigned int, bool> localIds;

public:
    IdentifierPool(const char* prefix);
    IdentifierPool();

    IdentifierPool* getChildPool(std::string prefix, unsigned int boundMin, unsigned int boundMax);
    bool containsName(std::string name);
    bool containsId(unsigned int id);
    unsigned int get(std::string nameID);
    unsigned int getRegistered(std::string nameID);
    void put(std::string nameID, unsigned int id);
    void printAllContents();
};


#endif //HORIZON_POOL_H
