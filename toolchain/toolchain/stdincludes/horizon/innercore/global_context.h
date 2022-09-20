#ifndef INNER_CORE_GLOBAL_CONTEXT_H
#define INNER_CORE_GLOBAL_CONTEXT_H


class AppPlatform;
class AppLifecycleContext;
class BlockSource;
class ClientInstance;
class Minecraft;
class LocalPlayer;
class ServerPlayer;
class Level;
class ServerLevel;
class GameMode;
class MinecraftGraphics;
class LevelRenderer;
class LevelRendererPlayer;
class Tessellator;


// This is interface, used by deprecated World module in Core Engine API to provide block sources
// As World is now deprecated, this module should be used only to provide block source during Inner Core generation callbacks, 
// in other cases you should instead use block sources, provided in your context, or pass it from js as jlong via blockSource.getPointer() 
namespace BlockSourceProvider {
	// Provides block source for current thread, updates it, if required
	// Always provides server-side block source, based on hosting player, if server level exists, in case of remote world, gets block source from local player
	// This block source also overrided for world generation thread while inside inner core generation callback
	BlockSource* getBlockSource();

	// sets block update settings for current thread
	void setAllowBlockUpdate(bool allow);
	bool isBlockUpdateAllowed();
	void setBlockUpdateType(int type);
	int getBlockUpdateType();

	// sets block using provider params to automatically provided source
	void setBlock(int x, int y, int z, Block const& block);
};

// used to update render cache once graphics is updated
class GlobalRenderCacheValidator {
public:
	int localCacheKey;

	GlobalRenderCacheValidator(bool valid = true);
	bool isValid();
	void validate();
	void invalidate();

	static void invalidateGlobalCache();
};

namespace GlobalContext {
	// get AppPlatform instance
	AppPlatform* getAppPlatform();
	// get AppLifecycleContext instance
	AppLifecycleContext* getAppLifecycleContext();

	// get ClientInstance
	ClientInstance* getMinecraftClient();

	// get client side Minecraft instance 
	Minecraft* getMinecraft();
	// get server side Minecraft instance
	Minecraft* getServerMinecraft();
	// get client player instance
	LocalPlayer* getLocalPlayer();
	// get server player instance (hosting player or null, if it is remote world)
	ServerPlayer* getServerPlayer();
	// get client level instance
	Level* getLevel();
	// get server level instance
	ServerLevel* getServerLevel();
	// get GameMode instance (server side)
	GameMode* getGameMode();

	// get MinecraftGraphics instance
	MinecraftGraphics* getMinecraftGraphics();
	// get LevelRenderer instance
	LevelRenderer* getLevelRenderer();
	// get LevelRendererPlayer instance
	LevelRendererPlayer* getLevelRendererPlayer();
	// get global Tessellator instance, but you should consider creating your own instead
    Tessellator* getLevelTessellator();

}

#endif //INNER_CORE_GLOBAL_CONTEXT_H