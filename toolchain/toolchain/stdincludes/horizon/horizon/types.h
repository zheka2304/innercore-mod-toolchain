//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_TYPES_H
#define HORIZON_TYPES_H

struct Vec3 {
    float x, y, z;
};

struct BlockPos {
    int x, y, z;
};

struct AABB {
    float minX, minY, minZ, maxX, maxY, maxZ;

    AABB(float, float, float, float, float, float);
    AABB(Vec3 const&, Vec3 const&);
};

struct Color {
    float r, g, b, a;
};

#endif //HORIZON_TYPES_H
