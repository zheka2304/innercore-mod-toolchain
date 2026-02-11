
#ifndef INNER_CORE_ID_POOL_H
#define INNER_CORE_ID_POOL_H

#include <string>

typedef int content_id_t;

#define INVALID_ID ((content_id_t) 0x7FFFFFFF)


enum IdPoolPolicy {
	// keep all unused ids until it is required, the search is cyclic
	ID_POLICY_GREEDY = 0,
	// remove all unused ids, the search is iterating all ids from start
	ID_POLICY_COMPACT = 1,
};

class IdPool {
public:
	static const int FLAG_ID_USED = 1; // byte 0
	static const int FLAG_VANILLA = 2; // byte 1

public:
	bool isOccupied(content_id_t id);
	content_id_t allocateId(std::string name, content_id_t predefined, int flags); 
	content_id_t allocateId(std::string name, int flags); 
	bool freeId(std::string name);
	bool freeId(content_id_t id);
};

#endif