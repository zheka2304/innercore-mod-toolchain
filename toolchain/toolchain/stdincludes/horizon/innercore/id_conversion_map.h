#ifndef INNER_CORE_ID_CONVERSION_MAP
#define INNER_CORE_ID_CONVERSION_MAP

// Namespace is used to convert ids from mod (static) to real (dynamic) value and back.
// This is used both for vanilla ids and mod ids:
// - Vanilla ids are converted between legacy variant used by all mods (static) and insides of new minecraft system, where they are generated at runtime (dynamic)
// - Mod ids are converted during multiplayer game, because ids in mods remain unchanged (static) and ids in minecraft insides are changed to server variant, when connecred to world (dynamic)
namespace IdConversion {
    enum Scope {
        ITEM, 
        BLOCK
    };

    int dynamicToStatic(int dynamicId, Scope scope);
    int staticToDynamic(int staticId, Scope scope);
};

#endif //INNER_CORE_ID_CONVERSION_MAP