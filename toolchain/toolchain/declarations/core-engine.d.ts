/// <reference path="./adapted-script.d.ts"/>

/**
 * Class, upon which armor and attachments render is based
 * It is a model that consists of parts, same as in deprecated [[Render]],
 * but more abstract, allows creating root parts instead of
 * inheritance from old humanoid model
 */
declare class ActorRenderer {
    /**
     * Constructs new [[ActorRenderer]] object without parts
     */
    constructor();
    /**
     * Constructs new [[ActorRenderer]] object,
     * based on one of default Minecraft render templates
     * @param templateName default template name
     */
    constructor(templateName: DefaultRenderTemplate);

    getUniformSet(): ShaderUniformSet;

    setTexture(textureName: string): void;

    setMaterial(materialName: string): void;

    getPart(name: string): ActorRenderer.ModelPart;

    /**
     * Adds a child model part of an existing one
     * @param name child model name
     * @param parentName parent model name
     */
    addPart(name: string, parentName: string, mesh?: RenderMesh): ActorRenderer.ModelPart;

    /**
     * Adds a root model part
     */
    addPart(name: string, mesh?: RenderMesh): ActorRenderer.ModelPart;

}

declare namespace ActorRenderer {

    class ModelPart {

        /**
         * All methods of [[ActorRenderer.ModelPart]] build in such a way,
         * that you can create full render in one chain of calls
         * ```js
         * new ActorRenderer().addPart("Child", "Parent").addPart("Grandchild", "Child").endPart();
         * ```
         */
        endPart(): ActorRenderer;

        setTexture(textureName: string): ModelPart;

        setMaterial(materialName: string): ModelPart;

        setTextureSize(w: number, h: number): ModelPart;

        setOffset(x: number, y: number, z: number): ModelPart;

        setRotation(x: number, y: number, z: number): ModelPart;

        setPivot(x: number, y: number, z: number): ModelPart;

        setMirrored(isMirrored: boolean): ModelPart;

        /**
         * @param inflate increases the box by a certain value in all directions
         */
        addBox(x: number, y: number, z: number, sizeX: number, sizeY: number, sizeZ: number, inflate: number, u: number, v: number): ModelPart;

        clear(): ModelPart;

    }

}
/**
 * Module used to manage custom entities added via add-ons
 */
declare namespace AddonEntityRegistry {
    /**
     * Spawns an entity defined via add-on on the specified coordinates
     * @param nameID entity name id, as defined from add-on
     */
    function spawn(x: number, y: number, z: number, nameID: string): number;

    /**
     * @returns add-on entity information by entity id
     * @param entity 
     */
    function getEntityData(entity: number): AddonEntity;

    interface AddonEntity {
        /**
         * Entity unique id
         */
        readonly id: number,

        /**
         * Add-on defined entity name id
         */
        readonly type: string,

        /**
         * Executes command with the entity
         * @param command command to be executed
         * @returns error message or null if the command was run successfully 
         */
        exec(command: string): Nullable<string>;

        /**
         * Executes command with the entity on the specified coordinates
         * @param command command to be executed
         * @returns error message or null if the command was run successfully 
         */
        execAt(command: string, x: number, y: number, z: number): Nullable<string>;
    }
}
/**
 * Animations are used to display some 3d models in the world without use of 
 * entities
 */
declare namespace Animation {
    /**
     * Base animations are used to display arbitrary model in the world
     */
    class Base {
        /**
         * Constructs a new Base animation on the specified coordinates
         */
        constructor(x: number, y: number, z: number);

        /**
         * Changes the animation's position
         */
        setPos(x: number, y: number, z: number): void;

        /**
         * @param enabled if true, animation position will be interpolated 
         * between tick calls
         */
        setInterpolationEnabled(enabled: boolean): void;

        /**
         * @deprecated use [[setBlockLightPos]] and related methods instead
         */
        setIgnoreBlocklight(ignore: boolean): void;

        /**
         * Sets specified coordinates as light measuring position for the 
         * animation. In other words, animation lightning will be calculated 
         * as if animation was at the specified coordinates
         */
        setBlockLightPos(x: number, y: number, z: number): void;

        /**
         * Resets light measuring position for the animation (to its coordinates)
         */
        resetBlockLightPos(): void;

        /**
         * Sets light measuring position to always match day/night lightning, 
         * even when the animation is not directly illuminated
         */
        setSkylightMode(): void;

        /**
         * Sets light measuring to match the animation coordinated
         */
        setBlocklightMode(): void;

        /**
         * Makes the animation ignore light at all
         */
        setIgnoreLightMode(): void;

        /**
         * @returns [[Render.Transform]] object for current animation's render
         */
        transform(): Render.Transform;

        /**
         * @returns [[ShaderUniformSet]] object for current animation's 
         * render
         */
        getShaderUniforms(): ShaderUniformSet;

        /**
         * Creates a set of transformations for the current animation
         * @param transformations 
         * @param noClear 
         */
        newTransform(transformations: {
            /**
             * Transformation function name, one of [[Render.Transform]] class member 
             * functions names
             */
            name: string,
            /**
             * Transformation function parameters, see [[Render.Transform]] functions
             * for details
             */
            params: any[]
        }[], noClear: boolean): void;

        /**
         * Creates render if it was not previously created and applies all the 
         * parameters from animation description
         */
        createRenderIfNeeded(): void;

        /**
         * Refreshes the animation
         */
        updateRender(): void;

        /**
         * Loads animation in the world
         */
        load(): void;

        /**
         * Loads animation in the world registering it as an [[Updatable]]
         * @param func function to be used as [[Updatable.update]] function
         */
        loadCustom(func: () => void): void;

        /**
         * @deprecated always returns 0
         */
        getAge(): void;

        /**
         * Refreshes the animation
         */
        refresh(): void;

        /**
         * Describes animation parameters for the future use. Call [[load]] or 
         * [[loadCustom]] to actually launch the animation
         * @param description an object containing all the required data about 
         * animation
         */
        describe(description: {
            /**
             * [[RenderMesh]] object to be displayed with animation
             */
            mesh?: RenderMesh,
            /**
             * Numeric id of the [[Render]] object to be displayed with animation.
             * Can be obtained using [[Render.getId]]
             */
            render?: number,
            /**
             * Name of the texture to be used as render's skin
             */
            skin?: string,
            /**
             * Animation scale, default is 1
             */
            scale?: number,
            /**
             * Animation material, can be used to apply custom materials to the 
             * animation
             */
            material?: string
        }): void;

        /**
         * @deprecated
         */
        getRenderAPI(base: any): any;

        /**
         * Destroys animation and releases all the resources
         */
        destroy(): void;
    }

    /**
     * Item animations are used to display items or blocks models in the world
     */
    class Item extends Base {
        /**
         * Constructs a new Item animation on the specified coordinates
         */
        constructor(x: number, y: number, z: number);

        /**
         * Describes item to be used for the animation
         * @param item item parameters object
         */
        describeItem(item: {
            /**
             * Item id
             */
            id: number,

            /**
             * Item count, will be transform to display an appropriate animation
             */
            count?: number,

            /**
             * Item data
             */
            data?: number,

            /**
             * Item extra
             */
            extra?: ItemExtraData,

            /**
             * Whether the item should be in glint state or not
             */
            glint?: boolean,

            /**
             * Item/block size, default is 0.5
             */
            size?: number,

            /**
             * If true, the position of the item will not be randomized
             */
            notRandomize?: boolean,

            /**
             * If string "x" is passed, the item is rotated 90 along x axis, if
             * "z" is passed, the item is rotated 90 along z axis, otherwise the
             * item is rotated according to the rotation array along all the three 
             * axes
             */
            rotation?: string | [number, number, number],

            /**
             * Skin name to be used for the render. If no skin is passed, default 
             * item skin is used
             */
            skin?: string,

            /**
             * Shader material name
             */
            material?: string,
        }): void;

        /**
         * Same as [[Item.describeItem]]
         * @deprecated consider using [[Item.describeItem]] instead
         */
        describeItemDefault(item: any): void;

        /**
         * @deprecated use [[Item.describeItem]] instead
         */
        describeItemAlternative(item: any, offset: any): void;

        /**
         * Resets all the transformations made via [[Item.transform]] calls
         */
        resetTransform(): void;

        /**
         * Specifies item rotation along the three axes
         */
        setItemRotation(x: number, y: number, z: number): void;

        /**
         * Specifies item size, default value is 0.5
         */
        setItemSize(size: number): void;

        /**
         * Specifies item size and rotation via single function call
         */
        setItemSizeAndRotation(size: number, x: number, y: number, z: number): void;
    }
}
/**
 * Module used to manage armor's behavior
 */
declare namespace Armor {
    /**
     * Registers armor's hurt and tick functions
     * @param id armor item string or numeric id
     * @param funcs 
     * @deprecated, does not work in multiplayer
     */
    function registerFuncs(id: number | string, funcs: {
        tick:
        /**
         * Called every tick if player wears the armor
         * @param item current armor item instance
         * @param index armor slot, one of the [[Native.ArmorType]] values
         * @param maxDamage maximum damage the armor 
         * @returns true, if changes to the item parameter should be applied, 
         * false otherwise
         */
        (item: ItemInstance, index: number, maxDamage: number) => boolean,

        hurt:
        /**
         * Called when player deals damage if player wears the armor
         * @param params additional data about damage
         * @param params.attacker attacker entity or -1 if the damage was not 
         * caused by an entity
         * @param params.damage damage amount that was applied to the player
         * @param params.type damage type
         * @param params.b1 unknown param
         * @param params.b2 unknown param
         * @param item current armor item instance
         * @param index armor slot, one of the [[Native.ArmorType]] values
         * @param maxDamage maximum damage the armor 
         * @returns true, if changes to the item parameter should be applied, 
         * false otherwise
         */
        (params: { attacker: number, damage: number, type: number, b1: boolean, b2: boolean },
            item: ItemInstance, index: number, maxDamage: number) => boolean
    }): void;

    /**
     * Prevents armor from being damaged
     * @param id armor item string or numeric id
     */
	function preventDamaging(id: number | string): void;

    interface ArmorGeneralFunction {
        (item: ItemInstance, slot: number, player: number): void
    }

    interface ArmorHurtFunction {
        (item: ItemInstance, slot: number, player: number, value: number, type: number, attacker: number, bool1: boolean, bool2: boolean): void
    }

	/**
     * This event is called every tick for every player that has this armor put on.
     * @returns the {id: , count: , data: , extra: } object to change armor item,
     * if nothing is returned, armor will not be changed.
     */
    function registerOnTickListener(id: number, func: ArmorGeneralFunction): ItemInstance | void;

    /**
     * This event is called when the damage is dealt to the player that has this armor put on.
     * @returns the {id: , count: , data: , extra: } object to change armor item,
     * if nothing is returned, armor will be damaged by default.
     */
    function registerOnHurtListener(id: number, func: ArmorHurtFunction): ItemInstance | void;

    /**
     * This event is called when player takes on this armor, or spawns with it.
     */
    function registerOnTakeOnListener(id: number, func: ArmorGeneralFunction): void;

    /**
     * This event is called when player takes off or changes this armor item.
     */
    function registerOnTakeOffListener(id: number, func: ArmorGeneralFunction): void;
}

/**
 * Class used to attach attachables to entities
 */
declare class AttachableRender {

    static attachRendererToItem(id: number, renderer: AttachableRender, texture?: string, material?: string): void;

    static detachRendererFromItem(id: number): void;

    /**
     * Constructs new [[AttachableRender]] object bind to given entity
     */
    constructor(actorUid: number);

    getUniformSet(): ShaderUniformSet;

    /**
     * Sets the render, root render parts will be drawing
     * together with mob's render parts with same names
     * (names can be seen in json description of the model in resources)
     */
    setRenderer(actorRenderer: ActorRenderer): AttachableRender;

    setTexture(textureName: string): AttachableRender;

    setMaterial(materialName: string): AttachableRender;

    destroy(): void;

    isAttached(): boolean;

}

declare namespace Block {

	/**
	 * Same as [[Block.registerDropFunction]] but accepts only numeric 
	 * tile id as the first param
	 */
	function registerDropFunctionForID(numericID: number, dropFunc: DropFunction, level?: number): boolean;

	/**
	 * Registers function used by Core Engine to determine block drop for the 
	 * specified block id
	 * @param nameID tile string or numeric id
	 * @param dropFunc function to be called to determine what will be dropped 
	 * when the block is broken
	 * @param level if level is specified and is not 0, digging level of the
	 * block is additionally set
	 * @returns true, if specified string or numeric id exists and the function
	 * was registered correctly, false otherwise
	 */
	function registerDropFunction(nameID: string | number, dropFunc: DropFunction, level?: number): boolean;

	/**
	 * @returns drop function of the block with given numeric id
	 */
    function getDropFunction(id: number): Block.DropFunction;

	/**
	 * Function used to determine block drop
	 * @param blockCoords coordinates where the block is destroyed and side from
	 * where it is destroyed
	 * @param blockID numeric tile id
	 * @param blockData block data value
	 * @param diggingLevel level of the tool the block was dug with
	 * @param enchant enchant data of the tool held in player's hand
	 * @param item item stack held in player's hand
	 * @param region BlockSource object
	 * @returns block drop, the array of arrays, each containing three or four values: 
	 * id, count, data and extra respectively
	 */
	interface DropFunction {
		(blockCoords: Callback.ItemUseCoordinates, blockID: number, blockData: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[]
	}

}

/**
 * Namespace used to manipulate minecraft commands
 */
declare namespace Commands {
    /**
     * Executes specified command
     * @param command command to be executed
     * @returns error message or null if the command was run successfully 
     */
    function exec(command: string): Nullable<string>;

    /**
     * Executes specified command using specified coordinates as command 
     * location for all relative calculations
     * @param command command to be executed
     * @returns error message or null if the command was run successfully 
     */
    function execAt(command: string, x: number, y: number, z: number): Nullable<string>;
}

declare namespace MobRegistry {
    namespace customEntities { }
    namespace loadedEntities { }

    function registerEntity(name: any): any;

    function registerUpdatableAsEntity(updatable: any): any;

    function spawnEntityAsPrototype(typeName: any, coords: any, extraData: any): any;

    function getEntityUpdatable(entity: number): any;

    function registerNativeEntity(entity: number): any;

    function registerEntityRemove(entity: number): any;

    function resetEngine(): any;
}

declare namespace MobSpawnRegistry {
    namespace spawnData { }

    function registerSpawn(entityType: any, rarity: number, condition: any, denyNaturalDespawn: any): any;

    function getRandomSpawn(rarityMultiplier: any): any;

    function getRandPosition(): any;

    function executeSpawn(spawn: any, position: any): any;
    var counter: number;

    function tick(): any;

    function onChunkGenerated(x: number, z: number): any;
}

declare function EntityModelWatcher(entity: number, model: any): any;
declare function EntityAIWatcher(customPrototype: any): any;

/**
 * Empty function used to verify Rhino functionality. Should not be called by 
 * hand
 */
declare function __debug_typecheck__(): void;

/**
 * Runs custom source in the specified context by its name. Define custom 
 * sources using *"sourceType": "custom"* for the source in your *build.config*.
 * @param name path to the executable. Can be built the way built-in source 
 * types are built
 * @param scope additional scope to be added to the current context
 */
declare function runCustomSource(name: string, scope?: object): void;

/**
 * Object containing custom block string ids  as keys and their numeric
 * ids as values
 */
declare const BlockID: { [key: string]: number };

/**
 * Object containing custom item string ids as keys and their numeric
 * ids as values
 */
declare const ItemID: { [key: string]: number };

/**
 * Module containing [[ItemID]] and [[BlockID]] values
 * @deprecated consider using [[ItemID]] and [[BlockID]] instead
 */
declare namespace IDData {
	/**
	 * Object containing custom item string ids as keys and their numeric
	 * ids as values
	 */
	const item: { [key: string]: number };

	/**
	 * Object containing custom block string ids as keys and their numeric
	 * ids as values
	 */
	const block: { [key: string]: number };
}

/**
 * Same as [[IMPORT]], consider using [[IMPORT]] instead 
 */
declare function importLib(name: string, value?: string): void;

/**
 * Imports library dependency. Libraries should be stored in the *"libraryDir"* 
 * directory, specified in your *build.config*. You can either import the whole
 * library or single function/value using value parameter
 * @param name library name specified in the library's EXPORT declaration
 * @param value name of the function or value you wish to import, or "*" to 
 * import the whole library. Defaults to importing the whole library
 */
declare function IMPORT(name: string, value?: string): void;

/**
 * Injects methods from C++ into the target object to use in the mod
 * @param name name of the module, as registered from native code
 * @param target target object, where all the methods from native module will be 
 * injected
 */
declare function IMPORT_NATIVE(name: string, target: object): any;

/**
 * Allows to create new JS modules imported from C++ code and use it in the mod
 * @param name name of the module, as registered from native code
 * @returns js module, implemented in native (C++) code 
 */
declare function WRAP_NATIVE<T = any>(name: string): T;

/**
 * Allows to create new JS modules imported from Java code and use it in the mod
 * @param name name of the module, as registered from Java code
 * @returns js module, implemented in Java code 
 */
declare function WRAP_JAVA<T = any>(name: string): T;

/**
 * @returns current Core Engine API level
 */
declare function getCoreAPILevel(): number;

/**
 * Runs specified function in the main thread
 * @param func function to be run in the main thread
 */
declare function runOnMainThread(func: () => void): void;

/**
 * Runs specified function in the client thread.
 * Same as [[runOnMainThread]], but for the client side.
 * @param func function to be run in the client thread
 */
declare function runOnClientThread(func: () => void): void;

/**
 * @returns minecraft version information in some readable form
 * @param str string version representation, three dot-separated numbers
 * @param array array containing three version numbers
 * @param main version number, calculated as *array[0] * 17 + array[1]*
 */
declare function getMCPEVersion(): { str: string, array: number[], main: number };

/**
 * Displays android.widget.Toast with specified message. If this function is called
 * more then once, messages are stacked and displayed together
 * @param arg 
 */
declare function alert(arg: any): any;

/**
 * Library declaration, specifies all the information about library it is called from. 
 * Cannot be called from user code.
 * @param description object containing all the required information
 * about the library
 */
declare function LIBRARY(description: {
	/**
	 * Library name, used to avoid conflicts when several 
	 * mods have the same library installed
	 */
	name: string,

	/**
	 * Library version, used to load the latest library version
	 * if different mods have different library version installed
	 */
	version: number,

	/**
	 * API name, one of the "CoreEngine", "AdaptedScript" or "PrefsWinAPI" strings
	 */
	api: string,

	/**
	 * If set to true, the context of the library is shared between mods to 
	 * allow for better integration
	 */
	shared: boolean,

	/**
	 * List of names of libraries that should be loaded before the current library is loaded. 
	 * Every entry should be either just a library name or library name and version
	 * separated by a column (":")
	 */
	dependencies?: string[]
}): void;

/**
 * Exports object from library using specified name
 * @param name object name to be used when calling [[IMPORT]]. 
 * If the name contains a column (":"), the number after column 
 * is used to specify version of the library this export corresponds to.
 * To provide backward compatibility, library authors can use multiple 
 * exports for different library versions inside a single file. This mechanism 
 * currently works only for library dependencies
 * @param lib object to be exported with specified name, 
 * can be of any valid js/java type
 */
declare function EXPORT(name: string, lib: any): void;

/**
 * Function that must be written in launcher.js to enable multiplayer configuration
 * @param {string} name Unique readable network name of the mod
 * @param {string} version Mod version
 * @param {boolean} isClientOnly If true, mod is only client.
 * Client mods must not affect on the world.
 * They will not be taken into account in mod synchronization during the connection
 */
declare function ConfigureMultiplayer(args: { name: string, version: string, isClientOnly: boolean }): void;

/**
 * Default render templates used inside of InnerCore,
 * currently there are only default armor models
 */
declare type DefaultRenderTemplate = ArmorType;
/**
 * Class used to create custom biomes. Note that Minecraft has a limit of 256 biomes
 * and there are already more than 100 vanilla biomes, so do not overuse 
 * this functionality. See {@page Biomes}
 */
declare class CustomBiome {

    /**
     * @returns [[java.util.HashMap]] object instance, with all
     * custom biomes registered by every mod
     */
    static getAllCustomBiomes(): java.util.Map<String, CustomBiome>;

    /**
     * @returns whether biome is invalid
     */
    isInvalid(): boolean;

    /**
     * Crates a new custom biome with specified string identifier
     * @param name string identifier of the biome
     */
    constructor(name: string);

    /**
     * custom biome numeric id
     */
    readonly id: number;

    /**
     * Custom biome name
     */
    readonly name: string;

    /**
     * Pointer to biome's native object,
     * represented as long number
     */
    readonly pointer: number;

    /**
     * Sets biome's grass color. Grass color is interpolated on the bounds of 
     * the biome
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns reference to itself to be used in sequential calls
     */
    setGrassColor(r: number, g: number, b: number): CustomBiome;

    /**
     * Sets biome's grass color. Grass color is interpolated on the bounds of 
     * the biome
     * @param color integer color value (you can specify it using hex value)
     * @returns reference to itself to be used in sequential calls
     */
    setGrassColor(color: number): CustomBiome;

    /**
     * Sets biome's sky color
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns reference to itself to be used in sequential calls
     */
    setSkyColor(r: number, g: number, b: number): CustomBiome;

    /**
     * Sets biome's sky color
     * @param color integer color value (you can specify it using hex value)
     * @returns reference to itself to be used in sequential calls
     */
    setSkyColor(color: number): CustomBiome;

    /**
     * Sets biome's foliage color
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns reference to itself to be used in sequential calls
     */
    setFoliageColor(r: number, g: number, b: number): CustomBiome;

    /**
     * Sets biome's foliage color
     * @param color integer color value (you can specify it using hex value)
     * @returns reference to itself to be used in sequential calls
     */
    setFoliageColor(color: number): CustomBiome;

    /**
     * Sets biome's water color
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns reference to itself to be used in sequential calls
     */
    setWaterColor(r: number, g: number, b: number): CustomBiome;

    /**
     * Sets biome's water color
     * @param color integer color value (you can specify it using hex value)
     * @returns reference to itself to be used in sequential calls
     */
    setWaterColor(color: number): CustomBiome;

    /**
     * Sets biome's temperature and downfall
     * @param temperature temperature value, from 0 to 1
     * @param downfall downfall value, from 0 to 1
     * @returns reference to itself to be used in sequential calls
     */
    setTemperatureAndDownfall(temperature: number, downfall: number): CustomBiome;

    /**
     * Specifies the block that will cover the biome. E.g. most of the biomes 
     * use grass as cover block, though some of the biomes use other blocks 
     * (sand, ice, etc.)
     * @param id block's tile id
     * @param data block data
     * @returns reference to itself to be used in sequential calls
     */
    setCoverBlock(id: number, data: number): CustomBiome;

    /**
     * Specifies the block that will be under the covering block of the biome. 
     * E.g. most of the biomes use dirt as cover block, 
     * though some of the biomes use other blocks
     * @param id block's tile id
     * @param data block data
     * @returns reference to itself to be used in sequential calls
     */
    setSurfaceBlock(id: number, data: number): CustomBiome;

    /**
     * Sets the block that fills the terrain. Vanilla biomes use stone filling
     * @param id block's tile id
     * @param data block data
     * @returns reference to itself to be used in sequential calls
     */
    setFillingBlock(id: number, data: number): CustomBiome;

    /**
     * Sets the block that fills the floor at the bottom of the sea or the ocean.
     * Vanilla biomes use gravel or stone filling
     * @param id block's tile id
     * @param data block data
     * @returns reference to itself to be used in sequential calls
     */
    setSeaFloorBlock(id: number, data: number): CustomBiome;

    /**
     * This method is mapped on native parameter with the same name and its 
     * effect is currently not known
     * @param id block's tile id
     * @param data block data
     * @returns reference to itself to be used in sequential calls
     * @deprecated use [[CustomBiome.setSeaFloorBlock]] instead
     */
    setAdditionalBlock(id: number, data: number): CustomBiome;

    /**
     * Sets the average depth of the see floor in this biome.
     * @param depth depth of the see floor by Y-axis
     * @returns reference to itself to be used in sequential calls
     */
    setSeaFloorDepth(depth: number): CustomBiome;

    /**
     * This method is mapped on native parameter with the same name and its 
     * effect is currently not known
     * @param param some integer parameter. Default value is 7
     * @returns reference to itself to be used in sequential calls
     * @deprecated use [[CustomBiome.setSeaFloorDepth]]
     */
    setSurfaceParam(param: number): CustomBiome;

    /**
     * Defines the server-side biome params from given JSON string.
     * Throws [[java.lang.IllegalArgumentException]] if the string cannot be parsed.
     * @returns reference to itself to be used in sequential calls
     * ```js
     * // many thanks to DansZbar2 for the example
     * var cherry = new CustomBiome("environmental_cherry");
     * cherry.setServerJson(JSON.stringify({
     *     "minecraft:climate": {
     *        "downfall": 0.0,
     *        "snow_accumulation": [ 0.0, 0.0 ],
     *        "temperature": 2.0,
     *        "blue_spores": 0,
     *        "red_spores": 0,
     *        "white_ash": 0,
     *        "ash": 0
     *     },
     *     "minecraft:overworld_height": {
     *        "noise_type": "default"
     *     },
     *     "animal": {},
     *     "monster": {},
     *     "overworld": {},
     *     "environmental_cherry": {},
     *     "minecraft:surface_parameters": {
     *        "top_material": "minecraft:grass",
     *        "mid_material": "minecraft:dirt",
     *        "foundation_material": "minecraft:stone",
     *        "sea_floor_material": "minecraft:clay",
     *        "sea_material": "minecraft:water",
     *        "sea_floor_depth": 7
     *     },
     *     "minecraft:overworld_generation_rules": {
     *        "hills_transformation": "jungle_hills",
     *        "generate_for_climates": [ 
     *            [ "cold", 5 ],
     *            [ "medium", 20 ],
     *            [ "warm", 35 ],
     *        ]
     *     }
     * }));
     * ```
     */
    setServerJson(json: string): CustomBiome;

    /**
     * Defines the client-side biome params from given JSON string.
     * Throws [[java.lang.IllegalArgumentException]] if the string cannot be parsed.
     * @returns reference to itself to be used in sequential calls
     * ```js
     * // many thanks to DansZbar2 for the example
     * var cherry = new CustomBiome("environmental_cherry");
     * cherry.setClientJson(JSON.stringify({
     *     "water_surface_color": "#d176e1",
     *     "water_fog_color": "#a35dc2",
     *     "water_surface_transparency": 0.7,
     *     "water_fog_distance": 11,
     *     "fog_identifier": "environmental:environmental_cherry" // custom fog defined in the addon
     * }));
     * ```
     */
    setClientJson(json: string): CustomBiome;
}

/**
 * Module to create custom enchantments.
 * Available starting from InnerCore 2.2.1b105
 */
declare namespace CustomEnchant {

    /**
     * Object returned by [[CustomEnchant.newEnchant]] method.
     * Used to configure different custom enchantment behaviors
     */
    interface EnchantSetupInterface {

        /**
         * The numeric id of the following enchantment
         * to be used in different operations.
         * This id will not change after the first generation,
         * same as it works with blocks' and items' ids.
         */
        readonly id: number;

        /**
         * Sets the following enchantment frequency, possibly used in treasures.
         * Default value is 3
         * @returns reference to itself to be used in sequential calls
         */
        setFrequency(freq: number): EnchantSetupInterface;

        /**
         * Sets whether the following enchantment will be able 
         * to be found in dungeon chests or not.
         * Default value is true.
         * @returns reference to itself to be used in sequential calls
         */
        setIsLootable(lootable: boolean): EnchantSetupInterface;

        /**
         * Sets whether the following enchantment will be able
         * to be received on the enchanting table or not.
         * Default value is true.
         * @returns reference to itself to be used in sequential calls
         */
        setIsDiscoverable(discoverable: boolean): EnchantSetupInterface;

        /**
         * Sets whether the following enchantment will be able
         * to be caught during fishing as a treasure, or not.
         * Default value is false.
         * @returns reference to itself to be used in sequential calls
         */
        setIsTreasure(treasure: boolean): EnchantSetupInterface;

        /**
         * Sets the mask of items, that the following enchantment can be applied to, 
         * paired parameter for item is enchant slot, default is -1 = 0xFFFFFFFF - all
         * @returns reference to itself to be used in sequential calls
         */
        setMask(mask: number): EnchantSetupInterface;

        /**
         * Sets minimum and maximum level, that the following enchantment
         * will be able to have in legal conditions.
         * Default is 1-5
         * @returns reference to itself to be used in sequential calls
         */
        setMinMaxLevel(min: number, max: number): EnchantSetupInterface;

        /**
         * Sets linear dependency of enchant cost by level,
         * the formula is `level * b + c`
         * @returns reference to itself to be used in sequential calls
         */
        setMinMaxCost(bMin: number, cMin: number, bMax: number, cMax: number): EnchantSetupInterface;

        /**
         * Defines the function that will be called, when item with following enchantment is used for attack.
         * The function must return bonus damage dealt to the victim. 
         * NOTE: this method is highly experimental right now
         * @returns reference to itself to be used in sequential calls
         */
        setAttackDamageBonusProvider(func: AttackDamageBonusProvider): EnchantSetupInterface;

        /**
         * Defines the function that will be called after the item with following enchantment is used for attack.
         * NOTE: this method is highly experimental right now
         * @returns reference to itself to be used in sequential calls
         */
        setPostAttackCallback(func: DamageCallback): EnchantSetupInterface;

        /**
         * Defines the function that will be called, when the entity wearing item
         * with following enchantment, is hit.
         * The function must return bonus protection value.
         * NOTE: this method is highly experimental right now
         * @returns reference to itself to be used in sequential calls
         */
        setProtectionBonusProvider(func: ProtectionBonusProvider): EnchantSetupInterface;

        /**
         * Defines the function that will be called, when the entity wearing item
         * with following enchantment, is hit.
         * NOTE: this method is highly experimental right now
         * @returns reference to itself to be used in sequential calls
         */
        setPostHurtCallback(func: DamageCallback): EnchantSetupInterface;

    }

    /**
     * Registers new custom enchantment from given name id and displayed name
     * @param nameID internal string id of the enchantment
     * @param displayedName enchantment name that will be displayed in the
     * tooltips of the items having this enchant.
     * Use [[Translation]] module to make localization of the displayed name
     * @returns object to work with different enchantment behaviors
     */
    function newEnchant(nameID: string, displayedName: string): EnchantSetupInterface;

    /**
     * Function interface used in [[EnchantSetupInterface.setAttackDamageBonusProvider]] method
     */
    interface AttackDamageBonusProvider {
        (damage: number, entity: number): number;
    }

    /**
     * Function interface used in
     * [[EnchantSetupInterface.setPostAttackCallback]] and
     * [[EnchantSetupInterface.setPostHurtCallback]] methods
     */
    interface DamageCallback {
        (item: ItemInstance, damage: number, entity1: number, entity2: number): void;
    }

    /**
     * Function interface used in [[EnchantSetupInterface.setProtectionBonusProvider]] method
     */
    interface ProtectionBonusProvider {
        (damage: number, damageType: number, entity: number): number;
    }

}
/**
 * Defines some useful methods for debugging
 */
declare namespace Debug {
    /**
     * @returns current system time in milliseconds
     */
    function sysTime(): number;

    /**
     * Spawns vanilla debug particle on the specified coordinates
     * @param id particle type id, should be one of the [[Native.ParticleType]]
     * @param vx x velocity
     * @param vy y velocity
     * @param vz y velocity
     * @param data additional particles data
     */
    function addParticle(id: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data: number): void;

    /**
     * Writes general debug message (in green) to the chat
     * @param message message to be displayed
     */
    function message(message: string): void;

    /**
     * Writes warning debug message (in gold) to the chat
     * @param message message to be displayed
     */
    function warning(message: string): void;

    /**
     * Writes error debug message (in red) to the chat
     * @param message message to be displayed
     */
    function error(message: string): void;

    /**
     * Writes several comma-separated values to the chat as a general debug 
     * message, serializing javascript objects if possible
     * @param args messages to be displayed
     */
    function m(...args: any[]): void;

    /**
     * Writes several values in JSON format to the copyable alert window text view,
     * serializing javascript objects if possible
     * @param args messages to be displayed
     */
    function big(...args: any[]): void;

    /**
     * Displays an AlertDialog with given title and bitmap
     * @param bitmap android.graphics.Bitmap object of the bitmap to be 
     * displayed
     * @param title title of the AlertDialog
     */
    function bitmap(bitmap: android.graphics.Bitmap, title: string): void;
}

/**
 * Object representing RGB color
 */
interface Color {
    r: number,
    g: number,
    b: number
}

/**
 * Object representing pitch/yaw angle set (in radians)
 */
interface LookAngle {
    pitch: number,
    yaw: number
}

/**
 * Object representing current weather in the world
 */
interface Weather {
    /**
     * Current rain level, from 0 (no rain) to 10 (heavy rain)
     */
    rain: number,
    /**
     * Current lightning level, from 0 (no lightning) to 10
     */
    thunder: number
}

declare class CustomEntity {

}

/**
 * Namespace used to create and manipulate custom dimensions
 */
declare namespace Dimensions {
    /**
     * Class representing custom dimension
     */
    class CustomDimension {
        /**
         * Constructs a new dimension with specified name and preferred id
         * @param name dimension name, can be used to get dimension via 
         * [[Dimensions.getDimensionByName]] call
         * @param preferredId preferred dimension id. If id is already occupied
         * by some another dimension, constructor will look for the next empty
         * dimension id and assign it to the current dimension
         */
        constructor(name: string, preferredId: number);

        /**
         * Custom dimension id
         */
        id: number;

        /**
         * Sets custom landscape generator
         * @param generator custom landscape generator used for current 
         * dimension
         * @returns reference to itself to be used in sequential calls
         */
        setGenerator(generator: CustomGenerator): CustomDimension;

        /**
         * Specifies whether the sky produces light (like in overworld) or not 
         * (like in the End or Nether). By default this value is true
         * @param hasSkyLight if true, the sky produces light in the dimension
         * @returns reference to itself to be used in sequential calls
         */
        setHasSkyLight(hasSkyLight: boolean): CustomDimension;

        /**
         * @returns whether the sky produces light in the current dimension
         */
        hasSkyLight(): boolean;

        /**
         * Sets sky color for the dimension in the RGB format. Default 
         * color is as in the Overworld
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns reference to itself to be used in sequential calls
         */
        setSkyColor(r: number, g: number, b: number): CustomDimension;

        /**
         * Resets sky color to the default value
         * @returns reference to itself to be used in sequential calls
         */
        resetSkyColor(): CustomDimension;

        /**
         * Sets fog color for the dimension in the RGB format. Default 
         * color is as in the Overworld
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns reference to itself to be used in sequential calls
         */
        setFogColor(r: number, g: number, b: number): CustomDimension;

        /**
         * Resets fog color to the default value
         * @returns reference to itself to be used in sequential calls
         */
        resetFogColor(): CustomDimension;

        /**
         * Sets clouds color for the dimension in the RGB format. Default 
         * color is as in the Overworld
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns reference to itself to be used in sequential calls
         */
        setCloudColor(r: number, g: number, b: number): CustomDimension;

        /**
         * Resets clouds color to the default value
         * @returns reference to itself to be used in sequential calls
         */
        resetCloudColor(): CustomDimension;

        /**
         * Sets sunset sky color for the dimension in the RGB format. Default 
         * color is as in the Overworld
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns reference to itself to be used in sequential calls
         */
        setSunsetColor(r: number, g: number, b: number): CustomDimension;

        /**
         * Resets sunset sky color to the default value
         * @returns reference to itself to be used in sequential calls
         */
        resetSunsetColor(): CustomDimension;

        /**
         * Sets fog displaying distance
         * @param start nearest fog distance
         * @param end farthest fog distance
         * @returns reference to itself to be used in sequential calls
         */
        setFogDistance(start: number, end: number): CustomDimension;

        /**
         * Resets fog displaying distance
         */
        resetFogDistance(): CustomDimension;
    }

    /**
     * Class representing landscape generator used for the dimension
     */
    class CustomGenerator {
        /**
         * Creates a new [[CustomGenerator]] instance using specified base type
         * @param baseType base generator type constant, can be from 0 to 4. 0 
         * and 1 represent overworld generator, 2 represents flat world 
         * generator, 3 represents nether generator and 4 represents end 
         * generator
         */
        constructor(baseType: number);

        /**
         * Creates a new [[CustomGenerator]] instance using specified base type
         * @param baseType base generator type constant, can be one of the 
         * following: "overworld", "overworld1", "flat", "nether", "end"
         */
        constructor(baseType: string);

        /**
         * Specifies whether to use vanilla biome surface cover blocks (grass, 
         * sand, podzol, etc.)
         * @param value if true, vanilla surface will be generated, default 
         * value is false
         * @returns reference to itself to be used in sequential calls
         */
        setBuildVanillaSurfaces(value: boolean): CustomGenerator;

        /**
         * Specifies whether to generate minecraft vanilla structures
         * @param value if true, vanilla structures will be generated, default
         * value is false
         * @returns reference to itself to be used in sequential calls
         */
        setGenerateVanillaStructures(value: boolean): CustomGenerator;

        /**
         * Specifies whether to use mod's generation callbacks
         * @param value if true, mod generation will be used, default
         * value is true
         * @returns reference to itself to be used in sequential calls
         */
        setGenerateModStructures(value: boolean): CustomGenerator;

        /**
         * Sets terrain generator object used for the landscape generation
         * @param generator terrain generator to be used with current landscape 
         * generator or removes terrain generator, if the value is null
         * @returns reference to itself to be used in sequential calls
         */
        setTerrainGenerator(generator: Nullable<AbstractTerrainGenerator>): CustomGenerator;

        /**
         * Specifies which of the generation [[Callback]]s to call, -1 to call 
         * no mods generation, 0 to call overworld generation callback, 1 for nether, 
         * 2 for end generation callbacks
         * @param id generation callback to call
         */
        setModGenerationBaseDimension(id: number): CustomGenerator;

        /**
         * Disables mods generation in current generator
         */
        removeModGenerationBaseDimension(): CustomGenerator;
    }

    /**
     * Interface representing terrain generator. All terrain generators found
     * in Inner Core API implement this interface
     */
    interface AbstractTerrainGenerator {

    }

    /**
     * Class representing terrain that consists of single biome
     */
    class MonoBiomeTerrainGenerator implements AbstractTerrainGenerator {
        /**
         * Constructs new [[MonoBiomeTerrainGenerator]] instance with no terrain
         * layers
         */
        constructor();

        addTerrainLayer(minY: number, maxY: number): TerrainLayer;

        /**
         * Sets base biome for the current terrain 
         * @param id id of the biome to be used as a single biome of the terrain
         * layer
         */
        setBaseBiome(id: number): MonoBiomeTerrainGenerator;
    }

    /**
     * Class representing single terrain layer that may consist of several noise 
     * layers
     */
    interface TerrainLayer {
        addNewMaterial(generator: NoiseGenerator, priority: number): TerrainMaterial;

        setHeightmapNoise(generator: NoiseGenerator): TerrainLayer;

        setMainNoise(generator: NoiseGenerator): TerrainLayer;

        setYConversion(conversion: NoiseConversion): TerrainLayer;

        getMainMaterial(): TerrainMaterial;
    }

    /**
     * Class representing material that is used to generate terrain layer
     */
    interface TerrainMaterial {

        setBase(id: number, data: number): TerrainMaterial;

        setCover(id: number, data: number): TerrainMaterial;

        setSurface(width: number, id: number, data: number): TerrainMaterial;

        setFilling(width: number, id: number, data: number): TerrainMaterial;

        setDiffuse(value: number): TerrainMaterial;
    }

    /**
     * Class representing noise conversion function. Used to define "density" of
     * the landscape at a given height. Values between nodes are interpolated 
     * linearly
     */
    class NoiseConversion {
        constructor();

        /**
         * Adds a new node to the noise conversion function
         * @param x value from 0 to 1 representing the height of the block in the
         * terrain layer
         * @param y landscape density at a given height, generally can be between
         * -0.5 and 0.5. Values between nodes are interpolated linearly
         */
        addNode(x: number, y: number): NoiseConversion;
    }

    /**
     * Class representing multi-layer noise generator
     */
    class NoiseGenerator {
        constructor();

        addLayer(layer: NoiseLayer): NoiseGenerator;

        setConversion(conversion: NoiseConversion): NoiseGenerator;
    }

    /**
     * Class representing single noise layer
     */
    class NoiseLayer {
        constructor();

        addOctave(octave: NoiseOctave): NoiseLayer;

        setConversion(conversion: NoiseConversion): NoiseLayer;
    }

    type NoiseOctaveStringType = "perlin" | "gray" | "chess" | "sine_x" | "sine_y" | "sine_z" | "sine_xy" | "sine_yz" | "sine_xz" | "sine_xyz";
    /**
     * Class representing noise octave. Each noise layer consists of multiple
     * noise octaves of different scale and weight
     */
    class NoiseOctave {
        /**
         * Creates a new noise octave of specified type
         * @param type numeric type constant or one of the following strings:
         * **"perlin"** (0) is a general-purpose noise generator. Used to generate 
         * noise of completely random nature
         * **"gray"** (1) 
         * **"chess"** (2) 
         * The following sine noises are used to generate sinusoidal noise. 
         * Generally they should be used with some noise octaves of other types to avoid 
         * too mathematical landscapes
         * **"sine_x"** (10) 
         * **"sine_y"** (11) 
         * **"sine_z"** (12) 
         * **"sine_xy"** (13) 
         * **"sine_yz"** (14) 
         * **"sine_xz"** (15) 
         * **"sine_xyz"** (16)
         */
        constructor(type?: number | NoiseOctaveStringType);

        setTranslate(x: number, y: number, z: number): NoiseOctave;

        setScale(x: number, y: number, z: number): NoiseOctave;

        setWeight(weight: number): NoiseOctave;

        setSeed(x: number, y: number, z: number): NoiseOctave;

        setConversion(conversion: NoiseConversion): NoiseOctave;
    }

    /**
     * Overrides default generator of vanilla dimension
     * @param id vanilla dimension id, one of the [[Native.Dimension]] 
     * values
     * @param generator custom landscape generator used for vanilla 
     * dimension
     */
    function overrideGeneratorForVanillaDimension(id: number, generator: CustomGenerator): void;

    /**
     * @param name dimension name
     * @returns dimension by its string name specified in 
     * [[CustomDimension.constructor]]
     */
    function getDimensionByName(name: string): CustomDimension;

    /**
     * @param id dimension id
     * @returns custom dimension by its numeric id
     */
    function getDimensionById(id: number): CustomDimension;

    /**
     * @param id dimension id
     * @returns true, if dimension is a limbo dimension. Limbo dimension is 
     * created by Horizon automatically if you try to teleport the player to
     * non-existing dimension
     */
    function isLimboId(id: number): boolean;

    /**
     * Transfers specified entity to the dimension with specified id
     * @param entity numeric id of the 
     * @param dimensionId numeric id of the dimension to transfer the entity to
     */
    function transfer(entity: number, dimensionId: number): void;

    /**
     * @returns JS object instance, containing all registered custom biomes
     */
    function getAllRegisteredCustomBiomes(): {[key: string]: CustomBiome};

    /**
     * Function used to simplify the creation of terrain generator by passing 
     * a json-like structure as a single generator parameter. For detailed 
     * explanations see {@See Custom Dimensions} page
     * @param description object containing all the required generator information
     */
    function newGenerator(description: {
        /**
         * Specifies base generator, see [[CustomGenerator.constructor]] for 
         * details
         */
        base?: number | string,
        /**
         * Specifies whether to use vanilla biome surface cover blocks (grass, 
         * sand, podzol, etc.).
         * See [[CustomGenerator.setBuildVanillaSurfaces]] for details
         */
        buildVanillaSurfaces?: boolean,
        /**
         * Specifies whether to generate minecraft vanilla structures.
         * See [[CustomGenerator.setGenerateVanillaStructures]] for details
         */
        generateVanillaStructures?: boolean,
        /**
         * Can be either string for an existing dimensions ("overworld", 
         * "nether", "end") or -1 to disable mods generation. 
         * See [[CustomGenerator.setModGenerationBaseDimension]] for details
         */
        modWorldgenDimension?: number | string,
        /**
         * Specifies what generator type to use. Default and the only currently
         * available option is "mono", that is equivalent to creating a 
         * [[MonoBiomeTerrainGenerator]]
         */
        type?: string,
        /**
         * Sets base biome for the current terrain, applicable only to "mono"
         */
        biome?: number,

        /**
         * An array of terrain layers descriptions, each one representing its 
         * own terrain layer. See [[MonoBiomeTerrainGenerator.addTerrainLayer]] 
         * for detailed explanation
         */
        layers?: TerrainLayerParams[]

    }): CustomGenerator;

    interface TerrainLayerParams {
        minY: number,
        maxY: number,
        noise?: NoiseOctaveParams | NoiseLayerParams | NoiseGeneratorParams,
        heightmap?: NoiseOctaveParams | NoiseLayerParams | NoiseGeneratorParams,
        yConversion?: NoiseConversionParams,
        material?: TerrainMaterialParams,
        materials?: TerrainMaterialParams[],
    }

    interface TerrainMaterialParams {
        noise?: NoiseOctaveParams | NoiseLayerParams | NoiseGeneratorParams,
        base?: MaterialBlockData,
        cover?: MaterialBlockData,
        surface?: MaterialBlockData,
        filling?: MaterialBlockData,
        diffuse?: number
    }

    interface NoiseGeneratorParams {
        layers: NoiseLayerParams[],
        conversion?: NoiseConversionParams,
    }

    interface NoiseLayerParams {
        octaves: NoiseOctaveParams[] | {
            count?: number,
            seed?: number,
            weight?: number,
            weight_factor?: number,
            scale_factor?: number,
            scale?: number
        },
        conversion?: NoiseConversionParams
    }

    interface NoiseOctaveParams {
        /**
         * Noise octave type, **"perlin"** is default one. See [[NoiseOctave.constructor]]
         * for details
         */
        type?: number | string,
        scale?: Vec3Data,
        weight?: number,
        seed?: number,
        conversion?: NoiseConversionParams
    }

    type NoiseConversionParams = string | Vec2Data[];

    type MaterialBlockData =
        [number, number?, number?] |
        { id: number, data?: number, width?: number } |
        number;

    type Vec3Data =
        [number, number, number] |
        { x: number, y: number, z: number } |
        number;

    type Vec2Data =
        [number, number] |
        { x: number, y: number } |
        number
}
/**
 * Module used to manipulate entities (mobs, drop, arrows, etc.) in the world.
 * Every entity has its unique numeric id which is often used across this module 
 * as the first function parameter
 */
declare namespace Entity {
    /**
     * @returns an array of all loaded entities ids
     */
    function getAll(): number[];

    /**
     * @returns an array of all loaded entities ids
     * @deprecated Consider using [[Entity.getAll]] instead
     */
    function getAllJS(): number[];

    /** 
     * @deprecated No longer supported
     */
    function getExtra(ent: number, name: string): null;

    /** 
     * @deprecated No longer supported
     */
    function putExtra(ent: number, name: string, extra?: ItemExtraData): void;

    /**
     * @deprecated No longer supported
     */
    function getExtraJson(ent: number, name: string): object;

    /**
     * @deprecated No longer supported
     */
    function putExtraJson(ent: number, name: string, obj: object): void;

    /**
     * Adds an effect to the mob
     * @param effectId effect id, should be one
     * one of [[Native.PotionEffect]] or [[EPotionEffect]] values.
     * @returns whether the ]]
     * values
     * @param effectData effect amplifier
     * @param effectTime effect time in ticks
     * @param ambience if true, particles are ambient
     * @param particles if true, particles are not displayed
     */
    function addEffect(ent: number, effectId: number, effectData: number, effectTime: number, ambience?: boolean, particles?: boolean): void;

    /**
     * Clears effect, applied to the mob
     * @param id effect id, should be one of the [[Native.PotionEffect]]
     */
    function clearEffect(ent: number, id: number): void;

    /**
     * Clears all effects of the mob
     */
    function clearEffects(ent: number): void;

    /**
     * Damages entity
     * @param damage damage value
     * @param cause if specified, can be used as callback cause param
     * @param params additional params for the damage
     * @param params.attacker entity that caused damage, can be used as callback
     * cause param
     * @param params.bool1 if true, damage is reduced by entity armor
     * @param params.bool2 unknown param
     */
    function damageEntity(ent: number, damage: number, cause?: number, params?: { attacker?: number, bool1?: boolean, bool2?: boolean }): void;

    /**
     * @returns current dimension numeric id, one of the [[Native.Dimension]] 
     * values or custom dimension id
     */
    function getDimension(ent: number): number;

    /**
     * Adds specified health amount to the entity
     * @param heal health to be added to entity, in half-hearts
     */
    function healEntity(ent: number, heal: number): void;

    /**
     * @returns numeric entity type, one of the [[Native.EntityType]]
     */
    function getType(ent: number): number;

    /**
     * @returns string type for entities defined via add-ons or numeric type for
     * all the other entities 
     */
    function getTypeUniversal(ent: number): number | string;

    /**
     * @returns string type for entities defined via add-ons, otherwise null
     */
    function getTypeAddon(ent: number): Nullable<string>;

    /**
     * @returns compound tag for the specified entity
     */
    function getCompoundTag(ent: number): NBT.CompoundTag;

    /**
     * Sets compound tag for the specified entity
     */
    function setCompoundTag(ent: number, tag: NBT.CompoundTag): void;

    /**
     * Sets hitbox to the entity. Hitboxes define entities collisions
     * @param w hitbox width and length
     * @param h hitbox height
     */
    function setHitbox(ent: number, w: number, h: number): void;

    /**
     * @returns true if specified entity id is valid and entity with this id 
     * exists in the world
     */
    function isExist(ent: number): boolean;

    /**
     * Spawns vanilla entity on the specified coordinates
     * @param type numeric entity type, one of the [[Native.EntityType]]
     * @param skin skin to set for the entity. Leave empty or null to use 
     * default skin of the mob
     * @returns numeric id of spawn entity or -1 if entity was not created
     */
    function spawn(x: number, y: number, z: number, type: number, skin?: Nullable<string>): number;

    /**
     * Spawns custom entity on the specified coords. Allows to pass some values 
     * to controllers via extra param
     * @param name custom entity string id
     * @param extra object that contains some data for the controllers
     */
    function spawnCustom(name: string, x: number, y: number, z: number, extra?: object): CustomEntity;

    /**
     * Same as [[Entity.spawnCustom]], but uses [[Vector]] object to represent 
     * coordinates
     */
    function spawnCustomAtCoords(name: string, coords: Vector, extra?: any): CustomEntity;

    /**
     * Same as [[Entity.spawn]], but uses [[Vector]] object to represent 
     * coordinates
     */
    function spawnAtCoords(coords: Vector, type: number, skin?: string): void;

    /**
     * Removes entity from the world
     */
    function remove(ent: number): void;

    /**
     * @returns custom entity object by its numeric entity id
     */
    function getCustom(ent: number): CustomEntity;

    /**
     * @deprecated No longer supported
     */
    function getAge(ent: number): number;

    /**
     * @deprecated No longer supported
     */
    function setAge(ent: number, age: number): void;

    /**
     * @deprecated No longer supported
     */
    function getSkin(ent: number): string;

    /**
     * Sets mob skin
     * @param skin skin name, full path in the resourcepack (mod assets)
     */
    function setSkin(ent: number, skin: string): void;

    /**
     * Sets mob skin, uses [[Texture]] object
     * @deprecated use [[Entity.setSkin]] instead
     * @param texture 
     */
    function setTexture(ent: number, texture: Texture): void;

    /**
     * @returns entity render type, should be one of the 
     * [[Native.MobRenderType]] values
     */
    function getRender(ent: number): number;

    /**
     * Sets entity render type
     * @param render entity render type, should be one of the 
     * [[Native.MobRenderType]] values
     */
    function setRender(ent: number, render: number): void;

    /**
     * Makes rider ride entity
     * @param entity ridden entity
     * @param rider rider entity
     */
    function rideAnimal(entity: number, rider: number): void;

    /**
     * @returns entity custom name tag
     */
    function getNameTag(ent: number): string;

    /**
     * Sets custom entity tag. Custom entity tags are displayed above the 
     * entities and can be set by player using label
     * @param tag name tag to be set to the entity
     */
    function setNameTag(ent: number, tag: string): void;

    /**
     * Gets the attack target of current entity
     * @returns target entity's unique id
     */
    function getTarget(ent: number): number;

    /**
     * Sets the attack target for current entity. Works only for mobs that 
     * actually can attack
     * @param target target entity's unique id
     */
    function setTarget(ent: number, target: number): void;

    /**
     * @returns true, if entity was immobilized
     */
    function getMobile(ent: number): boolean;

    /**
     * Sets entity's immobile state
     * @param mobile if true, entity can move, otherwise it is immobilized
     */
    function setMobile(ent: number, mobile: boolean): void;

    /**
     * @returns true if entity is sneaking, false otherwise
     */
    function getSneaking(ent: number): boolean;

    /**
     * Sets entity's sneaking state
     * @param sneak if true, entity becomes sneaking, else not
     */
    function setSneaking(ent: number, sneak: boolean): void;

    /**
     * @returns entity that is riding the specified entity
     */
    function getRider(ent: number): number;

    /**
     * @returns entity that is ridden by specified entity
     */
    function getRiding(ent: number): number;

    /**
     * Puts entity on fire
     * @param fire duration (in ticks) of the fire
     * @param force should always be true
     */
    function setFire(ent: number, fire: number, force: boolean): void;

    /**
     * @returns an object that allows to manipulate entity health
     * @deprecated Consider using [[Entity.getHealth]], [[Entity.setHealth]],
     * [[Entity.getMaxHealth]] and [[Entity.setMaxHealth]] instead
     */
    function health(ent: number): EntityHealth;

    /**
     * @returns entity's current health value
     */
    function getHealth(ent: number): number;

    /**
     * Sets entity's current health value
     * @param health health value to be set
     */
    function setHealth(ent: number, health: number): void;

    /**
     * @returns entity's maximum health value
     */
    function getMaxHealth(ent: number): number;

    /**
     * Sets entity's maximum health value
     * @param maxHealth 
     */
    function setMaxHealth(ent: number, health: number): void;

    /**
     * Sets the specified coordinates as a new position for the entity. No 
     * checks are performed
     */
    function setPosition(ent: number, x: number, y: number, z: number): void;

    /**
     * @returns entity position
     */
    function getPosition(ent: number): Vector;

    /**
     * Updates current entity position by specified coordinates
     */
    function addPosition(ent: number, x: number, y: number, z: number): void;

    /**
     * Set current entity's velocity using velocity vector
     * @param x velocity
     * @param y velocity
     * @param z velocity
     */
    function setVelocity(ent: number, x: number, y: number, z: number): void;

    /**
     * Get current entity's velocity using velocity vector
     * @returns [[Vector]] containing current entity's velocity
     */
    function getVelocity(ent: number): Vector;

    /**
     * Updates current entity's velocity by specified value
     */
    function addVelocity(ent: number, x: number, y: number, z: number): void;

    /**
     * @returns distance in blocks between the two coordinate sets
     */
    function getDistanceBetweenCoords(coords1: Vector, coords2: Vector): number;

    /**
     * @returns distance between specified entity and a fixed coordinate set
     */
    function getDistanceToCoords(ent: number, coords: Vector): number;

    /**
     * @returns distance in blocks between two entities
     */
    function getDistanceToEntity(ent1: number, ent2: number): number;

    /**
     * @returns distance between player and entity, counting only x and z values
     * (y value is ignored)
     */
    function getXZPlayerDis(ent: number): number;

    /**
     * @returns entity's look angle in radians
     */
    function getLookAngle(ent: number): LookAngle;

    /**
     * Sets specified pitch and yaw as look angle for the entity
     * @param yaw look angle yaw in radians
     * @param pitch look angle pitch in radians
     */
    function setLookAngle(ent: number, yaw: number, pitch: number): void;

    /**
     * Transforms look angle into look vector
     * @param angle look angle to transform into [[Vector]]
     * @returns transformation result
     */
    function getLookVectorByAngle(angle: LookAngle): Vector;

    /**
     * @returns look vector for the entity
     */
    function getLookVector(ent: number): Vector;

    /**
     * @returns look angle between entity and static coordinates
     */
    function getLookAt(ent: number, x: number, y: number, z: number): LookAngle;

    /**
     * Sets entity look angle to look at specified coordinates
     */
    function lookAt(ent: number, x: number, y: number, z: number): void;

    /**
     * Same as [[Entity.lookAt]] but uses Vector as param type
     * @param coords 
     */
    function lookAtCoords(ent: number, coords: Vector): void;

    /**
     * Makes entity move to the target coordinates
     * @param params additional move parameters
     */
    function moveToTarget(ent: number, target: Vector, params: MoveParams): void;

    /**
     * Makes entity move using pitch/yaw angle to determine direction
     * @param angle angle to define entity's direction
     * @param params additional move parameters
     */
    function moveToAngle(ent: number, angle: LookAngle, params: MoveParams): void;

    /**
     * Makes entity move towards its current look angle
     * @param params additional move parameters
     */
    function moveToLook(ent: number, params: MoveParams): void;

    /**
     * Retrieves entity's current movement information
     * @returns object that contains normalized moving vector, moving speed and
     * moving xz speed (with no Y coordinate)
     */
    function getMovingVector(ent: number): MovingVector;

    /**
     * Retrieves entity look angle in the form of pitch/yaw angle. No other 
     * information included to the resulting object
     */
    function getMovingAngle(ent: number): LookAngle;

    /**
     * @deprecated No longer supported
     */
    function getMovingAngleByPositions(pos1: any, pos2: any): void;

    /**
     * Retrieves nearest to the coordinates entity of the specified entity type
     * @param coords search range center coordinates
     * @param type entity type ID. Parameter is no longer supported and should 
     * be 0 in all cases
     * @param maxRange if specified, determines search radius
     */
    function findNearest(coords: Vector, type?: number, maxRange?: number): Nullable<number>;

    /**
     * Returns array of all entities' numeric ids in given range in blocks
     * @param coords search range center coordinates
     * @param maxRange determines search radius
     * @param type entity type ID. Parameter is no longer supported and should 
     * not be used
     */
    function getAllInRange(coords: Vector, maxRange: number, type?: number): number[];

    /**
     * @deprecated No longer supported
     */
    function getInventory(ent: number, handleNames?: boolean, handleEnchant?: boolean): void;

    /**
     * @param slot armor slot id, should be one of the [[Native.ArmorType]] 
     * values
     * @returns armor slot contents for entity
     */
    function getArmorSlot(ent: number, slot: number): ItemInstance;

    /**
     * Sets armor slot contents for the entity
     * @param slot armor slot id, should be one of the [[Native.ArmorType]] 
     * values
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setArmorSlot(ent: number, slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * @param bool1 parameter is no longer supported and should not be used
     * @param bool2 parameter is no longer supported and should not be used
     * @returns entity's current carried item information
     */
    function getCarriedItem(ent: number): ItemInstance;

    /**
     * Sets current carried item for the entity
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setCarriedItem(ent: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * Gets item from specified drop entity
     * @returns [[ItemInstance]] that is in the dropped item
     */
    function getDroppedItem(ent: number): ItemInstance;

    /**
     * Sets item to the specified drop entity
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setDroppedItem(ent: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * @deprecated No longer supported
     */
    function getProjectileItem(projectile: number): ItemInstance;

    /**
     * Creates an object used to change entity's attributes. See {@page Attributes} page
     * for details.
     * @returns object used to manipulate entity's attributes
     */
    function getAttribute(ent: number, attribute: string): AttributeInstance;

    /**
     * Creates or gets an existing [[PathNavigation]] instance for the specified mob
     * @returns [[PathNavigation]] used to control entity's target position and
     * the way to get there
     */
    function getPathNavigation(ent: number): PathNavigation;

    /**
     * @param effectId numeric id of the potion effect,
     * one of [[Native.PotionEffect]] or [[EPotionEffect]] values.
     * @returns whether the given entity is affected by the potion effect with given numeric id
     */
    function hasEffect(entity: number, effectId: number): boolean;

    interface EffectInstance { level: number, duration: number }

    /**
     * @returns object with duration and level of the potion effect with given numeric id
     * on the given entity. These fields are set to 0, if the given effect doesn't affect
     * the given entity at the moment.
     */
    function getEffect(entity: number, effectId: number): EffectInstance;

    /**
     * Object used to build path and move mobs to the required coordinates using
     * specified parameters. All the setters return current [[PathNavigation]] 
     * instance to be able to produce chained calls. Some of the 
     */
    interface PathNavigation {
        /**
         * Builds path to the specified coordinates
         * @param speed entity movement speed
         */
        moveToCoords(x: number, y: number, z: number, speed: number): PathNavigation;

        /**
         * Builds path to the specified entity. Note that current coordinates of
         * entity are used, and are not updated
         * @param speed entity movement speed
         */
        moveToEntity(entity: number, speed: number): PathNavigation;

        /**
         * Sets function to be notified when path navigation is finished or aborted
         * @param function function to be called when navigation is finished or aborted
         */
        setResultFunction(callback: PathNavigationResultFunction): PathNavigation;

        /**
         * @returns whether the entity can pass doors
         */
        canPassDoors(): boolean;
        /**
         * Sets entity's door passing ability
         */
        setCanPassDoors(value: boolean): PathNavigation;

        isRiverFollowing(): boolean;
        setIsRiverFollowing(value: boolean): PathNavigation;

        /**
         * @returns whether the entity can open doors
         */
        canOpenDoors(): boolean;
        /**
         * Sets entity's door opening ability
         */
        setCanOpenDoors(value: boolean): PathNavigation;

        /**
         * Sets entity's sun avoiding
         */
        setAvoidSun(value: boolean): PathNavigation;

        /**
         * @returns whether the entity avoids water
         */
        getAvoidWater(): boolean;
        /**
         * Sets entity's water avoiding
         */
        setAvoidWater(value: boolean): PathNavigation;

        setEndPathRadius(value: boolean): PathNavigation;

        getCanSink(): boolean;
        setCanSink(value: boolean): PathNavigation;

        getAvoidDamageBlocks(): boolean;
        setAvoidDamageBlocks(value: boolean): PathNavigation;

        getCanFloat(): boolean;
        setCanFloat(value: boolean): PathNavigation;

        isAmphibious(): boolean;
        setIsAmphibious(value: boolean): PathNavigation;

        getAvoidPortals(): boolean;
        setAvoidPortals(value: boolean): PathNavigation;

        getCanBreach(): boolean;
        setCanBreach(value: boolean): PathNavigation;

        /**
         * @returns whether entity can jump
         */
        getCanJump(): boolean;

        /**
         * Enables or disables entity's jumping ability
         */
        setCanJump(value: boolean): PathNavigation;

        /**
         * @returns entity's speed value
         */
        getSpeed(): number;

        /**
         * Sets entity's speed value
         */
        setSpeed(value: number): PathNavigation;
    }

    /**
     * Occurs when path navigation is finished or aborted
     * @param navigation [[PathNavigation]] that the handler is attached to
     * @param result result code, one of the following:
     * 
     * 0 - success. You can call navigation.moveTo*** methods to resume path
     * 
     * 2 - entity was removed from the world
     * 
     * 4 - player left the world
     */
    interface PathNavigationResultFunction {
        (navigation: PathNavigation, result: number): void
    }

    /**
     * Class used to manipulate entity's health
     * @deprecated Consider using [[Entity.getHealth]], [[Entity.setHealth]],
     * [[Entity.getMaxHealth]] and [[Entity.setMaxHealth]] instead
     */
    class EntityHealth {
        /**
         * @returns entity's current health value
         */
        get(): number;

        /**
         * Sets entity's current health value
         * @param health health value to be set
         */
        set(health: number): void;

        /**
         * @returns entity's maximum health value
         */
        getMax(): number;

        /**
         * Sets entity's maximum health value
         * @param maxHealth 
         */
        setMax(maxHealth: number): void;
    }

    /**
     * Interface used to specify how entity should move
     */
    interface MoveParams {
        /**
         * Movement speed
         */
        speed?: number,

        /**
         * If true, entity won't change its Y velocity
         */
        denyY?: boolean,

        /**
         * Y velocity (jump speed)
         */
        jumpVel?: number
    }

    /**
     * Interface used to return entity's current moving vector and some 
     * additional data
     */
    interface MovingVector {
        /**
         * Normalized vector X coordinate
         */
        x: number,

        /**
         * Normalized vector Y coordinate
         */
        y: number,

        /**
         * Normalized vector Z coordinate
         */
        z: number,

        /**
         * Vector real length
         */
        size: number,

        /**
         * Vector real length excluding Y coordinate
         */
        xzsize: number
    }

    /**
     * Interface used to modify attribute values
     */
    interface AttributeInstance {

        /**
         * @returns current attribute's value
         */
        getValue(): number;

        /**
         * @returns attribute's maximum value
         */
        getMaxValue(): number;

        /**
         * @returns attribute's minimum value
         */
        getMinValue(): number;

        /**
         * @returns attribute's default value
         */
        getDefaultValue(): number;

        /**
         * Sets current attribute's value
         */
        setValue(value: number): void;

        /**
         * Sets attribute's maximum value
         */
        setMaxValue(value: number): void;

        /**
         * Sets attribute's minimum value
         */
        setMinValue(value: number): void;

        /**
         * Sets attribute's default value
         */
        setDefaultValue(value: number): void;
    }
}

/**
 * Class used to create new entity AI types
 */
declare class EntityAIClass implements EntityAIClass.EntityAIPrototype {
    /**
     * Creates new entity AI type
     * @param customPrototype AI type prototype
     */
    constructor(customPrototype: EntityAIClass.EntityAIPrototype);

    /**
     * Sets execution timer time in ticks. AI will be executed specified 
     * number of ticks
     * @param timer execution time in ticks
     */
    setExecutionTimer(timer: number): void;

    /**
     * Resets execution timer so that AI is executed with no time limits
     */
    removeExecutionTimer(): void;

    /**
     * If set to true, it is an instance of AI type, else the pattern 
     * (pattern should not be modified directly, AI controller calls 
     * instantiate to create instances of AI type)
     * 
     * TODO: add link to AI controller type
     */
    isInstance: boolean;

    /**
     * TODO: determine type
     */
    parent: any;

    /**
     * Id of the entity that uses this AI type instance or null if it is 
     * the pattern
     */
    entity?: number;

    /**
     * Method that is called to create AI type instance using current 
     * instance as pattern
     */
    instantiate(parent: any, name: string): EntityAIClass;

    /**
     * Occurs when entity this instance is assigned to this AI type 
     * instance, if you override this method, be sure to assign entity 
     * to [[EntityAIClass.EntityAIPrototype]]
     */
    aiEntityChanged(entity: number): void;

    /**
     * Finishes AI execution and disables it in parent controller
     */
    finishExecution(): void;

    /**
     * Changes own priority in parent's controller
     */
    changeSelfPriority(priority: number): void;

    /**
     * Enables any AI by its name in the controller
     * @param name AI name to be enables
     * @param priority priority to be set to the enabled AI
     * @param extra some extra data passed to 
     */
    enableAI(name: string, priority: number, extra: any): void;

    /**
     * Disables any AI by its name in the controller
     * @param name AI name to be disabled
     */
    disableAI(name: string): void;

    /**
     * Sets any AI priority by its name in the controller
     * @param name AI name to change priority
     * @param priority priority to be set to the AI
     */
    setPriority(name: string, priority: number): void;

    /**
     * Gets any AI object by its name from the current controller
     * @param name AI name
     */
    getAI(name: string): EntityAIClass;

    /**
     * Gets any AI priority from the current controller by AI name
     * @param name AI name
     */
    getPriority(name: string): number;

    /**
     * @returns AI type's default name
     */
    setParams(params: object): void;

    /**
     * All the parameters of the AI instance
     */
    params: object;

    /**
     * Object containing the state of the AI type
     */
    data: object;
}

declare namespace EntityAIClass {
    /**
     * Object used to register entity AI prototypes
     */
    interface EntityAIPrototype {
        /**
         * @returns AI type's default priority
         */
        getDefaultPriority?(): number,

        /**
         * @returns AI type's default name
         */
        getDefaultName?(): string,

        /**
         * Default parameters set
         */
        params?: object,

        /**
         * Called when AI type execution starts
         * @param extra additional data passed from [[EntityAIClass.enableAI]] 
         * method 
         */
        executionStarted?(extra?: any): void,

        /**
         * Called when AI type execution ends
         */
        executionEnded?(): void,

        /**
         * Called when AI type execution is paused
         */
        executionPaused?(): void,

        /**
         * Called when AI type execution is resumed
         */
        executionResumed?(): void,

        /**
         * Defines main logic of the AI type
         */
        execute?(): void,

        /**
         * Object containing the state of the AI type
         */
        data?: object,

        /**
         * Called when entity is attacked by player
         * @param entity player that attacked this entity
         */
        attackedBy?(attacker: number): void;

        /**
         * Called when entity gets hurt
         * @param attacker entity that damaged this entity, or -1 if damage 
         * source is not an entity
         * @param damage amount of damage
         */
        hurtBy?(attacker: number, damage: number): void;

        /**
         * Called when a projectile hits the entity
         * @param projectile projectile entity id
         */
        projectileHit?(projectile: number): void;

        /**
         * Called when entity is dead
         * @param attacker entity that damaged this entity, or -1 if damage 
         * source is not an entity
         */
        death?(attacker: number): void;
    }
}

/**
 * A set of predefined entity AI types
 */
declare namespace EntityAI {
    /**
     * Simple idle AI type, entity just does nothing
     */
    const Idle: EntityAIClass;

    /**
     * Follow AI type, entity follows its target. Use another AI type to set 
     * target for this AI type
     * 
     * @params **speed:** *number* entity movement speed when AI is executed
     * @params **jumpVel:** *number* jump (y) velocity
     * @params **rotateSpeed:** *number* entity rotation speed
     * @params **rotateRatio:** *number* how long will be the rotation path
     * @params **rotateHead:** *boolean* if true, entity turns its head to the target
     * @params **denyY:** *boolean* if true, entity won't change its Y velocity
     * 
     * @data **target:** [[Vector]] coordinates used as a target
     * @data **targetEntity:** *number* entity used as a target. If specified, 
     * target data is ignored
     */
    const Follow: EntityAIClass;

    /**
     * Panic AI type, entity just rushes around
     * 
     * @params **speed:** *number* entity movement speed when AI is executed
     * @params **angular_speed:** *number* entity speed when turning
     * 
     */
    const Panic: EntityAIClass;

    /**
     * Wander AI type, entity walks around making pauses
     * 
     * @params **speed:** *number* entity movement speed when AI is executed
     * @params **angular_speed:** *number* entity speed when turning
     * @params **delay_weight:** *number* part of the time entity is making 
     * pause
     * 
     */
    const Wander: EntityAIClass;

    /**
     * Attack AI type, entity causes damage to the target entity
     * 
     * @params **attack_damage:** *number* damage amount
     * @params **attack_range:** *number* damage radius
     * @params **attack_rate:** *number* time between to attacks in ticks
     * 
     * @data **target:** target entity
     */
    const Attack: EntityAIClass;

    /**
     * Swim AI type, if the entity is in water, it swims
     * 
     * @params **velocity:** *number* swimming speed
     */
    const Swim: EntityAIClass;

    /**
     * Panic AI watcher type, controls entity panic behavior after getting hurt
     * 
     * @params **panic_time:** *number* time the entity will be in panic
     * @params **priority_panic:** *number* panic AI priority when entity should
     * be in panic
     * @params **priority_default:** *number* panic AI priority when entity
     * should not be in panic
     * @params **name:** *number* name of the panic AI controller
     */
    const PanicWatcher: EntityAIClass;
}
declare class EntityModel {

}
/**
 * Defines armor type and armor slot index in player's inventory
 */
declare enum EArmorType {
    HELMET = 0,
    CHESTPLATE = 1,
    LEGGINGS = 2,
    BOOTS = 3
}

/**
 * Defines possible render layers (display methods) for blocks
 */
declare enum EBlockRenderLayer {
    DOUBLE_SIDE = 0,
    RAY_TRACED_WATER = 1,
    BLEND = 2,
    OPAQUE = 3,
    ALPHA = 4,
    OPAQUE_SEASONS = 6,
    ALPHA_SEASONS = 7,
    ALPHA_SINGLE_SIDE = 8,
    END_PORTAL = 9,
    BARRIER = 10,
    STRUCTURE_VOID = 11
}

/**
 * Defines numeric representation for each block side
 */
declare enum EBlockSide {
    DOWN = 0,
    UP = 1,
    NORTH = 2,
    SOUTH = 3,
    WEST = 4,
    EAST = 5
}

/**
 * Defines numeric representation for each vanilla block state
 */
declare enum EBlockStates {
    HEIGHT = 0,
    COVERED_BIT = 1,
    TORCH_FACING_DIRECTION = 2,
    OPEN_BIT = 3,
    DIRECTION = 4,
    UPSIDE_DOWN_BIT = 5,
    ATTACHED_BIT = 6,
    SUSPENDED_BIT = 7,
    POWERED_BIT = 8,
    DISARMED_BIT = 9,
    CRACKED_STATE = 10,
    TURTLE_EGG_COUNT = 11,
    TWISTING_VINES_AGE = 12,
    TOP_SLOT_BIT = 13,
    PORTAL_AXIS = 14,
    FACING_DIRECTION = 15,
    RAIL_DIRECTION = 16,
    STANDING_ROTATION = 17,
    WEIRDO_DIRECTION = 18,
    CORAL_DIRECTION = 19,
    LEVER_DIRECTION = 20,
    PILLAR_AXIS = 21,
    VINE_DIRECTION_BITS = 22,
    AGE_BIT = 23,
    AGE = 24,
    BITE_COUNTER = 25,
    BREWING_STAND_SLOT_A_BIT = 26,
    BREWING_STAND_SLOT_B_BIT = 27,
    BREWING_STAND_SLOT_C_BIT = 28,
    BUTTON_PRESSED_BIT = 29,
    CONDITIONAL_BIT = 30,
    DAMAGE = 31,
    DOOR_HINGE_HIT = 32,
    UPPER_BLOCK_HIT = 33,
    END_PORTAL_EYE_BIT = 34,
    EXPLODE_BIT = 35,
    FILL_LEVEL = 36,
    GROWTH = 37,
    HEAD_PIECE_BIT = 38,
    INFINIBURN_BIT = 39,
    IN_WALL_BIT = 40,
    LIQUID_DEPTH = 41,
    MOISTURIZED_AMOUNT = 42,
    NO_DROP_BIT = 43,
    KELP_AGE = 44,
    OCCUPIED_BIT = 45,
    OUTPUT_SUBTRACT_BIT = 46,
    OUTPUT_LIT_BIT = 47,
    PERSISTENT_BIT = 48,
    RAIL_DATA_BIT = 49,
    REDSTONE_SIGNAL = 50,
    REPEATER_DELAY = 51,
    TOGGLE_BIT = 52,
    TRIGGERED_BIT = 53,
    UPDATE_BIT = 54,
    ALLOW_UNDERWATER_BIT = 55,
    COLOR_BIT = 56,
    DEAD_BIT = 57,
    CLUSTER_COUNT = 58,
    ITEM_FRAME_MAP_BIT = 59,
    SAPLING_TYPE = 60,
    DRAG_DOWN = 61,
    COLOR = 62,
    BAMBOO_THICKNESS = 63,
    BAMBOO_LEAF_SIZE = 64,
    STABILITY = 65,
    STABILITY_CHECK_BIT = 66,
    WOOD_TYPE = 67,
    STONE_TYPE = 68,
    DIRT_TYPE = 69,
    SAND_TYPE = 70,
    OLD_LOG_TYPE = 71,
    NEW_LOG_TYPE = 72,
    CHISEL_TYPE = 73,
    DEPRECATED = 74,
    OLD_LEAF_TYPE = 75,
    NEW_LEAF_TYPE = 76,
    SPONGE_TYPE = 77,
    SAND_STONE_TYPE = 78,
    TALL_GRASS_TYPE = 79,
    FLOWER_TYPE = 80,
    STONE_SLAB_TYPE = 81,
    STONE_SLAB_TYPE2 = 82,
    STONE_SLAB_TYPE3 = 83,
    STONE_SLAB_TYPE4 = 84,
    MONSTER_EGG_STONE_TYPE = 85,
    STONE_BRICK_TYPE = 86,
    HUGE_MUSHROOM_BITS = 87,
    WALL_BLOCK_TYPE = 88,
    PRISMARINE_BLOCK_TYPE = 89,
    DOUBLE_PLANT_TYPE = 90,
    CHEMISTRY_TABLE_TYPE = 91,
    SEA_GRASS_TYPE = 92,
    CORAL_COLOR = 93,
    CAULDRON_LIQUID = 94,
    HANGING_BIT = 95,
    STRIPPED_BIT = 96,
    CORAL_HANG_TYPE_BIT = 97,
    ATTACHMENT = 98,
    STRUCTURE_VOID_TYPE = 99,
    STRUCTURE_BLOCK_TYPE = 100,
    EXTINGUISHED = 101,
    COMPOSTER_FILL_LEVEL = 102,
    CORAL_FAN_DIRECTION = 103,
    BLOCK_LIGHT_LEVEL = 104,
    BEEHIVE_HONEY_LEVEL = 105,
    WEEPING_VINES_AGE = 106,
    WALL_POST_BIT = 107,
    WALL_CONNECTION_TYPE_NORTH = 108,
    WALL_CONNECTION_TYPE_EAST = 109,
    WALL_CONNECTION_TYPE_SOUTH = 110,
    WALL_CONNECTION_TYPE_WEST = 111,
    ROTATION = 112,
    RESPAWN_ANCHOR_CHARGE = 113
}

/**
 * Defines text colors and font styles for chat and tip messages
 */
declare enum EColor {
    AQUA = "§b",
    BEGIN = "§",
    BLACK = "§0",
    BLUE = "§9",
    BOLD = "§l",
    DARK_AQUA = "§3",
    DARK_BLUE = "§1",
    DARK_GRAY = "§8",
    DARK_GREEN = "§2",
    DARK_PURPLE = "§5",
    DARK_RED = "§4",
    GOLD = "§6",
    GRAY = "§7",
    GREEN = "§a",
    ITALIC = "§o",
    LIGHT_PURPLE = "§d",
    OBFUSCATED = "§k",
    RED = "§c",
    RESET = "§r",
    STRIKETHROUGH = "§m",
    UNDERLINE = "§n",
    WHITE = "§f",
    YELLOW = "§e",
}

/**
 * Defines numeric representation for three vanilla dimensions
 */
declare enum EDimension {
    NORMAL = 0,
    NETHER = 1,
    END = 2
}

/**
 * Defines what enchantments can or cannot be applied to every instrument type
 */
declare enum EEnchantType {
    HELMET = 0,
    LEGGINGS = 2,
    BOOTS = 4,
    CHESTPLATE = 8,
    WEAPON = 16,
    BOW = 32,
    HOE = 64,
    SHEARS = 128,
    FLINT_AND_STEEL = 256,
    AXE = 512,
    PICKAXE = 1024,
    SHOVEL = 2048,
    FISHING_ROD = 4096,
    ALL = 16383,
    BOOK = 16383
}

/**
 * Defines numeric ids of all vanilla enchantments
 */
declare enum EEnchantment {
    PROTECTION = 0,
    FIRE_PROTECTION = 1,
    FEATHER_FALLING = 2,
    BLAST_PROTECTION = 3,
    PROJECTILE_PROTECTION = 4,
    THORNS = 5,
    RESPIRATION = 6,
    AQUA_AFFINITY = 7,
    DEPTH_STRIDER = 8,
    SHARPNESS = 9,
    SMITE = 10,
    BANE_OF_ARTHROPODS = 11,
    KNOCKBACK = 12,
    FIRE_ASPECT = 13,
    LOOTING = 14,
    EFFICIENCY = 15,
    SILK_TOUCH = 16,
    UNBREAKING = 17,
    FORTUNE = 18,
    POWER = 19,
    PUNCH = 20,
    FLAME = 21,
    INFINITY = 22,
    LUCK_OF_THE_SEA = 23,
    LURE = 24,
    FROST_WALKER = 25,
    MENDING = 26,
    BINDING_CURSE = 27,
    VANISHING_CURSE = 28,
    IMPALING = 29,
    RIPTIDE = 30,
    LOYALTY = 31,
    CHANNELING = 32
}

/**
 * Defines all vanilla entity type numeric ids
 */
declare enum EEntityType {
    PLAYER = 63,
    CHICKEN = 10,
    COW = 11,
    PIG = 12,
    SHEEP = 13,
    WOLF = 14,
    VILLAGER = 15,
    MUSHROOM_COW = 16,
    SQUID = 17,
    RABBIT = 18,
    BAT = 19,
    IRON_GOLEM = 20,
    SNOW_GOLEM = 21,
    OCELOT = 22,
    HORSE = 23,
    DONKEY = 24,
    MULE = 25,
    SKELETON_HORSE = 26,
    ZOMBIE_HORSE = 27,
    POLAR_BEAR = 28,
    LLAMA = 29,
    PARROT = 30,
    DOLPHIN = 31,
    ZOMBIE = 32,
    CREEPER = 33,
    SKELETON = 34,
    SPIDER = 35,
    PIG_ZOMBIE = 36,
    SLIME = 37,
    ENDERMAN = 38,
    SILVERFISH = 39,
    CAVE_SPIDER = 40,
    GHAST = 41,
    LAVA_SLIME = 42,
    BLAZE = 43,
    ZOMBIE_VILLAGER = 44,
    WHITCH = 45,
    STRAY = 46,
    HUSK = 47,
    WHITHER_SKELETON = 48,
    GUARDIAN = 49,
    ENDER_GUARDIAN = 50,
    WHITHER = 52,
    ENDER_DRAGON = 53,
    SHULKER = 54,
    ENDERMITE = 55,
    VINDICATOR = 57,
    PHANTOM = 58,
    RAVAGER = 59,
    ARMOR_STAND = 61,
    ITEM = 64,
    PRIMED_TNT = 65,
    FALLING_BLOCK = 66,
    MOVING_BLOCK = 67,
    EXPERIENCE_BOTTLE = 68,
    EXPERIENCE_ORB = 69,
    EYE_OF_ENDER_SIGNAL = 70,
    ENDER_CRYSTAL = 71,
    FIREWORKS_ROCKET = 72,
    THROWN_TRIDENT = 73,
    TURTLE = 74,
    CAT = 75,
    SHULKER_BULLET = 76,
    FISHING_HOOK = 77,
    DRAGON_FIREBOLL = 79,
    ARROW = 80,
    SNOWBALL = 81,
    EGG = 82,
    PAINTING = 83,
    MINECART = 84,
    FIREBALL = 85,
    THROWN_POTION = 86,
    ENDER_PEARL = 87,
    LEASH_KNOT = 88,
    WHITHER_SKULL = 89,
    BOAT = 90,
    WHITHER_SKULL_DANGEROUS = 91,
    LIGHTNING_BOLT = 93,
    SMALL_FIREBALL = 94,
    AREA_EFFECT_CLOUD = 95,
    HOPPER_MINECART = 96,
    TNT_COMMAND = 97,
    CHEST_MINECART = 98,
    COMMAND_BLOCK_MINECART = 100,
    LINGERING_POTION = 101,
    LLAMA_SPLIT = 102,
    EVOCATION_FANG = 103,
    EVOCATION_ILLAGER = 104,
    VEX = 105,
    PUFFERFISH = 108,
    SALMON = 109,
    DROWNED = 110,
    TROPICALFISH = 111,
    COD = 112,
    PANDA = 113,
    PILLAGER = 114,
    VILLAGER_V2 = 115,
    ZOMBIE_VILLAGE_V2 = 116,
    SHIELD = 117,
    WANDERING_TRADER = 118,
    ENDER_GUARDIAN_GHOST = 120
}

/**
 * Defines possible game difficulties
 */
declare enum EGameDifficulty {
    PEACEFUL = 0,
    EASY = 1,
    NORMAL = 2,
    HARD = 3
}

/**
 * Defines possible game modes
 */
declare enum EGameMode {
    SURVIVAL = 0,
    CREATIVE = 1,
    ADVENTURE = 2,
    SPECTATOR = 3
}

/**
 * Defines item animation types
 */
declare enum EItemAnimation {
    NORMAL = 0,
    BOW = 4
}

/**
 * Defines vanilla item categories in creative inventory
 */
declare enum EItemCategory {
    INTERNAL = 0,
    MATERIAL = 1,
    DECORATION = 2,
    TOOL = 3,
    FOOD = 4
}

/**
 * Defines vanilla mob render types
 */
declare enum EMobRenderType {
    TNT = 2,
    HUMAN = 3,
    ITEM = 4,
    CHICKEN = 5,
    COW = 6,
    MUSHROOM_COW = 7,
    PIG = 8,
    SHEEP = 9,
    BAT = 10,
    WOLF = 11,
    VILLAGER = 12,
    ZOMBIE = 14,
    ZOMBIE_PIGMAN = 15,
    LAVA_SLIME = 16,
    GHAST = 17,
    BLAZE = 18,
    SKELETON = 19,
    SPIDER = 20,
    SILVERFISH = 21,
    CREEPER = 22,
    SLIME = 23,
    ENDERMAN = 24,
    ARROW = 25,
    FISH_HOOK = 26,
    PLAYER = 27,
    EGG = 28,
    SNOWBALL = 29,
    UNKNOWN_ITEM = 30,
    THROWN_POTION = 31,
    PAINTING = 32,
    FALLING_TILE = 33,
    MINECART = 34,
    BOAT = 35,
    SQUID = 36,
    FIREBALL = 37,
    SMALL_FIREBALL = 38,
    VILLAGER_ZOMBIE = 39,
    EXPERIENCE_ORB = 40,
    LIGHTNING_BOLT = 41,
    IRON_GOLEM = 42,
    OCELOT = 43,
    SNOW_GOLEM = 44,
    EXP_POTION = 45,
    RABBIT = 46,
    WITCH = 47,
    CAMERA = 48,
    MAP = 50
}

/**
 * Defines numeric representation for each NBT data type
 */
declare enum ENbtDataType {
    TYPE_END_TAG = 0,
    TYPE_BYTE = 1,
    TYPE_SHORT = 2,
    TYPE_INT = 3,
    TYPE_INT64 = 4,
    TYPE_FLOAT = 5,
    TYPE_DOUBLE = 6,
    TYPE_BYTE_ARRAY = 7,
    TYPE_STRING = 8,
    TYPE_LIST = 9,
    TYPE_COMPOUND = 10,
    TYPE_INT_ARRAY = 11
}

/**
 * Defines all existing vanilla particles
 */
declare enum EParticleType {
    BUBBLE = 1,
    CRIT = 2,
    CLOUD = 4,
    SMOKE = 4,
    LARGEEXPLODE = 5,
    FLAME = 7,
    LAVA = 8,
    SMOKE2 = 9,
    REDSTONE = 10,
    ITEM_BREAK = 11,
    SNOWBALLPOOF = 12,
    HUGEEXPLOSION = 13,
    HUGEEXPLOSION_SEED = 14,
    MOB_FLAME = 15,
    TERRAIN = 16,
    HEART = 17,
    SUSPENDED_TOWN = 18,
    PORTAL = 20,
    RAIN_SPLASH = 21,
    SPLASH = 22,
    DRIP_WATER = 23,
    DRIP_LAVA = 24,
    INK = 25,
    FALLING_DUST = 26,
    SPELL3 = 27,
    SPELL2 = 28,
    SPELL = 29,
    SLIME = 30,
    WATER_WAKE = 31,
    ANGRY_VILLAGER = 32,
    HAPPY_VILLAGER = 33,
    ENCHANTMENTTABLE = 34,
    NOTE = 36
}

/**
 * Defines player's abilities. See {@page Abilities} for details
 */
declare enum EPlayerAbility {
    ATTACK_MOBS = "attackmobs",
    ATTACK_PLAYERS = "attackplayers",
    BUILD = "build",
    DOORS_AND_SWITCHES = "doorsandswitches",
    FLYSPEED = "flyspeed",
    FLYING = "flying",
    INSTABUILD = "instabuild",
    INVULNERABLE = "invulnerable",
    LIGHTNING = "lightning",
    MAYFLY = "mayfly",
    MINE = "mine",
    MUTED = "mute",
    NOCLIP = "noclip",
    OPERATOR_COMMANDS = "op",
    OPEN_CONTAINERS = "opencontainers",
    TELEPORT = "teleport",
    WALKSPEED = "walkspeed",
    WORLDBUILDER = "worldbuilder"
}

/**
 * Defines vanilla potion effects
 */
declare enum EPotionEffect {
    MOVEMENT_SPEED = 1,
    MOVEMENT_SLOWDOWN = 2,
    DIG_SPEED = 3,
    DIG_SLOWDOWN = 4,
    DAMAGE_BOOST = 5,
    HEAL = 6,
    HARM = 7,
    JUMP = 8,
    CONFUSION = 9,
    REGENERATION = 10,
    DAMAGE_RESISTANCE = 11,
    FIRE_RESISTANCE = 12,
    WATER_BREATHING = 13,
    INVISIBILITY = 14,
    BLINDNESS = 15,
    NIGHT_VISION = 16,
    HUNGER = 17,
    WEAKNESS = 18,
    POISON = 19,
    WITHER = 20,
    HEALTH_BOOST = 21,
    ABSORPTION = 22,
    SATURATION = 23,
    LEVITATION = 24,
    FATAL_POISON = 25,
    CONDUIT_POWER = 26,
    SLOW_FALLING = 27,
    BAD_OMEN = 28,
    VILLAGE_HERO = 29
}

/**
 * Defines numeric representation for vanilla TileEntity types.
 * Use [[NativeTileEntity]] class to work with them.
 */
declare enum ETileEntityType {
    NONE = -1,
    CHEST = 0,
    FURNACE = 1,
    HOPPER = 2,
    BREWING_STAND = 8,
    DISPENSER = 13,
    CAULDRON = 16,
    BEACON = 21,
    JUKEBOX = 33,
    LECTERN = 37
}
/**
 * Module that provides methods to work with android file system
 */
declare namespace FileTools {
    /**
     * Defines path to android /mnt directory
     */
    const mntdir: string;

    /**
     * Defines user directory path, ends with "/"
     */
    const root: string;

    /**
     * Defines mods folder path, ends with "/"
     */
    const moddir: string;

    /**
     * Creates directory by its home-relative or absolute path, if one of the 
     * parent directories doesn't exist, creates them
     * @param dir path to the new directory
     */
    function mkdir(dir: string): void;

    /**
     * Creates CoreEngine working directories. Called by CoreEngine and should 
     * not be called by end user
     */
    function mkworkdirs(): void;

    /**
     * Converts home-relative path to absolute
     * @param path input path
     * @returns input string if input string is an absolute path, an absolute 
     * path if input string is a home-relative path
     */
    function getFullPath(path: string): string;

    /**
     * Verifies if specified home-relative or absolute path exists
     * @param path path to be verified
     * @returns true, if specified path exists, false otherwise
     */
    function isExists(path: string): boolean;

    /**
     * Writes text to the file
     * @param file home-relative or absolute path to the file
     * @param text text to be written to the file
     * @param add if true, appends text to the file, overrides it otherwise. 
     * Default value is false
     */
    function WriteText(file: string, text: string, add?: boolean): void;

    /**
     * Reads text from file
     * @param file home-relative or absolute path to the file
     * @returns file contents or null if file does not exist or not accessible
     */
    function ReadText(file: any): Nullable<string>;

    /**
     * Writes bitmap to png file
     * @param file home-relative or absolute path to the file
     * @param bitmap android.graphics.Bitmap object of the bitmap to be written
     * to the file
     */
    function WriteImage(file: string, bitmap: android.graphics.Bitmap): void;

    /**
     * Reads bitmap from file
     * @param file home-relative or absolute path to the file
     * @returns android.graphics.Bitmap object of the bitmap that was read from
     * file or null if file does not exist or is not accessible
     */
    function ReadImage(file: string): Nullable<android.graphics.Bitmap>;

    /**
     * Reads string from asset by its full name
     * @param name asset name
     * @returns asset contents or null if asset doesn't exist
     */
    function ReadTextAsset(name: string): string;

    /**
     * Reads bitmap from asset by its full name
     * @param name asset name
     * @returns android.graphics.Bitmap object of the bitmap that was read from
     * asset or null, if asset doesn't exist
     */
    function ReadImageAsset(name: string): Nullable<android.graphics.Bitmap>;

    /**
     * Reads bytes array from assets
     * @param name asset name
     * @returns java array of bytes read from assets or null if asset doesn't 
     * exist
     */
    function ReadBytesAsset(name: string): native.Array<jbyte>;

    /**
     * Lists children directories for the specified path
     * @param path home-relative or absolute path to the file
     * @returns array of java.io.File instances of listed directories
     */
    function GetListOfDirs(path: string): java.io.File[];

    /**
     * Lists files in the specified directory
     * @param path path to directory to look for files in
     * @param ext extension of the files to include to the output. Use empty 
     * string to include all files
     * @returns array of java.io.File instances that match specified extension
     */
    function GetListOfFiles(path: string, ext: string): java.io.File[];

    /**
     * Reads file as key:value pairs
     * @param dir home-relative or absolute path to the file
     * @param specialSeparator separator between key and value, ":" by default
     * @returns object containing key:value pairs from file
     */
    function ReadKeyValueFile(dir: string, specialSeparator?: string): {
        [key: string]: string
    };

    /**
     * Writes key:value pairs to the file
     * @param dir home-relative or absolute path to the file
     * @param data object to be written to the file as a set of key:value pairs
     * @param specialSeparator separator between key and value, ":" by default
     */
    function WriteKeyValueFile(dir: string, data: object, specialSeparator?: string): void;

    /**
     * Reads file as JSON
     * @param dir home-relative or absolute path to the file
     * @returns value read from JSON file
     */
    function ReadJSON(dir: string): any;

    /**
     * Writes object to file as JSON
     * @param dir home-relative or absolute path to the file
     * @param obj object to be written to the file as JSON
     * @param beautify if true, output JSON is beautified
     */
    function WriteJSON(dir: string, obj: any, beautify: boolean): void;
}
/**
 * Module that provides some general game-related functions
 */
declare namespace Game {
    /**
     * Prevents current callback function from being called in Minecraft.
     * For most callbacks it prevents default game behaviour
     */
    function prevent(): void;

    /**
     * @returns true if the current callback function has already been
     * prevented from being called in Minecraft using [[Game.prevent]],
     * false otherwise
     */
    function isActionPrevented(): boolean;

    /**
     * Writes message to the chat. Message can be formatted using 
     * [[Native.Color]] values
     * @param msg message to be displayed
     */
    function message(msg: string): void;

    /**
     * Writes message above the hot bar. Message can be formatted using 
     * [[Native.Color]] values
     * @param msg message to be displayed
     */
    function tipMessage(msg: string): void;

    /**
     * Displays android AlertDialog with given message and dialog title
     * @param message message to be displayed
     * @param title title of the AlertDialog
     */
    function dialogMessage(message: string, title: string): void;

    /**
     * Sets game difficulty, one of [[Native.GameDifficulty]] values
     * @param difficulty game difficulty to be set
     */
    function setDifficulty(difficulty: number): void;

    /**
     * @returns current game difficulty, one of the [[Native.GameDifficulty]] 
     * values
     */
    function getDifficulty(): number;

    /**
     * Sets current level game mode
     * @param gameMode new game mode, should be one of the [[Native.GameMode]]
     * values
     */
    function setGameMode(gameMode: number): void;

    /**
     * @returns current level game mode, one of the [[Native.GameMode]] values
     */
    function getGameMode(): number;

    /**
     * @returns string containing current Minecraft version
     */
    function getMinecraftVersion(): string;

    /**
     * @returns string containing current Core Engine version
     */
    function getEngineVersion(): string;

    /**
     * @returns true if item spending allowed
     */
    function isItemSpendingAllowed(player?: number): boolean;

    /**
     * true if developer mode was enabled in InnerCore config, false otherwise
     */
    let isDeveloperMode: boolean;
}
/**
 * Class used to create and manipulate game objects. Game objects are [[Updatable]]s 
 * that are being saved between game launches
 */
declare class GameObject {
    /**
     * Constructs a new [[GameObject]] with given params
     * @param type unique name for the game object type. Use package-like names to 
     * ensure your game object name is unique
     * @param prototype 
     */
    constructor(type: string, prototype: GameObjectPrototype);

    /**
     * Original value passed to [[GameObject.constructor]]
     */
    readonly originalName: string;

    /**
     * Creates a new game object with specified params and registers it for saving
     * and as an [[Updatable]]
     * @param args any arguments that are passed to [[GameObjectPrototype.init]]
     * function
     * @returns instantiated game object
     */
    deploy(...args: any): GameObject;

    /**
     * Destroys current game object
     */
    destroy(): void;

    /**
     * True if current GameObject was deployed, false otherwise
     */
    readonly isInstance: boolean;
}

interface GameObjectPrototype extends Updatable {
    /**
     * Function that is called when a new instance of [[GameObject]] is created,
     * the engine passes all the arguments of [[GameObject.deploy]] function to 
     * this function
     */
    init?: (...args: any) => void,
    /**
     * Function that is called when a [[GameObject]] is loaded
     */
    loaded?: () => void,

    /**
     * Any other user-defined methods and properties
     */
    [key: string]: any
}

declare namespace GameObjectRegistry {
    /**
     * Gets an array of [[GameObject]]s of specified type. 
     * @param type unique [[GameObject]] type to get all the instances of
     * @param clone if true, a new array is created to ensure the original engine's 
     * data safety
     */
    function getAllByType(type: string, clone: boolean): GameObject[];

    /**
     * Calls function of the [[GameObject]] of specified type with specified 
     * parameters
     * @param type unique [[GameObject]] type to get all the instances of
     * @param func function name as defined in [[GameObjectPrototype]] passed to
     * [[GameObject.constructor]]
     * @param params parameters to be passed to the function
     */
    function callForType(type: string, func: string, ...params: any): any;

    /**
     * Same as [[GameObjectRegistry.callForType]], though a new array is created
     * before calling functions on the game objects to ensure the original engine's
     * data safety
     */
    function callForTypeSafe(type: string, func: string, ...params: any): any;
}
/**
 * Module used to simplify generation tasks in mods logic
 */
declare namespace GenerationUtils {
    /**
     * @param id numeric tile id
     * @returns true if block is solid and light blocking block, false otherwise
     */
    function isTerrainBlock(id: number): boolean;

    /**
     * @param id numeric tile id
     * @returns true if block is transparent, false otherwise
     */
    function isTransparentBlock(id: number): boolean;

    /**
     * @returns true, if one can see sky from the specified position, false 
     * otherwise
     */
    function canSeeSky(x: number, y: number, z: number): boolean;

    /**
     * Generates random x and z coordinates inside specified chunk
     * @param cx chunk x coordinate
     * @param cz chunk z coordinate
     */
    function randomXZ(cx: number, cz: number): { x: number, z: number };

    /**
     * Generates random coordinates inside specified chunk
     * @param cx chunk x coordinate
     * @param cz chunk z coordinate
     * @param lowest lowest possible y coordinate. Default is 0
     * @param highest highest possible y coordinate. Default is 128
     */
    function randomCoords(cx: number, cz: number, lowest?: number, highest?: number): Vector;

    /**
     * Finds nearest to the specified y coordinate empty space on the specified 
     * x and z coordinates
     */
    function findSurface(x: number, y: number, z: number): Vector;

    /**
     * Finds nearest to y=128 coordinate empty space on the specified x and z 
     * coordinates
     */
    function findHighSurface(x: number, z: number): Vector;

    /**
     * Finds nearest to y=64 coordinate empty space on the specified x and z 
     * coordinates
     */
    function findLowSurface(x: number, z: number): Vector;

    function lockInBlock(id: number, data: number, checkerTile: any, checkerMode: any): void;

    function setLockedBlock(x: number, y: number, z: number): void;

    /**
     * Generates ore vein on the specified coordinates using specified params
     * @deprecated Consider using [[GenerationUtils.generateOre]] instead
     * @param params generation params
     * @param params.id ore tile id
     * @param params.data ore data
     * @param params.noStoneCheck if true, no check for stone is performed so 
     * the ore may be generated in the air. Use this to debug ore generation in 
     * the superflat worlds
     * @param params.amount amount of the ore to be generated
     * @param params.ratio if amount is not specified, used to calculate amount
     * @param params.size if amount is not specified, used to calculate amount, 
     * using simple formula
     * ```
     * size * ratio * 3
     * ```
     */
    function genMinable(x: number, y: number, z: number, params: { id: number, data: number, noStoneCheck: number, amount?: number, ratio?: number, size?: number }): void;

    /**
     * Generates ore vein on the specified coordinates
     * @param id ore tile id
     * @param data ore data
     * @param amount ore amount, use number at least 6 to be able to find 
     * generated ore. Note that amount doesn't mean blocks count, it is just an 
     * input value for generation algorithm
     * @param noStoneCheck if true, no check for stone is performed so the ore 
     * may be generated in the air. Use this to debug ore generation in the 
     * superflat worlds
     * @param seed random generation seed
     */
    function generateOre(x: number, y: number, z: number, id: number, data: number, amount: number, noStoneCheck: boolean, seed?: number): void;

    /**
     * Generates ore with custom whitelist/blacklist, see [[GenerationUtils.generateOre]]
     * for details
     * @param mode if true, specified block ids are used as whitelist for generation
     * (only the ids from the list can be replaced with ores), if false - specified 
     * block ids are used as a blacklist (only the ids from the list canNOT be 
     * replaced with ores)
     * @param listOfIds array of block ids to be used as whitelist or blacklist
     */
    function generateOreCustom(x: number, y: number, z: number, id: number, data: number, amount: number, mode: boolean, listOfIds: number[], seed?: number): void;

    /**
     * Retrieves perlin noise value at the specified coordinates
     * @param seed integer random generator seed. If not specified or set to 0, the default
     * constant value is used
     * @param scale noise size, to set the main octave size, use *1 / octave size*
     * @param numOctaves number of octaves, the more octaves you use, the more 
     * detailed is the generated noise. The next octave is two times smaller then 
     * the previous one
     */
    function getPerlinNoise(x: number, y: number, z: number, seed?: number, scale?: number, numOctaves?: number): number;
}

/**
 * Module used to manage item and block ids. Items and blocks have the same 
 * underlying nature, so their ids are interchangeable. Though, the blocks are
 * defined "twice", as an item (in player's hand or inventory) and as a tile 
 * (a block placed in the world)
 */
declare namespace IDRegistry {
    /**
     * Defines the numeric id of the first user-defined item
     */
    const ITEM_ID_OFFSET: number;

    /**
     * Defines the numeric id of the first user-defined block
     */
    const BLOCK_ID_OFFSET: number;

    /**
     * Defines maximum item/block id
     */
    const MAX_ID: number;

    /**
     * Generates a new numeric block id
     * @param name string block id. Used in [[Block]] module functions and 
     * in some other block-related functions. Inner Core converts it to 
     * block_<name> as minecraft vanilla block id to avoid string id clashes
     * @returns numeric block id
     */
    function genBlockID(name: string): number;

    /**
     * Generates a new numeric item id
     * @param name string item id. Used in [[Item]] module functions and 
     * in some other item-related functions. Inner Core converts it to 
     * item_<name> as minecraft vanilla item id to avoid string id clashes
     * @returns numeric item id
     */
    function genItemID(name: string): number;

    /**
     * Gets item or block string id by its numeric id
     * @param id numeric item or block id
     */
    function getNameByID(id: number): string;

    /**
     * Ensures given id is a tile id, not a block id. It is generally recommended 
     * to use [[Block.convertItemToBlockId]] since it performs less calculations
     * @param id block or tile id
     * @returns tile id
     */
    function ensureBlockId(id: number): number;

    /**
     * Ensures given id is a block id, not a tile id. It is generally recommended 
     * to use [[Block.convertBlockToItemId]] since it performs less calculations
     * @param id block or tile id
     * @returns block id
     */
    function ensureItemId(id: number): number;

    /**
     * @param id numeric item or block id
     * @returns true if item is vanilla Minecraft item, false otherwise
     */
    function isVanilla(id: number): boolean;

    /**
     * Gets type of item ("block" or "item") and its string id in Minecraft
     * @param id numeric item or block id
     * @returns string in format "type:string_id" or
     * "type:string_id#extra_information"
     */
    function getIdInfo(id: number): string;
}

/**
 * Namespace used to change item models in player's hand and/or inventory. 
 * By default, if the block has an [[ICRender]], it is automatically applied as item's model
 */
declare namespace ItemModel {
    /**
     * Gets [[ItemModel]] object for the specified id and data
     * @param id item or block id
     * @param data item or block data
     * @returns [[ItemModel]] object used to manipulate item's model
     */
	function getFor(id: number, data: number): ItemModel;
	
	function setCurrentCacheGroup(mod: string, version: string): void;

    /**
     * Gets [[ItemModel]] object for the specified id and data. If no [[ItemModel]] for
     * specified data exist, uses default data (0)
     * @returns [[ItemModel]] object used to manipulate item's model
     */
    function getForWithFallback(id: number, data: number): ItemModel;

    /**
     * Creates a new standalone item model that is not connected with any item or block
     */
    function newStandalone(): ItemModel;

    /**
     * @returns a collection of all existing item models
     */
    function getAllModels(): java.util.Collection<ItemModel>;

    /**
     * Releases some of the bitmaps to free up memory
     * @param bytes bytes count to be released
     */
    function tryReleaseModelBitmapsOnLowMemory(bytes: number): void;

    interface ModelOverrideFunction {
        (item: ItemInstance): ItemModel
    }

    interface IconRebuildListener {
        (model: ItemModel, newIcon: android.graphics.Bitmap): void
    }

    /**
     * @returns empty [[RenderMesh]] from the pool or creates an empty one. Used 
     * to reduce constructors/destructors calls
     */
    function getEmptyMeshFromPool(): RenderMesh;

    /**
     * Releases [[RenderMesh]] and returns it to the pool. Used to reduce
     * constructors/destructors calls
     */
    function releaseMesh(mesh: RenderMesh): void;

    /**
     * @param randomize if true, item mesh position is randomized
     * @returns [[RenderMesh]] generated for specified item
     */
    function getItemRenderMeshFor(id: number, count: number, data: number, randomize: boolean): RenderMesh;

    /**
     * @param id item or block numeric id
     * @param data item or block data
     * @returns texture name for the specified item or block
     */
    function getItemMeshTextureFor(id: number, data: number): string;
}

/**
 * Class representing item model in player's hand and/or inventory. To get an instance of this
 * class from your code, use [[ItemModel.getFor]] static function. The coordinates of the full block in
 * player's hand or inventory is (0, 0, 0), (1, 1, 1), so it is generally recommended to use the models 
 * that fit that bound at least for the inventory 
 */
declare interface ItemModel {
    /**
     * Item or block id current [[ItemModel]] relates to
     */
    readonly id: number;

    /**
     * Item or block data current [[ItemModel]] relates to
     */
    readonly data: number;

    occupy(): ItemModel;

    isSpriteInUi(): boolean;

    isEmptyInUi(): boolean;

    isSpriteInWorld(): boolean;

    isEmptyInWorld(): boolean;

    /**
     * @returns true, if the model is empty
     */
    isEmpty(): boolean;

    isNonExistant(): boolean;

    /**
     * @returns true, if this item model overrides the default model in player's hand
     */
    overridesHand(): boolean;

    /**
     * @returns true, if this item model overrides the default model in player's inventory
     */
    overridesUi(): boolean;

    getShaderUniforms(): ShaderUniformSet;

    setSpriteUiRender(isSprite: boolean): ItemModel;

    /**
     * Sets item's model to display both in the inventory and in hand
     * @param model [[RenderMesh]], [[ICRender.Model]] or [[BlockRenderer.Model]] to be used as item model
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     * @param material material name to be used for the model
     */
    setModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;

    /**
     * Sets item's model to display only in player's hand
     * @param model [[RenderMesh]], [[ICRender.Model]] or [[BlockRenderer.Model]] to be used as item model
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     * @param material material name to be used for the model
     */
    setHandModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;

    /**
     * Sets item's model to display only in player's inventory
     * @param model [[RenderMesh]], [[ICRender.Model]] or [[BlockRenderer.Model]] to be used as item model
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     * @param material material name to be used for the model
     */
    setUiModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;

    /**
     * Sets item model's texture in both player's inventory and in hand
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     */
    setTexture(texture: string): ItemModel;

    /**
     * Sets item model's texture only in player's hand
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     */
    setHandTexture(texture: string): ItemModel;

    /**
     * Sets item model's texture only in player's inventory
     * @param texture texture name to be used for the model (use "atlas::terrain" for block textures)
     */
    setUiTexture(texture: string): ItemModel;

    /**
     * Sets item model's material in both player's inventory and in hand
     * @param texture material name to be used for the model. See 
     * {@page Materials and Shaders} for more information
     */
    setMaterial(texture: string): ItemModel;

    /**
     * Sets item model's material only in player's hand
     * @param texture material name to be used for the model
     */
    setHandMaterial(texture: string): ItemModel;

    /**
     * Sets item model's material only in player's inventory
     * @param texture material name to be used for the model
     */
    setUiMaterial(texture: string): ItemModel;

    setGlintMaterial(material: string): ItemModel;

    setHandGlintMaterial(material: string): ItemModel;

    setUiGlintMaterial(material: string): ItemModel;

    getUiTextureName(): string;

    getWorldTextureName(): string;

    getUiMaterialName(): string;

    getWorldMaterialName(): string;

    getUiGlintMaterialName(): string;

    getWorldGlintMaterialName(): string;

    newTexture(): android.graphics.Bitmap;

    getSpriteMesh(): RenderMesh;

    addToMesh(mesh: RenderMesh, x: number, y: number, z: number): void;

    getMeshTextureName(): string;

    setItemTexturePath(path: string): ItemModel;

    setItemTexture(name: string, index: number): ItemModel;

    removeModUiSpriteTexture(): ItemModel;

    setModUiSpritePath(path: string): ItemModel;

    setModUiSpriteName(name: string, index: number): ItemModel;

    setModUiSpriteBitmap(bitmap: android.graphics.Bitmap): ItemModel;

    getModelForItemInstance(id: number, count: number, data: number, extra: ItemExtraData): ItemModel;

    setModelOverrideCallback(callback: ItemModel.ModelOverrideFunction): ItemModel;

    isUsingOverrideCallback(): boolean;

    releaseIcon(): void;

    reloadIconIfDirty(): void;

    getIconBitmap(): android.graphics.Bitmap;

    getIconBitmapNoReload(): android.graphics.Bitmap;

    reloadIcon(): void;

    queueReload(listener?: ItemModel.IconRebuildListener): android.graphics.Bitmap;

    setCacheKey(key: string): void;

    getCacheKey(): string;

    updateForBlockVariant(variant: com.zhekasmirnov.innercore.api.unlimited.BlockVariant): void;

    getItemRenderMesh(count: number, randomize: boolean): RenderMesh;

}
/**
 * Module used to log messages to Inner Core log and android log
 */
declare namespace Logger {
    /**
     * Writes message to the log, using specified log prefix
     * @param message message to be logged
     * @param prefix prefix of the message, can be used to filter log
     */
    function Log(message: string, prefix: string): void;

    /**
     * Logs java Throwable with full stack trace to 
     * @param error java Throwable to be logged
     */
    function LogError(error: java.lang.Throwable): void;

    /**
     * Writes logger content to file and clears all buffers
     */
    function Flush(): void;
}
/**
 * Module used to share mods' APIs
 */
declare namespace ModAPI {
    /**
     * Registers new API for the mod and invokes mod API callback
     * @param name API name used to import it in the other mods
     * @param api object that is shared with the other mods. May contain other 
     * objects, methods, variables, etc. Sometimes it is useful to provide the 
     * ability to run third party code in your own mod, you can create a method
     * that provides such possibility: 
     * ```ts
     * requireGlobal: function(command){
     *     return eval(command);
     * }
     * ``` 
     * @param descr simple documentation for the mod API
     * @param descr.name full name of the API, if not specified, name parameter 
     * value is used
     * @param descr.props object containing descriptions of methods and 
     * properties of the API, where keys are methods and properties names and 
     * values are their descriptions
     */
    function registerAPI(name: string, api: object, descr?: { name?: string, props?: object }): void;

    /**
     * Gets API by its name. The best approach is to call this method in the
     * function passed as the second parameter of [[ModAPI.addAPICallback]].
     * 
     * Example:
     * ```ts
     * // importing API registered by IndustrialCraft PE
     * var ICore;
     * ModAPI.addAPICallback("ICore", function(api){
     *     ICore = api;
     * });
     * ```
     * 
     * When using ICore variable from the example, be sure to check it for null
     * because Industrial Craft PE may not be installed on the user's phone
     * @param name API name
     * @returns API object if an API with specified was previously registered,
     * null otherwise
     */
    function requireAPI(name: string): Nullable<object>;

    /**
     * Executes string in Core Engine's global context. Can be used to get 
     * functions and objects directly from AdaptedScriptAPI.
     * @param name string to be executed in Core Engine's global context
     */
    function requireGlobal(name: string): any;

    /**
     * @param name API name
     * @returns documentation for the specified mod API
     */
    function requireAPIdoc(name: string): ModDocumentation;

    /**
     * Fetches information about the method or property of mod API
     * @param name API name
     * @param prop property or method name
     * @returns string description of the method or null if no description was
     * provided by API vendor
     */
    function requireAPIPropertyDoc(name: string, prop: string): Nullable<string>;

    /**
     * @deprecated No longer supported
     */
    function getModByName(modName: string): void;

    /**
     * @deprecated No longer supported
     */
    function isModLoaded(modName: string): void;

    /**
     * Adds callback for the specified mod API
     * @param apiName API name
     * @param func callback that is called when API is loaded
     */
    function addAPICallback(apiName: string, func:
        /**
         * @param api shared mod API
         */
        (api: object) => void): void;

    /**
     * @deprecated No longer supported
     */
    function addModCallback(modName: string, func: any): void;

    /**
     * @deprecated No longer supported
     */
    function getModList(): void;

    /**
     * @deprecated No longer supported
     */
    function getModPEList(): void;

    /**
     * @deprecated No longer supported
     */
    function addTexturePack(path: any): void;

    /**
     * Recursively copies (duplicates) the object to the new one
     * @param api an object to be copied
     * @param deep if true, copies the object recursively
     * @returns a copy of the object
     */
    function cloneAPI(api: object, deep: boolean): object;

    /**
     * Ensures target object has all the properties the source object has, if 
     * not, copies them from source to target object. 
     * @param source object to copy missing values from
     * @param target object to copy missing values to
     */
    function inheritPrototypes(source: object, target: object): object;

    /**
     * Recursively clones object to the new one counting call depth and 
     * interrupting copying after 7th recursion call
     * @param source an object to be cloned
     * @param deep if true, copies the object recursively
     * @param rec current recursion state, if > 6, recursion stops. Default 
     * value is 0
     * @returns cloned object, all the properties that are less then then 8 in
     * depth, get copied
     */
    function cloneObject(source: any, deep: any, rec?: number): object;

    /**
     * @returns same as [[ModAPI.cloneObject]], but if call depth is more then
     * 6, returns "stackoverflow" string value
     */
    function debugCloneObject(source: any, deep: any, rec?: number): object | string;

    /**
     * Objects used to represent mod API documentation
     */
    interface ModDocumentation {
        /**
         * full name of the API
         */
        name: string,

        /**
         * object containing descriptions of methods and properties of the API, 
         * where keys are methods and properties names and 
         * values are their descriptions
         */
        props: object
    }
}

/**
 * Module containing enums that can make user code more readable
 * @deprecated from InnerCore Test 2.2.1b89, use new enum system instead
 */
declare namespace Native {
    /**
     * Defines armor type and armor slot index in player's inventory
     */
    enum ArmorType {
        boots = 3,
        chestplate = 1,
        helmet = 0,
        leggings = 2,
    }

    /**
     * Defines item category in creative inventory
     */
    enum ItemCategory {
        DECORATION = 2,
        FOOD = 4,
        INTERNAL = 0,
        MATERIAL = 1,
        TOOL = 3,
    }

    /**
     * Defines all existing vanilla particles
     */
    enum ParticleType {
        angryVillager = 32,
        bubble = 1,
        cloud = 4,
        crit = 2,
        dripLava = 24,
        dripWater = 23,
        enchantmenttable = 32,
        fallingDust = 26,
        flame = 7,
        happyVillager = 33,
        heart = 17,
        hugeexplosion = 14,
        hugeexplosionSeed = 15,
        ink = 25,
        itemBreak = 12,
        largeexplode = 5,
        lava = 8,
        mobFlame = 16,
        note = 36,
        portal = 20,
        rainSplash = 21,
        redstone = 10,
        slime = 30,
        smoke = 4,
        smoke2 = 9,
        snowballpoof = 13,
        spell = 29,
        spell2 = 28,
        spell3 = 27,
        splash = 22,
        suspendedTown = 19,
        terrain = 16,
        waterWake = 31,
    }

    /**
     * Defines text colors and font styles for chat and tip messages
     */
    enum Color {
        AQUA = "§b",
        BEGIN = "§",
        BLACK = "§0",
        BLUE = "§9",
        BOLD = "§l",
        DARK_AQUA = "§3",
        DARK_BLUE = "§1",
        DARK_GRAY = "§8",
        DARK_GREEN = "§2",
        DARK_PURPLE = "§5",
        DARK_RED = "§4",
        GOLD = "§6",
        GRAY = "§7",
        GREEN = "§a",
        ITALIC = "§o",
        LIGHT_PURPLE = "§d",
        OBFUSCATED = "§k",
        RED = "§c",
        RESET = "§r",
        STRIKETHROUGH = "§m",
        UNDERLINE = "§n",
        WHITE = "§f",
        YELLOW = "§e",
    }

    /**
     * Defines all vanilla entity type ids
     */
    enum EntityType {
        AREA_EFFECT_CLOUD = 95,
        ARMOR_STAND = 61,
        ARROW = 80,
        BAT = 19,
        BLAZE = 43,
        BOAT = 90,
        CAT = 75,
        CAVE_SPIDER = 40,
        CHEST_MINECART = 98,
        CHICKEN = 10,
        COD = 112,
        COMMAND_BLOCK_MINECART = 100,
        COW = 11,
        CREEPER = 33,
        DOLPHIN = 31,
        DONKEY = 24,
        DRAGON_FIREBOLL = 79,
        DROWNED = 110,
        EGG = 82,
        ENDERMAN = 38,
        ENDERMITE = 55,
        ENDER_CRYSTAL = 71,
        ENDER_DRAGON = 53,
        ENDER_GUARDIAN = 50,
        ENDER_GUARDIAN_GHOST = 120,
        ENDER_PEARL = 87,
        EVOCATION_FANG = 103,
        EVOCATION_ILLAGER = 104,
        EXPERIENCE_ORB = 69,
        EXPERIENCE_POTION = 68,
        EYE_OF_ENDER_SIGNAL = 70,
        FALLING_BLOCK = 66,
        FIREBALL = 85,
        FIREWORKS_ROCKET = 72,
        FISHING_HOOK = 77,
        GHAST = 41,
        GUARDIAN = 49,
        HOPPER_MINECART = 96,
        HORSE = 23,
        HUSK = 47,
        IRON_GOLEM = 20,
        ITEM = 64,
        LAVA_SLIME = 42,
        LEASH_KNOT = 88,
        LIGHTNING_BOLT = 93,
        LINGERING_POTION = 101,
        LLAMA = 29,
        LLAMA_SPLIT = 102,
        MINECART = 84,
        MOVING_BLOCK = 67,
        MULE = 25,
        MUSHROOM_COW = 16,
        OCELOT = 22,
        PAINTING = 83,
        PANDA = 113,
        PARROT = 30,
        PHANTOM = 58,
        PIG = 12,
        PIG_ZOMBIE = 36,
        PILLAGER = 114,
        PLAYER = 1,
        POLAR_BEAR = 28,
        PRIMED_TNT = 65,
        PUFFERFISH = 108,
        RABBIT = 18,
        RAVAGER = 59,
        SALMON = 109,
        SHEEP = 13,
        SHIELD = 117,
        SHULKER = 54,
        SHULKER_BULLET = 76,
        SILVERFISH = 39,
        SKELETON = 34,
        SKELETON_HORSE = 26,
        SLIME = 37,
        SMALL_FIREBALL = 94,
        SNOWBALL = 81,
        SNOW_GOLEM = 21,
        SPIDER = 35,
        SQUID = 17,
        STRAY = 46,
        THROWN_POTION = 86,
        THROWN_TRIDENT = 73,
        TNT_COMMAND = 97,
        TROPICALFISH = 111,
        TURTLE = 74,
        VEX = 105,
        VILLAGER = 15,
        VILLAGER_V2 = 115,
        VINDICATOR = 57,
        WANDERING_TRADER = 118,
        WHITCH = 45,
        WHITHER = 52,
        WHITHER_SKELETON = 48,
        WHITHER_SKULL = 89,
        WHITHER_SKULL_DANGEROUS = 91,
        WOLF = 14,
        ZOMBIE = 32,
        ZOMBIE_HORSE = 27,
        ZOMBIE_VILLAGER = 44,
        ZOMBIE_VILLAGE_V2 = 116,
    }

    /**
     * Defines vanilla mob render types
     */
    enum MobRenderType {
        arrow = 25,
        bat = 10,
        blaze = 18,
        boat = 35,
        camera = 48,
        chicken = 5,
        cow = 6,
        creeper = 22,
        egg = 28,
        enderman = 24,
        expPotion = 45,
        experienceOrb = 40,
        fallingTile = 33,
        fireball = 37,
        fishHook = 26,
        ghast = 17,
        human = 3,
        ironGolem = 42,
        item = 4,
        lavaSlime = 16,
        lightningBolt = 41,
        map = 50,
        minecart = 34,
        mushroomCow = 7,
        ocelot = 43,
        painting = 32,
        pig = 8,
        player = 27,
        rabbit = 46,
        sheep = 9,
        silverfish = 21,
        skeleton = 19,
        slime = 23,
        smallFireball = 38,
        snowGolem = 44,
        snowball = 29,
        spider = 20,
        squid = 36,
        thrownPotion = 31,
        tnt = 2,
        unknownItem = 30,
        villager = 12,
        villagerZombie = 39,
        witch = 47,
        wolf = 11,
        zombie = 14,
        zombiePigman = 15,
    }

    /**
     * Defines vanilla potion effects
     */
    enum PotionEffect {
        absorption = 22,
        bad_omen = 28,
        blindness = 15,
        conduit_power = 26,
        confusion = 9,
        damageBoost = 5,
        damageResistance = 11,
        digSlowdown = 4,
        digSpeed = 3,
        fatal_poison = 25,
        fireResistance = 12,
        harm = 7,
        heal = 6,
        healthBoost = 21,
        hunger = 17,
        invisibility = 14,
        jump = 8,
        levitation = 24,
        movementSlowdown = 2,
        movementSpeed = 1,
        nightVision = 16,
        poison = 19,
        regeneration = 10,
        saturation = 23,
        slow_falling = 27,
        village_hero = 29,
        waterBreathing = 13,
        weakness = 18,
        wither = 20,
    }

    /**
     * Defines the three dimensions currently available for player 
     */
    enum Dimension {
        END = 2,
        NETHER = 1,
        NORMAL = 0,
    }

    /**
     * Defines item animation types
     */
    enum ItemAnimation {
        bow = 4,
        normal = 0,
    }

    /**
     * Defines numeric representation for each block side
     */
    enum BlockSide {
        DOWN = 0,
        EAST = 5,
        NORTH = 2,
        SOUTH = 3,
        UP = 1,
        WEST = 4,
    }

    /**
     * Defines numeric ids of all vanilla enchantments
     */
    enum Enchantment {
        AQUA_AFFINITY = 7,
        BANE_OF_ARTHROPODS = 11,
        BINDING_CURSE = 27,
        BLAST_PROTECTION = 3,
        CHANNELING = 32,
        DEPTH_STRIDER = 8,
        EFFICIENCY = 15,
        FEATHER_FALLING = 2,
        FIRE_ASPECT = 13,
        FIRE_PROTECTION = 1,
        FLAME = 21,
        FORTUNE = 18,
        FROST_WALKER = 25,
        IMPALING = 29,
        INFINITY = 22,
        KNOCKBACK = 12,
        LOOTING = 14,
        LOYALTY = 31,
        LUCK_OF_THE_SEA = 23,
        LURE = 24,
        MENDING = 26,
        POWER = 19,
        PROJECTILE_PROTECTION = 4,
        PROTECTION = 0,
        PUNCH = 20,
        RESPIRATION = 6,
        RIPTIDE = 30,
        SHARPNESS = 9,
        SILK_TOUCH = 16,
        SMITE = 10,
        THORNS = 5,
        UNBREAKING = 17,
        VANISHING_CURSE = 28,
    }

    /**
     * Defines what enchantments can or cannot be applied to every instrument 
     * type
     */
    enum EnchantType {
        all = 16383,
        axe = 512,
        book = 16383,
        boots = 4,
        bow = 32,
        chestplate = 8,
        fishingRod = 4096,
        flintAndSteel = 256,
        helmet = 1,
        hoe = 64,
        leggings = 2,
        pickaxe = 1024,
        shears = 128,
        shovel = 2048,
        weapon = 16,
    }

    /**
     * Defines possible render layers (display methods) for blocks
     */
    enum BlockRenderLayer {
        alpha = 4099,
        alpha_seasons = 5,
        alpha_single_side = 4,
        blend = 6,
        doubleside = 2,
        far = 9,
        opaque = 0,
        opaque_seasons = 1,
        seasons_far = 10,
        seasons_far_alpha = 11,
        water = 7,
    }

    /**
     * Defines possible game difficulty
     */
    enum GameDifficulty {
        PEACEFUL = 0,
        EASY = 1,
        NORMAL = 2,
        HARD = 3,
    }

    /**
     * Defines possible game modes
     */
    enum GameMode {
        SURVIVAL = 0,
        CREATIVE = 1,
        ADVENTURE = 2,
        SPECTATOR = 3,
    }

    /**
     * Defines player's abilities. See {@page Abilities} for details
     */
    enum PlayerAbility {
        INVULNERABLE = "invulnerable",
        FLYING = "flying",
        INSTABUILD = "instabuild",
        LIGHTNING = "lightning",
        FLYSPEED = "flySpeed",
        WALKSPEED = "walkSpeed",
        NOCLIP = "noclip",
        MAYFLY = "mayfly",
        WORLDBUILDER = "worldbuilder",
        MUTED = "mute",
        BUILD = "build",
        MINE = "mine",
        DOORS_AND_SWITCHES = "doorsandswitches",
        OPEN_CONTAINERS = "opencontainers",
        ATTACK_PLAYERS = "attackplayers",
        ATTACK_MOBS = "attackmobs",
        OPERATOR_COMMANDS = "op",
        TELEPORT = "teleport"
    }

    enum TileEntityType {
        NONE = -1,
        BEACON = 21,
        BREWING_STAND = 8,
        CAULDRON = 16,
        CHEST = 0,
        DISPENSER = 13,
        FURNACE = 1,
        HOPPER = 2,
        JUKEBOX = 33,
        LECTERN = 37
    }

    enum NbtDataType {
        END_TAG = 0,
        BYTE = 1,
        SHORT = 2,
        INT = 3,
        INT64 = 4,
        FLOAT = 5,
        DOUBLE = 6,
        BYTE_ARRAY = 7,
        STRING = 8,
        LIST = 9,
        COMPOUND = 10,
        INT_ARRAY = 11
    }
}

/**
 * Module to work with vanilla and custom particles
 */
declare namespace Particles {
    /**
     * Custom particle's animator params object
     */
    interface AnimatorDescription {
        /**
         * Animator's period in ticks, if it's less than zero or not listed,
         * it'll be particle's lifetime.
         */
        period?: number;
        /**
         * Appearance moment in the proportions of the period, default is 0
         */
        fadeIn?: number;
        /**
         * Disappearance moment in the proportions of the period, default is 0
         */
        fadeOut?: number;
        /**
         * Initial value, default is 0
         */
        start?: number;
        /**
         * Ending value, default is 0
         */
        end?: number;
    }
    /**
     * Custom particle's sub-emitter params object
     */
    interface SubEmitterDescription {
        /**
         * Emitted particle's type numeric id
         */
        type: number;
        /**
         * Additional data of the emitted particle, default is 0
         */
        data?: number;
        /**
         * Triggering chance from 0 to 1, default is 1
         */
        chance?: number;
        /**
         * Particles count for the single time, default is 1
         */
        count?: number;
        /**
         * If true, the new particle will have the velocity of the particle, 
         * that calls the sub-emitter, at the time of invocation, default is false
         */
        keepVelocity?: boolean;
        /**
         * If true, the new particle will save the emitter that was used for its creation if it had been.
         * Note: in this case we are talking about emitters, not about sub-emitters.
         */
        keepEmitter?: boolean;
        /**
         * If this value is listed, emitted particles will receive random initial speed,
         * that isn't more than value * sqrt(3)
         */
        randomize?: number;
    }
    /**
     * Custom particle type params object
     */
    interface ParticleDescription {
        /**
         * Particle's texture name from 'particle-atlas' resource directory
         */
        texture: string;
        /**
         * Minimum and maximum size of the particle
         */
        size: [number, number];
        /**
         * Minimum and maximum particle's lifetime in ticks
         */
        lifetime: [number, number];
        /**
         * Particle's render type:
         * 0 - additive,
         * 1 - without blending,
         * 2 - with blending.
         */
        render?: 0 | 1 | 2;
        /**
         * Four component color of the particle (RGBA), default is [1, 1, 1, 1]
         */
        color?: [number, number, number, number];
        /**
         * If true, particle won't go through blocks. It reduces performance if
         * there are lots of these particles, default is false.
         */
        collision?: boolean;
        /**
         * Particle's initial velocity, if it's spawned without initial speed parameter.
         * Default is [0, 0, 0]
         */
        velocity?: [number, number, number];
        /**
         * Particle's acceleration, if it's spawned without this parameter.
         * Default is [0, 0, 0]
         */
        acceleration?: [number, number, number];
        /**
         * Particle's speed modifier in the air and when touching a block.
         * Usually it's a number between 0 and 1, close to 1, but in fact it can be any value.
         * Both values are 1 by default.
         */
        friction?: {
            air?: number;
            /**
             * Note: this value makes sense only if collision param is true
             */
            block?: number;
        }
        /**
         * If false, particle's speed will be set to zero when touching a block.
         * If true, the speed will be saved. This value makes sense only if collision param is true
         */
        keepVelocityAfterImpact?: boolean;
        /**
         * Particle will lose given number of ticks from its maximum lifetime, when touching a block.
         * This value makes sense only if collision param is true. Default is 0
         */
        addLifetimeAfterImpact?: number;
        /**
         * If true, the particle will be exposed to the world's lighting.
         * If false, the particle will always have maximum brightness.
         * Enabling this parameter may reduce the performance when having lots of particles. Default is false.
         */
        isUsingBlockLight?: boolean;
        /**
         * Animators allow to change some properties of the specific particle depending on the time,
         * each animator is described as an object of definite format and can be not described, if it's not needed.
         */
        animators?: {
            /**
             * Describes the behaviour of particle's size, 
             * for the unit size the size from the type's description is taken.
             */
            size?: AnimatorDescription;
            /**
             * Describes the particle's opacity, for the unit value
             * the `alpha` in the `color` parameter from the type's description is taken.
             */
            alpha?: AnimatorDescription;
            /**
             * Describes the animation frame, if particle supports it.
             * Must have the value between 0 and 1
             * @deprecated use icon instead
             */
            texture?: AnimatorDescription;
            /**
             * Describes the animation frame, if particle supports it.
             * Must have the value between 0 and 1
             */
            icon?: AnimatorDescription;
        }
        /**
         * Sub-emitters (don't confuse with emitters) describe how specific particle can emit other particles,
         * according to some events, that may happen to it. Each sub-emitter is described as an object of definite format
         * and can be not described if it's not needed.
         */
        emitters?: {
            /**
             * Called every tick
             */
            idle?: SubEmitterDescription;
            /**
             * Called when touching a block, makes sense only if collision parameter is true
             */
            impact?: SubEmitterDescription;
            /**
             * Called at the end of particle's life
             */
            death?: SubEmitterDescription;
        }
    }
    /**
     * Spawns particle of given type on given coords 
     * with given velocity and additional parameters in the world.
     * Note: called only on the client side! Use packets to spawn particles for multiple players.
     * @param type particle type's numeric id. If you want to spawn vanilla particles,
     * see [[EParticleType]] and [[Native.ParticleType]] enums.
     * @param vx velocity for the particle by X-axis
     * @param vy velocity for the particle by Y-axis
     * @param vz velocity for the particle by Z-axis
     * @param data additional params, currently don't know how to use, just put 0
     */
    function addParticle(type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number): void;
    /**
     * Same as [[Particles.addParticle]], but applies 'far' shader to the particle
     */
    function addFarParticle(type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number): void;
    /**
     * Registers new custom particle type of given params object
     * @returns created particle type's numeric id
     */
    function registerParticleType(descriptor: ParticleDescription): number;
    /**
     * @returns [[Particles.ParticleType]] object of the particle by given id, if it exists
     */
    function getParticleTypeById(id: number): ParticleType;
    /**
     * Class to create custom particle types.
     * Mostly for internal use, you can use [[Particles.registerParticleType]] instead
     */
    class ParticleType {
        /**
         * Constructs new [[Particles.ParticleType]] object from given needed params
         */
        constructor(textureName: string, minU: number, minV: number, maxU: number, maxV: number, textureCountHorizontal: number, textureCountVertical: number, isUsingBlockLight: boolean);
        /**
         * Constructs new [[Particles.ParticleType]] object from given needed params
         * (unfinished documentation)
         */
        constructor(locationName: string, isUsingBlockLight: boolean, uv: number[], textureCountHorizontal: number, textureCountVertical: number);
        /**
         * Constructs new [[Particles.ParticleType]] object from given descriptor object
         */
        constructor(descriptor: ParticleDescription);
        /**
         * @returns following particle type's numeric id
         */
        getId(): number;
        setRenderType(renderType: 0 | 1 | 2): void;
        setRebuildDelay(delay: number): void;
        setColor(r: number, g: number, b: number, a: number): void;
        setColor(r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number, a2: number): void;
        setCollisionParams(collision: boolean, keepVelocityAfterImpact: boolean, addLifetimeAfterImpact: number): void;
        setFriction(air: number, block: number): void;
        setSize(min: number, max: number): void;
        setLifetime(min: number, max: number): void;
        setDefaultVelocity(x: number, y: number, z: number): void;
        setDefaultAcceleration(x: number, y: number, z: number): void;
        setSubEmitter(name: "idle" | "impact" | "death", emitter: ParticleSubEmitter): void;
        setAnimator(name: "size" | "icon" | "alpha" | "color", animator: ParticleAnimator): void;
    }
    /**
     * Particle emitter allows to change their position after spawn.
     * It represents a coordinate system, where created particles are located
     * and which you can move however you want.
     * Note: emitter can be moved only while being in world, 
     * and it works ONLY for custom particles, not for vanilla!
     */
    class ParticleEmitter {
        /**
         * Constructs new particle emitter with origin in given coords
         */
        constructor(x: number, y: number, z: number);
        /**
         * Moves the coordinate system to given coords,
         * it will cause all particles' transfer
         */
        move(x: number, y: number, z: number): void;
        /**
         * Moves the ORIGIN of the coordinate system to given coords,
         */
        moveTo(x: number, y: number, z: number): void;
        /**
         * Sets the speed of the coordinate system by each axis in blocks per tick,
         * it can be stopped with `emitter.stop()` or `emitter.setVelocity(0, 0, 0)`
         */
        setVelocity(x: number, y: number, z: number): void;
        /**
         * Binds the origin to the given entity's position,
         * resets the coordinate system's speed
         */
        attachTo(entity: number): void;
        /**
         * Same as `attachTo(entity)`, but adds x, y and z offset to entity's coords
         */
        attachTo(entity: number, x: number, y: number, z: number): void;
        /**
         * Detaches the coords system from the entity and leaves it on the current position
         */
        detach(): void;
        /**
         * Terminates any movement of the coordinate system
         */
        stop(): void;
        /**
         * Performs the finalization of the native object of the following emitter.
         * It means that you will no longer be able to use the following emitter after calling this method,
         * and the object itself will be removed from the memory.
         * Can be used for optimization purposes
         */
        release(): void;
        /**
         * @returns the origin's coords in [[Vector]] object
         */
        getPosition(): Vector;
        /**
         * @returns the origin's coords in float array of 3 elements
         */
        getPositionArray(): [number, number, number];
        /**
         * Default is false. It means that the coords of the particles for the following emitter
         * will be specified in the absolute coordinate system, if enabled, 
         * they will need to be set relative to the current position of the emitter. 
         * This can be very convenient if you need to make a system of particles completely isolated from the movement of the emitter.
         */
        setEmitRelatively(enable: boolean): void
        /**
         * Spawns particle of given and data on given coords, 
         * without specified velocity and acceleration.
         */
        emit(type: number, data: number, x: number, y: number, z: number): void;
        /**
         * Spawns particle of given and data on given coords, 
         * with specified velocity and without specified acceleration.
         */
        emit(type: number, data: number, x: number, y: number, z: number, vx: number, vy: number, vz: number): void;
        /**
         * Spawns particle of given and data on given coords, 
         * with specified velocity and acceleration.
         */
        emit(type: number, data: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, ax: number, ay: number, az: number): void;
    }
    /**
     * Animators allow to change some properties of the specific particle depending on the time.
     * Mostly for internal use, put animators' descriptors into `animators` parameter of custom particle type instead.
     */
    class ParticleAnimator {
        /**
         * Constructs new [[Particles.ParticleAnimator]] object from given needed params 
         */
        constructor(period: number, fadeInTime: number, fadeInValue: number, fadeOutTime: number, fadeOutValue: number);
        /**
         * Constructs new [[Particles.ParticleAnimator]] object from given descriptor object
         */
        constructor(descriptor: AnimatorDescription);
    }
    /**
     * Sub-emitters describe how specific particle can emit other particles,
     * according to some events, that may happen to it.
     * Mostly for internal use, put sub-emitters' descriptors into `emitters`
     */
    class ParticleSubEmitter {
        /**
         * Constructs new [[Particles.ParticleSubEmitter]] object from given needed params
         */
        constructor(chance: number, count: number, type: number, data: number);
        /**
         * Constructs new [[Particles.ParticleSubEmitter]] object from given descriptor object
         */
        constructor(descriptor: SubEmitterDescription);
        /**
         * Emitted particles will receive random initial speed
         */
        setRandomVelocity(maxRandomVelocity: number): void;
        /**
         * @param keepVelocity If true, the new particle will have the velocity of the particle, 
         * that calls the sub-emitter, at the time of invocation, default is false
         */
        setKeepVelocity(keepVelocity: boolean): void;
        /**
         * @param keepEmitter If true, the new particle will save the emitter that was used for its creation if it had been.
         * Note: in this case we are talking about emitters, not about sub-emitters.
         */
        setKeepEmitter(keepEmitter: boolean): void;
    }
}

/**
 * Module used to manipulate player. Player is also an entity in Minecraft, so 
 * you can use all the functions from [[Entity]] module as well. To get player's 
 * entity id, call [[Player.get]] function
 */
declare namespace Player {
    /**
     * @returns player's entity id that can be used with most of [[Entity]] 
     * function
     */
    function get(): number;

    /**
     * @deprecated No longer supported
     */
    function getNameForEnt(ent: number): string;

    /**
     * @deprecated No longer supported
     */
    function getName(): void;

    /**
     * @returns current dimension numeric id, one of the [[Native.Dimension]] 
     * values or custom dimension id
     */
    function getDimension(): number;

    /**
     * @returns true if specified entity is of player type, false otherwise
     */
    function isPlayer(ent: number): boolean;

    /**
     * Fetches information about the objects player is currently pointing
     */
    function getPointed():
    /**
     * @param pos pointed block position
     * @param vec look vector
     * @param block pointed block data, if player doesn't look at the block, air
     * block is returned ({id: 0, data: 0})
     * @param entity pointed entity, if no entity's pointed, returns -1
     */ { pos: BlockPosition, vec: Vector, block: Tile, entity: number };

    /**
     * @deprecated No longer supported
     */
    function getInventory(loadPart: any, handleEnchant: any, handleNames: any): void;

    /**
     * Adds items to player's inventory, stacking them if possible
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     * @param boolean if set to false, function drops items that could not be 
     * added to player's inventory, destroys them otherwise
     */
    function addItemToInventory(id: number, count: number, data: number, extra?: ItemExtraData, preventDrop?: boolean): void;

    /**
     * @param handleEnchant No longer supported and should not be passed
     * @param handleNames No longer supported and should not be passed
     * @returns item in player's hand 
     */
    function getCarriedItem(): ItemInstance;

    /**
     * Sets item in player's hand
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setCarriedItem(id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * Decreases carried item count by specified number
     * @param count amount of items to decrease carried item by, default value 
     * is 1
     */
    function decreaseCarriedItem(count?: number): void;

    /**
     * @param slot slot id, from 0 to 36
     * @returns information about item in the specified inventory slot
     */
    function getInventorySlot(slot: number): ItemInstance;

    /**
     * Sets contents of the specified inventory slot
     * @param slot slot id, from 0 to 36
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setInventorySlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * @param slot armor slot id, should be one of the [[Native.ArmorType]] 
     * values
     * @returns information about item in the specified armor slot
     */
    function getArmorSlot(slot: number): ItemInstance;

    /**
     * Sets contents of the specified armor slot
     * @param slot armor slot id, should be one of the [[Native.ArmorType]] 
     * values
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setArmorSlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * @returns currently selected inventory slot, from 0 to 8
     */
    function getSelectedSlotId(): number;

    /**
     * Selects currently selected inventory slot
     * @param slot slot id to be selected, from 0 to 8
     */
    function setSelectedSlotId(slot: number): void;

    /**
     * Sets specified coordinates as player's position
     */
    function setPosition(x: number, y: number, z: number): void;

    /**
     * @returns current player's position
     */
    function getPosition(): Vector;

    /**
     * Changes current player position by specified vector
     */
    function addPosition(x: number, y: number, z: number): void;

    /**
     * Set player's velocity using velocity vector
     * @param x velocity
     * @param y velocity
     * @param z velocity
     */
    function setVelocity(x: number, y: number, z: number): void;

    /**
     * Get player's velocity
     * @returns [[Vector]] containing player's velocity
     */
    function getVelocity(): Vector;

    /**
     * Updates current entity's velocity by specified values
     */
    function addVelocity(x: number, y: number, z: number): void;

    /**
     * @returns an object that allows to manipulate player experience
     * @deprecated Consider using [[Player.getExperience]], 
     * [[Player.setExperience]], [[Player.addExperience]]
     */
    function experience(): PlayerExperience;

    /**
     * @returns player's current experience
     */
    function getExperience(): number;

    /**
     * Sets player's experience
     * @param exp experience value to be set
     */
    function setExperience(exp: number): void;

    /**
     * Adds specified amount of experience to the current value
     * @param exp amount to be added
     */
    function addExperience(exp: number): void;

    /**
     * @returns an object that allows to manipulate player level
     * @deprecated Consider using [[Player.getLevel]], 
     * [[Player.setLevel]], [[Player.addLevel]]
     */
    function level(): PlayerLevel;

    /**
     * @returns player's current level
     */
    function getLevel(): number;

    /**
     * Sets player's level
     * @param level level value to be set
     */
    function setLevel(level: number): void;

    /**
     * Adds specified amount of level to the current value
     * @param level amount to be added
     */
    function addLevel(level: number): void;

    /**
     * @returns an object that allows to manipulate player flying ability and
     * state
     * @deprecated Consider using [[Player.getFlyingEnabled]], 
     * [[Player.setFlyingEnabled]], [[Player.getFlying]], [[Player.setFlying]]
     */
    function flying(): PlayerFlying;

    /**
     * @returns true if player is allowed to fly, false otherwise
     */
    function getFlyingEnabled(): boolean;

    /**
     * Enables or disables player's ability to fly
     * @param enabled whether the player can fly or not
     */
    function setFlyingEnabled(enabled: boolean): void;

    /**
     * @returns true if player is flying, false otherwise
     */
    function getFlying(): boolean;

    /**
     * Changes player's current flying state, call [[Player.setFlyingEnabled]]
     * to be able to set this property to true
     * @param enabled whether the player should fly or not
     */
    function setFlying(enabled: boolean): void;

    /**
     * @returns an object that allows to manipulate player's exhaustion
     * @deprecated Consider using [[Player.getExhaustion]] and
     * [[Player.setExhaustion]]
     */
    function exhaustion(): PlayerExhaustion;

    /**
     * @returns player's current exhaustion
     */
    function getExhaustion(): number;

    /**
     * Sets player's exhaustion
     * @param value exhaustion value to be set
     */
    function setExhaustion(value: number): void;

    /**
     * @returns an object that allows to manipulate player's exhaustion
     * @deprecated Consider using [[Player.getHunger]] and
     * [[Player.setHunger]]
     */
    function hunger(): PlayerHunger;

    /**
     * @returns player's current hunger
     */
    function getHunger(): number;

    /**
     * Sets player's hunger
     * @param value hunger value to be set
     */
    function setHunger(value: number): void;

    /**
     * @returns an object that allows to manipulate player's saturation
     * @deprecated Consider using [[Player.getSaturation]] and
     * [[Player.setSaturation]]
     */
    function saturation(): PlayerSaturation;

    /**
     * @returns player's current saturation
     */
    function getSaturation(): number;

    /**
     * Sets player's saturation
     * @param value saturation value to be set
     */
    function setSaturation(value: number): void;

    /**
     * @returns an object that allows to manipulate player's health
     * @deprecated Consider using [[Player.getHealth]] and
     * [[Player.setHealth]]
     */
    function health(): PlayerHealth;

    /**
     * @returns player's current health
     */
    function getHealth(): number;

    /**
     * Sets player's health
     * @param value health value to be set
     */
    function setHealth(value: number): void;

    /**
     * @returns an object that allows to manipulate player's score
     * @deprecated Consider using [[Player.getScore]]
     */
    function score(): PlayerScore;

    /**
     * @returns player's current score
     */
    function getScore(): number;

    /**
     * Sets view zoom, to reset value call [[Player.resetFov]]
     * @param fov view zoom, default zoom is about 70
     */
    function setFov(fov: number): void;

    /**
     * Resets view zoom to the default value
     */
    function resetFov(): void;

    /**
     * Sets player's camera to the specified entity
     * @param ent entity id
     */
    function setCameraEntity(ent: number): void;

    /**
     * Resets player's camera if it was previously set to another entity
     */
    function resetCameraEntity(): void;

    /**
     * Sets some of the player's {@page Abilities}. If the argument is of type 
     * Boolean, sets the ability as the boolean one, otherwise as numeric one
     * @param ability ability name constant, should be one of the 
     * [[Native.PlayerAbility]] constants
     * @param value the value to be set for the ability. Can be either boolean
     * or number, depending on the ability
     */
    function setAbility(ability: string, value: boolean | number): void;

    /**
     * Gets one of the player's {@page Abilities} in a form of floating-point 
     * number
     * @param ability ability name constant, should be one of the 
     * [[Native.PlayerAbility]] constants
     * @returns the current value of the ability in a form of floating-point
     * number
     */
    function getFloatAbility(ability: string): number;

    /**
     * Gets one of the player's {@page Abilities} in a boolean form 
     * @param ability ability name constant, should be one of the 
     * [[Native.PlayerAbility]] constants
     * @returns the current value of the ability in a boolean form 
     */
    function getBooleanAbility(ability: string): number;

    /**
     * Class used to manipulate player's experience
     * @deprecated Consider using [[Player.getExperience]], 
     * [[Player.setExperience]], [[Player.addExperience]]
     */
    class PlayerExperience {
        /**
         * @returns player's current experience
         */
        public get(): number;

        /**
         * Sets player's experience
         * @param exp experience value to be set
         */
        public set(exp: number): void;

        /**
         * Adds specified amount of experience to the current value
         * @param exp amount to be added
         */
        public add(exp: number): void;
    }

    /**
     * Class used to manipulate player's level
     * @deprecated Consider using [[Player.getLevel]], 
     * [[Player.setLevel]], [[Player.addLevel]]
     */
    class PlayerLevel {
        /**
         * @returns player's current level
         */
        public get(): number;

        /**
         * Sets player's level
         * @param level level value to be set
         */
        public set(level: number): void;

        /**
         * Adds specified amount of level to the current value
         * @param level amount to be added
         */
        public add(level: number): void;
    }

    /**
     * Class used to manipulate player's flying ability and state
     * @deprecated Consider using [[Player.getFlyingEnabled]], 
     * [[Player.setFlyingEnabled]], [[Player.getFlying]], [[Player.setFlying]]
     */
    class PlayerFlying {
        /**
         * @returns true if player is flying, false otherwise
         */
        public get(): boolean;

        /**
         * Changes player's current flying state, call 
         * [[Player.PlayerFlying.setEnabled]] to be able to set this property to 
         * true
         * @param enabled whether the player should fly or not
         */
        public set(enabled: boolean): void;

        /**
         * @returns true if player is allowed to fly, false otherwise
         */
        public getEnabled(): boolean;

        /**
         * Enables or disables player's ability to fly
         * @param enabled whether the player can fly or not
         */
        public setEnabled(enabled: boolean): void;
    }

    /**
     * Class used to manipulate player's exhaustion
     * @deprecated Consider using [[Player.getExhaustion]] and
     * [[Player.setExhaustion]]
     */
    class PlayerExhaustion {
        /**
         * @returns player's current exhaustion
         */
        public get(): number;

        /**
         * Sets player's exhaustion
         * @param value exhaustion value to be set
         */
        public set(value: number): void;
    }

    /**
     * Class used to manipulate player's hunger
     * @deprecated Consider using [[Player.getHunger]] and
     * [[Player.setHunger]]
     */
    class PlayerHunger {
        /**
         * @returns player's current hunger
         */
        public get(): number;

        /**
         * Sets player's hunger
         * @param value hunger value to be set
         */
        public set(value: number): void;
    }

    /**
     * Class used to manipulate player's saturation
     * @deprecated Consider using [[Player.getSaturation]] and
     * [[Player.setSaturation]]
     */
    class PlayerSaturation {
        /**
         * @returns player's current saturation
         */
        public get(): number;

        /**
         * Sets player's saturation
         * @param value saturation value to be set
         */
        public set(value: number): void;
    }

    /**
     * Class used to manipulate player's health
     * @deprecated Consider using [[Player.getHealth]] and
     * [[Player.setHealth]]
     */
    class PlayerHealth {
        /**
         * @returns player's current health
         */
        public get(): number;

        /**
         * Sets player's health
         * @param value health value to be set
         */
        public set(value: number): void;
    }

    /**
     * Class used to manipulate player's score
     * @deprecated Consider using [[Player.getScore]]
     */
    class PlayerScore {
        /**
         * @returns player's current score
         */
        public get(): number;
    }
}

/**
 * Class to manipulate with separate players.
 * It is temporary! It exists only 1 server tick!
 */
declare class PlayerActor {
    constructor(playerUid: number);

    /**
     * @returns player's unique numeric entity id
     */
    getUid(): number;

    /**
     * @returns the id of dimension where player is.
     */
    getDimension(): number;

    /**
     * @returns player's gamemode.
     */
    getGameMode(): number;

    /**
     * Adds item to player's inventory
     * @param dropRemaining if true, surplus will be dropped near player
     */
    addItemToInventory(id: number, count: number, data: number, extra: ItemExtraData | null, dropRemaining: boolean): void;

    /**
     * @returns inventory slot's contents.
     */
    getInventorySlot(slot: number): ItemInstance;

    /**
     * Sets inventory slot's contents.
     */
    setInventorySlot(slot: number, id: number, count: number, data: number, extra: ItemExtraData | null): void;

    /**
     * @returns armor slot's contents.
     */
    getArmor(slot: number): ItemInstance;

    /**
     * Sets armor slot's contents.
     */
    setArmor(slot: number, id: number, count: number, data: number, extra: ItemExtraData | null): void;

    /**
     * Sets respawn coords for the player.
     */
    setRespawnCoords(x: number, y: number, z: number): void;

    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    spawnExpOrbs(x: number, y: number, z: number, value: number): void;

    /**
     * @returns whether the player is a valid entity.
     */
    isValid(): boolean;

    /**
     * @returns player's selected slot.
     */
    getSelectedSlot(): number;

    /**
     * Sets player's selected slot.
     */
    setSelectedSlot(slot: number): void;

    /**
     * @returns player's experience.
     */
    getExperience(): number;

    /**
     * Sets player's experience.
     */
    setExperience(value: number): void;

    /**
     * Add experience to player.
     */
    addExperience(amount: number): void;

    /**
     * @returns player's xp level.
     */
    getLevel(): number;

    /**
     * Sets player's xp level.
     */
    setLevel(level: number): void;

    /**
     * @returns player's exhaustion.
     */
    getExhaustion(): number;

    /**
     * Sets player's exhaustion.
     */
    setExhaustion(value: number): void;

    /**
     * @returns player's hunger.
     */
    getHunger(): number;

    /**
     * Sets player's hunger.
     */
    setHunger(value: number): void;

    /**
     * @returns player's saturation.
     */
    getSaturation(): number;

    /**
     * Sets player's saturation.
     */
    setSaturation(value: number): void;

    /**
     * @returns player's score.
     */
    getScore(): number;

    /**
     * Sets player's score.
     */
    setScore(value: number): void;

    getItemUseDuration(): number;

    getItemUseIntervalProgress(): number;

    getItemUseStartupProgress(): number;

}

/**
 * Class that is used to give mobs, animations and blocks custom shape.
 */
declare class Render {
    isEmpty: boolean;
    isChangeable: boolean;
    renderer: Nullable<Render.Renderer>;
    model: Nullable<Render.Model>;
    parts: { [key: string]: Render.ModelPart };
    renderId: number;
    /**
     * Creates a new Render instance with specified parameters
     * @param parameters specifies all the 
     * properties of the object. If it is a number, vanilla render id is used,
     * if it is a string, used as [[RenderParameters.name]] name property
     */
    constructor(parameters?: Render.RenderParameters | string | number);
    /**
     * Specifies additional params for the following [[Render]]
     * @param params specifies all the 
     * properties of the object. If it is a number, vanilla render id is used,
     * if it is a string, used as [[RenderParameters.name]] name property
     */
    init(params?: Render.RenderParameters | string | number): void;
    initModel(): void;
    checkChangeable(): void;
    /** 
     * @deprecated use [[getId]] instead
     */
    getID(): number;
    /**
     * @returns render id that can be used to set render to the mob, animation 
     * or block
     */
    getId(): number;
    /**
     * @deprecated use [[getId]] instead
     */
    getRenderType(): number;
    /** 
     * @returns render's model that defines its visual shape. 
     */
    getModel(): Render.Model;
    /**
     * @returns [[Render.Transform]] object used to manipulate current render
     */
    transform(): Render.Transform;
    /** 
     * @returns a part of the render by its full name. By default, there are six 
     * parts available to the user. However, you can create your own parts that 
     * suit your needs and get them by their names.
     * @param partName full name of the part separated by "."
     * @returns part of the render with specified full name
     */
    getPart(partName: string): Render.ModelPart;
    /**
     * Adds a part to the render by its full name. The part should be descendent 
     * of one of the six default parts, see [[ModelPart]] for details.
     * @param partName full name of the part separated by "."
     * @param partParams specifies all the parameters of the part
     * @returns newly created part
     */
    addPart(partName: string, partParams?: Render.PartParameters): Render.ModelPart;
    /**
     * Sets all the properties of the part by its full name. 
     * @param partName full name of the part separated by "."
     * @param partParams specifies all the parameters of the part
     */
    setPartParams(partName: string, partParams?: Render.PartParameters): void;
    /**
     * Sets the content and all properties of the part by its full name.
     * @param name full name of the part separated by "."
     * @param data array of part data objects to be applied to the part
     * @param params specifies all the parameters of the part
     */
    setPart(name: string, data: Render.PartElement[], params: Render.PartParameters): void;
    _setPartRecursive(part: Render.ModelPart, data: Render.PartElement[], coords: Vector): void;
    localCache: Render.Cache | {};
    fromCache(data: Render.Cache): void;
    toCache(): Render.Cache;
    saveState(name: string, isLocal: boolean): void;
    loadState(name: string, isLocal: boolean): void;
    loadInitialState(name: string): void;
    saveToNext(name: string, isLocal: boolean): void;
    /**
     * @deprecated
     */
    setTextureResolution(...params: any): void;
}

declare namespace Render {
    /** 
     * An interface of the object that is used as [[Render.constructor]] parameter 
     * */
    interface RenderParameters {
        /** 
         * Name of the cached Render object to be used 
         */
        name?: string;
        /** 
         * Item ID for Item Sprite render type
         */
        item?: number;
        /** 
         * Relative path to the texture used by render 
         */
        skin?: string;
        /** 
         * Render scale multiplier 
         */
        scale?: number;
        /** 
         * If set to true, a humanoid render is constructed, empty otherwise 
         */
        raw?: boolean;
    }
    /**
     * Part's box description specified in [[Render.setPart]] method
     */
    interface PartElement {
        /**
         * Box coordinates, relative to part's coordinates
         */
        coords: Vector,
        /**
         * Box texture offset
         */
        uv?: { x: number, y: number },
        /**
         * Box size
         * @param w additional size to be added from all the six sizes of the
         * box
         */
        size: { x: number, y: number, z: number, w?: number },
        /**
         * Specifies child elements, using current box coordinates as base for the
         * child boxes
         */
        children?: PartElement[]
    }
    /**
     * Interface used to perform transformation on the specified render object
     */
    interface Transform extends com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        /**
         * Scales the render along all the three axes. Applicable only to the 
         * [[Animation]]'s transformations
         * @deprecated consider using [[Transform.scale]] instead
         * @returns reference to itself to be used in sequential calls
         */
        scaleLegacy(scale: number): Transform;
    }
    /** 
     * An interface of the object that is used as [[Render.addPart]] parameter
     */
    interface PartParameters {
        /**
         * If false or not specified in [[Render.setPart]] call, the part is 
         * cleared, otherwise new parts and params are applied to the existing parts 
         */
        add?: boolean,
        /**
         * Texture width, use the real texture file width or change it to stretch 
         * texture
         */
        width?: number,
        /**
         * Texture height, use the real texture file height or change it to stretch 
         * texture
         */
        height?: number,
        /**
         * Texture horizontal offset
         */
        u?: number,
        /**
         * Texture vertical offset
         */
        v?: number,
        /**
         * Part center position
         */
        pos?: Vector | [number, number, number];
        /**
         * Part rotation
         */
        rotation?: Vector | [number, number, number];
    }
    interface Model extends com.zhekasmirnov.innercore.api.NativeRenderer.Model {}
    interface ModelPart extends com.zhekasmirnov.innercore.api.NativeRenderer.ModelPart {}
    interface Renderer extends com.zhekasmirnov.innercore.api.NativeRenderer.Renderer {}
    interface Cache {
        renderer: Nullable<Renderer>,
        renderId: number,
        model: Nullable<Model>,
        isChangeable: boolean,
        parts: { [key: string]: ModelPart }
    }
}

/**
 * Module used to save data between world sessions
 */
declare namespace Saver {
    /**
     * Creates saves scope, a universal data storage container. This storage 
     * container should be used whenever you need to save some data between 
     * world sessions. If you want to store primitives, use an object to wrap 
     * them
     * 
     * Example:
     * ```ts
     * var thirst = 20;
     * Saver.addSavesScope("thirst", 
     *     function read(scope){
     *         thirst = scope? scope.thirst: 20;
     *     },
     *     
     *     function save(){
     *         return {"value": thirst};
     *     }
     * );
     * ```
     * @param name saves scope name
     * @param loadFunc function used to load saved data
     * @param saveFunc function used to save data
     */
    function addSavesScope(name: string, loadFunc: LoadScopeFunc, saveFunc: SaveScopeFunc): void;

    /**
     * Registers object as scope saver
     * @param name saves scope name
     * @param saver object that implements [[Saver.ScopeSaver]] interface and 
     * can be loaded and saved via its functions calls
     */
    function registerScopeSaver(name: string, saver: any): ScopeSaver;

    function registerObjectSaver(name: string, saver: any): void;

    function registerObject(obj: any, saverId: any): void;

    function setObjectIgnored(obj: any, ignore: any): void;

    /**
     * Function that returns object representing created scope. No 
     * primitives are allowed as return value
     */
    type SaveScopeFunc =
        /**
         * @returns saved data
         */
        () => object;

    /**
     * Function that loads data from scope
     */
    type LoadScopeFunc =
        /**
         * @param scope data 
         */
        (scope: Nullable<object>) => void;

    /**
     * Interface that should be implemented to pass the object as 
     * [[Saver.registerScopeSaver]] parameter
     */
    interface ScopeSaver {
        /**
         * Function used to load saved data
         */
        read: LoadScopeFunc,

        /**
         * Function used to save data
         */
        save: SaveScopeFunc
    }
}
declare class ShaderUniformSet {
    lock(): ShaderUniformSet;
    unlock(): ShaderUniformSet;
    setUniformValueArr(uniformSet: string, uniformName: string, value: number[]): ShaderUniformSet;
    setUniformValue(uniformSet: string, uniformName: string, ...value: number[]): ShaderUniformSet;
}

/**
 * Class representing texture that can be animated
 * @deprecated no longer supported and should not be used in new code
 */
declare class Texture {
    /**
     * Creates new [[Texture]] object using specified file path
     */
    constructor(path: string);

    /**
     * Sets texture file path
     * @returns reference to itself to be used in sequential calls
     */
    setTexture(path: string): Texture;

    /**
     * Specifies texture resolution. If not equal to file dimensions, the image
     * will be stretched to fit the resolution
     * @returns reference to itself to be used in sequential calls
     */
    setResolution(w: number, h: number): Texture;

    /**
     * Makes texture animated
     * @param animation array of paths to the animation frames. Each frame should
     * be stored in a separate file
     * @param delay specifies each frame delay in ticks
     * @returns reference to itself to be used in sequential calls
     */
    setAnimation(animation: string[], delay: number): Texture;

    /**
     * Resets animation
     * @returns reference to itself to be used in sequential calls
     */
    resetAnimation(token: number): Texture;

    /**
     * @returns current animation frame
     */
    getTexture(token: number): string;

    /**
     * @returns texture resolution after recalculating it with pixel scale
     */
    getResolution(): { w: number, h: number };

    /**
     * Sets pixel scale for the texture
     */
    setPixelScale(scale: number): Texture;
}
/**
 * Module used to create and manipulate threads. Threads let you execute 
 * time-consuming tasks without blocking current execution thread
 */
declare namespace Threading {
    /**
     * Function used to format error messages in a custom way
     */
    type ErrorMessageFormatFunction =
        /**
         * @param error java.lang.Throwable instance or javascript exception
         * @param priority current thread priority
         */
        (error: any, priority: number) => string;

    /**
     * Function used to create formatted error message with the full debug
     * information about exception in one of the threads. Usually called by Core 
     * Engine
     * @param error java.lang.Throwable instance or javascript exception
     * @param name thread name used to localize errors if there are any
     * @param priority current thread priority
     * @param formatFunc function that formats the exception itself
     */
    function formatFatalErrorMessage(error: any, name: string, priority: number, formatFunc: ErrorMessageFormatFunction): string;

    /**
     * Creates and runs new thread with specified function as a task
     * @param name thread name used to localize errors if there are any
     * @param func function that runs in the new thread. Usually it is some 
     * time-consuming task, that is executed in the new thread to avoid blocking
     * user interfaces
     * @param priority priority of the thread (integer value). The higher 
     * priority is, the quicker the task will be executed. Default value is 0
     * @param isErrorFatal if true, all errors in the thread are considered 
     * fatal and lead to fatal error AlertDialog, formatted with *formatFunc*
     * @param formatFunc function that formats exceptions in the thread to 
     * display in fatal error AlertDialog
     * @return java.lang.Thread instance representing created thread
     */
    function initThread(name: string, func: () => void, priority?: number, isErrorFatal?: boolean, formatFunc?: ErrorMessageFormatFunction): java.lang.Thread;

    /**
     * Gets thread by its name
     * @param name name of the thread
     * @return java.lang.Thread instance representing the thread
     */
    function getThread(name: string): java.lang.Thread;
}

/**
 * Module used to manage block and tools material and create tools with all
 * required properties
 */
declare namespace ToolAPI {

    /**
     * Creates new material with specified breaking speed multiplier. Some of 
     * the materials are already registered: 
     * 
     * *stone* - used for pickaxes
     * 
     * *wood* - used for axes
     * 
     * *dirt* - used for shovels
     * 
     * *plant* - used for all plants (no vanilla tool supports this material)
     * 
     * *fibre* - used for swords (to break web)
     * 
     * *cobweb* - currently not used
     * 
     * *unbreaking* - used for unbreaking blocks, liquids, end portal, etc.
     * 
     * @param name new (or existing) material name
     * @param breakingMultiplier multiplier used to calculate block breaking 
     * speed. 1 is a default value for dirt and 3 is a default value for stone
     */
    function addBlockMaterial(name: string, breakingMultiplier: number): void;

    /**
     * Creates new tool material with specified parameters. Some of the tool 
     * materials are already registered:
     * 
     * *wood* - used for wooden instruments
     * 
     * *stone* - used for stone instruments
     * 
     * *iron* - used for iron instruments
     * 
     * *golden* - used for golden instruments
     * 
     * *diamond* - used for diamond instruments
     * 
     * @param name new (or existing) material name
     * @param material parameters describing material properties
     */
    function addToolMaterial(name: string, material: ToolMaterial): void;

    /**
     * Registers item as a tool
     * @param id numeric item id
     * @param toolMaterial registered tool material name or tool material object
     * used to register the tool
     * @param blockMaterials block material names that can be broken by this 
     * instrument. For example, you can use *["stone"]* for the pickaxes
     * @param params additional tool parameters
     */
    function registerTool(id: number, toolMaterial: string | ToolMaterial, blockMaterials: string[], params?: ToolParams): void;

    /**
     * Registers item as a sword
     * @param id numeric item id
     * @param toolMaterial registered tool material name or tool material object
     * used to register the sword
     * @param params additional tool parameters
     */
    function registerSword(id: number, toolMaterial: string | ToolMaterial, params?: ToolParams): void;

    /**
     * Registers material and digging level for the specified block
     * @param uid numeric tile id
     * @param materialName material name
     * @param level block's digging level
     * @param isNative used to mark vanilla blocks data. Generally used within 
     * Core Engine code and should not be used within mods until you really 
     * know what you're doing
     */
    function registerBlockMaterial(uid: number, materialName: string, level?: number, isNative?: boolean): void;

    /**
     * Sets digging level for block. If digging level of tool is higher then 
     * block's one, the block is dropped
     * @param uid numeric tile id
     * @param level block's digging level
     */
    function registerBlockDiggingLevel(uid: number, level: number): void;

    /**
     * Registers material and digging level for the specified blocks
     * @param materialName material name
     * @param UIDs an array of numeric tiles ids 
     * @param isNative used to mark vanilla blocks data. Generally used within 
     * Core Engine code and should not be used within mods until you really 
     * know what you're doing
     */
    function registerBlockMaterialAsArray(materialName: string, UIDs: number[], isNative: boolean): void;

    /** 
     * @deprecated No longer supported
     */
    function refresh(): void;

    /**
     * @param blockID numeric tile id
     * @returns object containing ToolAPI block data or undefined if no block 
     * data was specified for this block
     */
    function getBlockData(blockID: number): BlockData | undefined;

    /**
     * @param blockID numeric tile id
     * @returns object containing block material information or null, if no 
     * block data was specified for this block
     */
    function getBlockMaterial(blockID: number): Nullable<BlockMaterial>;

    /**
     * @param blockID numeric tile id
     * @returns destroy level of the block with specified id or 0, if no block 
     * data was specified for this block
     */
    function getBlockDestroyLevel(blockID: number): number;

    /**
     * @param extra item extra instance, if not specified, method uses carried
     * item's extra
     * @returns enchant data object, containing enchants used for blocks
     * destroy speed calculations
     */
    function getEnchantExtraData(extra?: ItemExtraData): EnchantData;

    /**
     * Applies fortune drop modifier to the drop array
     * @param drop drop array containing number of the arrays
     * @param level enchantment level
     */
    function fortuneDropModifier(drop: ItemInstanceArray[], level: number): ItemInstanceArray[];

    /**
     * Calculates destroy time for the block that is being broken with specified
     * tool at the specified coords. Used mostly by Core Engine to apply break
     * time
     * @param ignoreNative if block and item are native items, and this 
     * parameter is set to true, all the calculations will still be performed
     */
    function getDestroyTimeViaTool(fullBlock: Tile, toolItem: ItemInstance, coords: Callback.ItemUseCoordinates, ignoreNative?: boolean): number;

    /**
     * @param itemID numeric item id
     * @returns tool information stored in slightly modified 
     * [[ToolAPI.ToolParams]] object or null if no tool data was specified
     */
    function getToolData(itemID: number): Nullable<ToolParams>;

    /**
     * @param itemID numeric item id
     * @returns tool's breaking level or 0 if no tool data was provided
     */
    function getToolLevel(itemID: number): number;

    /**
     * @param itemID numeric item id
     * @param blockID numeric tile id
     * @returns digging level if specified tool can mine specified block, 0 if
     * data for the tool or for the block was not specified or if specified tool
     * cannot mine specified block
     */
    function getToolLevelViaBlock(itemID: number, blockID: number): number;

    /**
     * @returns carried tool information stored in slightly modified 
     * [[ToolAPI.ToolParams]] object or null if no tool data was specified
     */
    function getCarriedToolData(): any;

    /**
     * @returns carried tool's breaking level or 0 if no tool data was provided
     */
    function getCarriedToolLevel(): number;

    /**
     * Resets ToolAPI engine state
     */
    function resetEngine(): void;

    /**
     * Spawns experience orbs on the specified coordinate
     * @param value amount of experience to spawn
     */
    function dropExpOrbs(x: number, y: number, z: number, value: number): void;

    /**
     * Spawns random amount of experience on the specified block coordinates
     * @param coords block coordinates
     * @param minVal minimum amount of orbs to be spawned
     * @param maxVal maximum amount of orbs to be spawned
     * @param modifier additional experiences, usually passed from 
     * [[ToolAPI.EnchantData.experience]] field
     */
    function dropOreExp(coords: Vector, minVal: number, maxVal: number, modifier: number): void;

    /**
     * @param blockID numeric tile id
     * @returns 
     */
    function getBlockMaterialName(blockID: number): Nullable<string>;

    /**
     * Object used to describe tool material type
     */
    interface ToolMaterial {
        /**
         * Divider used to calculate block breaking
         * speed. 2 is a default value for wooden instruments and 12 is a default 
         * value for golden instruments
         */
        efficiency?: number,

        /**
         * Additional damage for the instruments, this value
         * is added to the base tool damage. If damage is not integer, it is rounded
         * to the higher integer with the chance of the fractional part, e.g. if 
         * the value is *3.3*, the damage will be 4 with the chance of 30%
         */
        damage?: number,

        /**
         * Durability of the tool, 33 is a default value 
         * for golden tools and 1562 is a default value for diamond tools
         */
        durability?: number,

        /**
         * Block breaking level, 1 is wooden instruments, 4 is diamond 
         * instruments. If block's breaking level is less or equal to the tool's
         * level, block will be dropped when broken
         */
        level?: number
    }

    /**
     * Object used to describe block material
     */
    interface BlockMaterial {
        /**
         * Multiplier used to calculate block breaking speed
         */
        multiplier: number,

        /**
         * Block material name
         */
        name: string
    }

    /**
     * Object used to store all of the ToolAPI block data
     */
    interface BlockData {
        /**
         * Material data used for this block
         */
        material: BlockMaterial,

        /**
         * Digging level of the block. If digging level of tool is higher then 
         * block's one, the block is dropped
         */
        level: number,

        /**
         * Specifies whether the block was added as vanilla item or as a custom
         * block. True, if the block is vanilla, false if the block is custom. 
         * Should not generally be changed
         */
        isNative: boolean
    }

    /**
     * Object containing additional parameters and functions used by Core Engine 
     * to work with the tool
     */
    interface ToolParams {
        /**
         * Numeric id of the item that replaces tool item when it's broken. 
         * By default it is 0 (the tool disappears)
         */
        brokenId?: number,

        /**
         * Base damage of the instrument, is added to the material damage to 
         * calculate the tool's final damage. Default is 0
         */
        damage?: number,

		/**
		 * Properties of the tool material. Defined by [[ToolAPI.registerTool]]
		 */
		toolMaterial?: ToolMaterial,

		/**
		 * List of block material names that can be broken by this instrument.
		 * Defined by [[ToolAPI.registerTool]]
		 */
		blockMaterials?: {[key: string]: boolean}

        /**
         * Function used to recalculate block destroy time based on some custom 
         * logic
         * @param tool tool item
         * @param coords coordinates where the block is being broken
         * @param block the block that is being broken
         * @param timeData some time properties that can be used to calculate 
         * destroy time for the tool and block
         * @param timeData.base base destroy time of the block
         * @param timeData.devider tool material devider
         * @param timeData.modifier divider applied due to efficiency enchantment
         * @param defaultTime default block destroy time, calculated as 
         * *base / divider / modifier*
         * @param enchantData tool's enchant data
         */
        calcDestroyTime?: (tool: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, timeData: { base: number, devider: number, modifier: number }, defaultTime: number, enchantData?: EnchantData) => number,

        /**
         * If true, the tool is vanilla Minecraft tool. Generally used within 
         * Core Engine code and should not be used within mods until you really 
         * know what you're doing
         */
        isNative?: boolean,

        /**
         * Function that is called when the block is destroyed
         * @param item tool item
         * @param coords coordinates where the block is destroyed
         * @param block the block that is destroyed
         * @returns true if default damage should not be applied to the instrument,
         * false otherwise
         */
        onDestroy?: (item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number) => boolean,

        /**
         * Function that is called when players attacks some entity with the tool
         * @param item tool item
         * @param victim unique numeric id of the entity that is attacked
         * @returns true if default damage should not be applied to the instrument,
         * false otherwise
         */
        onAttack?: (item: ItemInstance, victim: number, attacker: number) => boolean,

        /**
         * If true, breaking blocks with this tool makes it break 2x faster,
         * otherwise attacking mobs breaks tool 2x faster
         */
        isWeapon?: boolean,

        /**
         * Function that is called when the instrument is broken
         * @param item tool item
         * @returns true if default breaking behavior (replacing by *brokenId* item) 
         * should not be applied 
         */
        onBroke?: (item: ItemInstance) => boolean,

        /**
         * Function that is used to change enchant data object before all the 
         * calculations. Can be used to add some enchantment properties, such as 
         * silk touch, efficiency, unbreaking or fortune
         * @param enchantData tool's enchant data
         * @param item tool item
         * @param coords coordinates where the block is being broken. Passed only if
         * the block is destroyed
         * @param block destroyed block data. Passed only if the block is destroyed
         */
        modifyEnchant?: (enchantData: EnchantData, item: ItemInstance, coords?: Callback.ItemUseCoordinates, block?: Tile) => void,

        /**
         * Function that is called when the block that has a destroy function is 
         * destroyed
         * @param coords coordinates where the block is destroyed
         * @param carried an item in player's hand
         * @param fullTile block that was destroyed
         * @param blockSource [[BlockSource]] object of the world where the block was destroyed
         * @param player entity uid of the player that destroyed the block
         */
        onMineBlock?: (coords: Callback.ItemUseCoordinates, carried: ItemInstance, fullTile: Tile, blockSource: BlockSource, player: number) => void,

		/**
         * Any other user-defined methods and properties
         */
		[key: string]: any
    }

    /**
     * Object containing some of the enchants that are used to calculate block 
     * destroy time
     */
    interface EnchantData {
        /**
         * If true, the item has Silk Touch enchantment
         */
        silk: boolean,

        /**
         * Specifies the level of Fortune enchantment, or 0 if the item doesn't
         * have this enchant
         */
        fortune: number,

        /**
         * Specifies the level of Efficiency enchantment, or 0 if the item 
         * doesn't have this enchant
         */
        efficiency: number,

        /**
         * Specifies the level of Unbreaking enchantment, or 0 if the item 
         * doesn't have this enchant
         */
        unbreaking: number,

        /**
         * Specifies the amount of additional experience that is dropped when 
         * player breaks block with specified item
         */
        experience: number
    }
}
/**
 * Module that can be used to localize mods
 * All default strings (e.g. item names, windows titles, etc.) in the mod should 
 * be in English. Add translations to these strings using
 * [[Translation.addTranslation]]. For items and blocks translations are applied 
 * automatically. For the other strings, use [[Translation.translate]]
 */
declare namespace Translation {
    /**
     * Adds translations for specified object in several languages
     * @param name default string in English or name key
     * @param localization object containing two-letter language codes as keys
     * and localized strings in the specified language as values
     */
    function addTranslation(name: string, localization: object): void;

    /**
     * Translates string from English to current game language (if available). 
     * Add translations via [[Translation.addTranslation]] to apply them 
     * @param name default string in English or name key
     * @returns string in the current game language or input string if 
     * translation is not available
     */
    function translate(name: string): string;

    /**
     * @returns two-letter language code for current game language
     */
    function getLanguage(): string;
}

/**
 * Module used to create and manage Updatables. Updatables provide the proper
 * way to manage objects that update their state every tick. Updatables may not 
 * be notified every tick, if there are too many, to avoid user interface 
 * freezes
 */
declare namespace Updatable {
    /**
     * Adds object to updatables list
     * @param obj object to be added to updatables list
     */
	function addUpdatable(obj: Updatable): any;
	
	/**
     * Adds object to updatables list
     * @param obj object to be added to updatables list
     */
    function addLocalUpdatable(obj: Updatable): any;

    /**
     * @returns java.util.ArrayList instance containing all defined 
     * [[Updatable]] objects
     */
    function getAll(): java.util.ArrayList<Updatable>;

    /**
     * @returns current thread tick number
     */
    function getSyncTime(): number;
}

/**
 * Updatable is an object that is notified every tick via its 
 * [[Updatable.update]] method call
 */
interface Updatable {
    /**
     * Called every tick
     */
    update: () => void;

    /**
     * Once true, the object will be removed from updatables list and will no 
     * longer receive update calls
     */
    remove?: boolean;

    /**
     * Any other user-defined properties
     */
    [key: string]: any;
}

/**
 * Numeric IDs of vanilla blocks in the inventory
 */
declare enum VanillaBlockID {
    element_117 = -128,
    element_115 = -126,
    element_114 = -125,
    element_113 = -124,
    element_111 = -122,
    element_110 = -121,
    element_116 = -127,
    element_109 = -120,
    element_106 = -117,
    element_105 = -116,
    element_101 = -112,
    element_103 = -114,
    element_99 = -110,
    element_97 = -108,
    tallgrass = 31,
    beacon = 138,
    element_79 = -90,
    nether_wart = 372,
    element_7 = -18,
    barrel = -203,
    element_57 = -68,
    element_55 = -66,
    element_102 = -113,
    element_10 = -21,
    skull = 397,
    brown_mushroom_block = 99,
    element_27 = -38,
    cake = 354,
    blast_furnace = -196,
    element_25 = -36,
    element_21 = -32,
    element_100 = -111,
    element_69 = -80,
    iron_door = 330,
    element_51 = -62,
    sapling = 6,
    element_108 = -119,
    wooden_door = 324,
    element_84 = -95,
    element_12 = -23,
    element_76 = -87,
    element_16 = -27,
    element_40 = -51,
    jungle_door = 429,
    element_19 = -30,
    carpet = 171,
    spruce_door = 427,
    colored_torch_bp = 204,
    element_90 = -101,
    cauldron = 380,
    element_78 = -89,
    element_50 = -61,
    element_74 = -85,
    element_81 = -92,
    coral_fan = -133,
    element_95 = -106,
    element_73 = -84,
    element_87 = -98,
    element_60 = -71,
    element_67 = -78,
    brewing_stand = 379,
    double_plant = 175,
    hopper = 410,
    element_20 = -31,
    element_32 = -43,
    piston = 33,
    element_118 = -129,
    element_53 = -64,
    sand = 12,
    dark_oak_door = 431,
    element_49 = -60,
    flower_pot = 390,
    log = 17,
    element_24 = -35,
    fletching_table = -201,
    wheat = 296,
    planks = 5,
    element_66 = -77,
    element_2 = -13,
    element_68 = -79,
    composter = -213,
    element_70 = -81,
    turtle_egg = -159,
    sandstone = 24,
    smithing_table = -202,
    acacia_door = 430,
    element_88 = -99,
    bell = -206,
    element_89 = -100,
    leaves2 = 161,
    fence = 85,
    element_112 = -123,
    element_64 = -75,
    element_34 = -45,
    element_30 = -41,
    element_98 = -109,
    element_44 = -55,
    element_45 = -56,
    undyed_shulker_box = 205,
    anvil = 145,
    colored_torch_rg = 202,
    element_58 = -69,
    element_11 = -22,
    element_15 = -26,
    element_1 = -12,
    dirt = 3,
    campfire = 720,
    element_31 = -42,
    wool = 35,
    stonebrick = 98,
    coral_block = -132,
    double_stone_slab = 44,
    element_38 = -49,
    element_42 = -53,
    stained_hardened_clay = 159,
    double_stone_slab2 = 182,
    element_77 = -88,
    element_104 = -115,
    double_stone_slab4 = -166,
    element_13 = -24,
    leaves = 18,
    element_5 = -16,
    red_sandstone = 179,
    monster_egg = 97,
    quartz_block = 155,
    lantern = -208,
    tnt = 46,
    beetroot = 457,
    sea_pickle = -156,
    yellow_flower = 37,
    red_flower = 38,
    waterlily = 111,
    sponge = 19,
    grindstone = -195,
    snow_layer = 78,
    element_17 = -28,
    element_28 = -39,
    purpur_block = 201,
    cobblestone_wall = 139,
    coral = -131,
    seagrass = -130,
    red_mushroom_block = 100,
    element_61 = -72,
    log2 = 162,
    element_26 = -37,
    end_portal_frame = 120,
    element_43 = -54,
    conduit = -157,
    prismarine = 168,
    wooden_slab = 158,
    sealantern = 169,
    concrete = 236,
    element_72 = -83,
    magma = 213,
    stained_glass = 241,
    shulker_box = 218,
    element_18 = -29,
    sticky_piston = 29,
    stained_glass_pane = 160,
    bamboo = -163,
    scaffolding = -165,
    smoker = -198,
    loom = -204,
    element_47 = -58,
    cartography_table = -200,
    wood = -212,
    element_71 = -82,
    element_107 = -118,
    frame = 389,
    chemistry_table = 238,
    kelp = 335,
    element_75 = -86,
    hard_stained_glass = 254,
    hard_stained_glass_pane = 191,
    element_4 = -15,
    element_3 = -14,
    element_6 = -17,
    stone = 1,
    element_8 = -19,
    element_9 = -20,
    element_14 = -25,
    element_22 = -33,
    element_23 = -34,
    element_29 = -40,
    air = -158,
    double_stone_slab3 = -162,
    element_33 = -44,
    element_35 = -46,
    element_37 = -48,
    element_39 = -50,
    element_41 = -52,
    bed = 355,
    birch_door = 428,
    element_46 = -57,
    element_48 = -59,
    coral_fan_dead = -134,
    element_52 = -63,
    element_54 = -65,
    element_0 = 36,
    element_56 = -67,
    element_59 = -70,
    element_62 = -73,
    element_63 = -74,
    element_80 = -91,
    reeds = 338,
    element_82 = -93,
    element_65 = -76,
    element_83 = -94,
    element_85 = -96,
    element_86 = -97,
    element_91 = -102,
    element_92 = -103,
    element_36 = -47,
    element_93 = -104,
    element_94 = -105,
    element_96 = -107,
    lit_blast_furnace = -214,
    jigsaw = -211,
    sweet_berry_bush = -207,
    lit_smoker = -199,
    lectern = -194,
    darkoak_wall_sign = -193,
    darkoak_standing_sign = -192,
    acacia_wall_sign = -191,
    acacia_standing_sign = -190,
    jungle_wall_sign = -189,
    birch_wall_sign = -187,
    birch_standing_sign = -186,
    spruce_wall_sign = -182,
    red_nether_brick_stairs = -184,
    smooth_stone = -183,
    spruce_standing_sign = -181,
    normal_stone_stairs = -180,
    mossy_cobblestone_stairs = -179,
    end_brick_stairs = -178,
    polished_diorite_stairs = -173,
    andesite_stairs = -171,
    diorite_stairs = -170,
    chorus_flower = 200,
    grass_path = 198,
    redstone_ore = 73,
    dark_oak_trapdoor = -147,
    chain_command_block = 189,
    acacia_fence_gate = 187,
    standing_banner = 176,
    jungle_trapdoor = -148,
    powered_repeater = 94,
    daylight_detector_inverted = 178,
    slime = 165,
    melon_stem = 105,
    netherrack = 87,
    double_wooden_slab = 157,
    quartz_stairs = 156,
    emerald_ore = 129,
    ender_chest = 130,
    smooth_red_sandstone_stairs = -176,
    stripped_oak_log = -10,
    powered_comparator = 150,
    quartz_ore = 153,
    light_weighted_pressure_plate = 147,
    smooth_quartz_stairs = -185,
    info_update2 = 249,
    carrots = 141,
    command_block = 137,
    jungle_stairs = 136,
    packed_ice = 174,
    birch_stairs = 135,
    tripwire = 132,
    gold_ore = 14,
    spruce_stairs = 134,
    dark_oak_stairs = 164,
    redstone_lamp = 123,
    purple_glazed_terracotta = 219,
    enchanting_table = 116,
    dragon_egg = 122,
    wall_banner = 177,
    nether_brick_fence = 113,
    snow = 80,
    mycelium = 110,
    fence_gate = 107,
    iron_trapdoor = 167,
    pumpkin_stem = 104,
    melon_block = 103,
    redstone_block = 152,
    iron_bars = 101,
    diamond_ore = 56,
    chorus_plant = 240,
    hardened_clay = 172,
    invisiblebedrock = 95,
    magenta_glazed_terracotta = 222,
    activator_rail = 126,
    torch = 50,
    stripped_jungle_log = -7,
    acacia_button = -140,
    deadbush = 32,
    repeating_command_block = 188,
    dropper = 125,
    heavy_weighted_pressure_plate = 148,
    iron_ore = 15,
    barrier = -161,
    glass_pane = 102,
    jukebox = 84,
    stripped_birch_log = -6,
    brown_mushroom = 39,
    brick_block = 45,
    wooden_pressure_plate = 72,
    cocoa = 127,
    redstone_torch = 76,
    nether_brick = 112,
    hay_block = 170,
    stonecutter = 245,
    potatoes = 142,
    noteblock = 25,
    mossy_stone_brick_stairs = -175,
    green_glazed_terracotta = 233,
    wall_sign = 68,
    vine = 106,
    portal = 90,
    unlit_redstone_torch = 75,
    dispenser = 23,
    water = 9,
    grass = 2,
    smooth_sandstone_stairs = -177,
    detector_rail = 28,
    end_stone = 121,
    spruce_trapdoor = -149,
    oak_stairs = 53,
    red_sandstone_stairs = 180,
    emerald_block = 133,
    lapis_ore = 21,
    stone_pressure_plate = 70,
    red_mushroom = 40,
    bookshelf = 47,
    crafting_table = 58,
    chest = 54,
    yellow_glazed_terracotta = 224,
    lava = 11,
    obsidian = 49,
    lit_furnace = 62,
    lit_redstone_lamp = 124,
    coal_ore = 16,
    gravel = 13,
    gold_block = 41,
    acacia_stairs = 163,
    iron_block = 42,
    acacia_pressure_plate = -150,
    glass = 20,
    golden_rail = 27,
    lit_pumpkin = 91,
    stone_brick_stairs = 109,
    redstone_wire = 55,
    rail = 66,
    mob_spawner = 52,
    dark_oak_pressure_plate = -152,
    diamond_block = 57,
    furnace = 61,
    standing_sign = 63,
    stone_stairs = 67,
    wooden_button = 143,
    pistonarmcollision = 34,
    coal_block = 173,
    ice = 79,
    soul_sand = 88,
    jungle_standing_sign = -188,
    brick_stairs = 108,
    lapis_block = 22,
    glowstone = 89,
    birch_trapdoor = -146,
    cactus = 81,
    gray_glazed_terracotta = 227,
    clay = 82,
    unpowered_comparator = 149,
    bedrock = 7,
    observer = 251,
    daylight_detector = 151,
    underwater_torch = 239,
    pumpkin = 86,
    ladder = 65,
    coral_fan_hang3 = -137,
    cyan_glazed_terracotta = 229,
    unpowered_repeater = 93,
    cobblestone = 4,
    red_nether_brick = 215,
    purpur_stairs = 203,
    trapdoor = 96,
    stone_button = 77,
    frosted_ice = 207,
    end_rod = 208,
    jungle_fence_gate = 185,
    end_gateway = 209,
    bone_block = 216,
    white_glazed_terracotta = 220,
    orange_glazed_terracotta = 221,
    flowing_water = 8,
    flowing_lava = 10,
    light_blue_glazed_terracotta = 223,
    carved_pumpkin = -155,
    lime_glazed_terracotta = 225,
    pink_glazed_terracotta = 226,
    blue_glazed_terracotta = 231,
    brown_glazed_terracotta = 232,
    red_glazed_terracotta = 234,
    web = 30,
    lever = 69,
    black_glazed_terracotta = 235,
    sandstone_stairs = 128,
    podzol = 243,
    stonecutter_block = -197,
    glowingobsidian = 246,
    dark_oak_fence_gate = 186,
    netherreactor = 247,
    info_update = 248,
    movingblock = 250,
    nether_brick_stairs = 114,
    structure_block = 252,
    reserved6 = 255,
    prismarine_stairs = -2,
    acacia_trapdoor = -145,
    dark_prismarine_stairs = -3,
    prismarine_bricks_stairs = -4,
    stripped_spruce_log = -5,
    stripped_dark_oak_log = -9,
    polished_granite_stairs = -172,
    tripwire_hook = 131,
    blue_ice = -11,
    fire = 51,
    dark_oak_button = -142,
    birch_button = -141,
    hard_glass_pane = 190,
    chemical_heat = 192,
    trapped_chest = 146,
    polished_andesite_stairs = -174,
    lava_cauldron = -210,
    hard_glass = 253,
    lit_redstone_ore = 74,
    bamboo_sapling = -164,
    farmland = 60,
    granite_stairs = -169,
    spruce_fence_gate = 183,
    nether_wart_block = 214,
    stripped_acacia_log = -8,
    silver_glazed_terracotta = 228,
    coral_fan_hang = -135,
    coral_fan_hang2 = -136,
    dried_kelp_block = -139,
    mossy_cobblestone = 48,
    birch_fence_gate = 184,
    jungle_button = -143,
    end_bricks = 206,
    spruce_button = -144,
    end_portal = 119,
    birch_pressure_plate = -151,
    jungle_pressure_plate = -153,
    spruce_pressure_plate = -154,
    bubble_column = -160,
    allow = -215,
    ancient_debris = -216,
    basalt = -217,
    bee_nest = -218,
    beehive = -219,
    blackstone = -220,
    blackstone_double_slab = -221,
    blackstone_slab = -222,
    blackstone_stairs = -223,
    blackstone_wall = -224,
    border_block = -225,
    camera = -226,
    chain = -227,
    chiseled_nether_bricks = -228,
    chiseled_polished_blackstone = -229,
    cracked_nether_bricks = -230,
    cracked_polished_blackstone_bricks = -231,
    crimson_button = -232,
    crimson_door = -233,
    crimson_double_slab = -234,
    crimson_fence = -235,
    crimson_fence_gate = -236,
    crimson_fungus = -237,
    crimson_hyphae = -238,
    crimson_nylium = -239,
    crimson_planks = -240,
    crimson_pressure_plate = -241,
    crimson_roots = -242,
    crimson_slab = -243,
    crimson_stairs = -244,
    crimson_standing_sign = -245,
    crimson_stem = -246,
    crimson_trapdoor = -247,
    crimson_wall_sign = -248,
    crying_obsidian = -249,
    deny = -250,
    gilded_blackstone = -251,
    honey_block = -252,
    honeycomb_block = -253,
    light_block = -254,
    lodestone = -255,
    nether_gold_ore = -256,
    nether_sprouts = -257,
    netherite_block = -258,
    polished_basalt = -259,
    polished_blackstone = -260,
    polished_blackstone_brick_double_slab = -261,
    polished_blackstone_brick_slab = -262,
    polished_blackstone_brick_stairs = -263,
    polished_blackstone_brick_wall = -264,
    polished_blackstone_bricks = -265,
    polished_blackstone_button = -266,
    polished_blackstone_double_slab = -267,
    polished_blackstone_pressure_plate = -268,
    polished_blackstone_slab = -269,
    polished_blackstone_stairs = -270,
    polished_blackstone_wall = -271,
    quartz_bricks = -272,
    respawn_anchor = -273,
    shroomlight = -274,
    soul_campfire = -275,
    soul_fire = -276,
    soul_lantern = -277,
    soul_soil = -278,
    soul_torch = -279,
    stickypistonarmcollision = -280,
    stripped_crimson_hyphae = -281,
    stripped_crimson_stem = -282,
    stripped_warped_hyphae = -283,
    stripped_warped_stem = -284,
    structure_void = -285,
    target = -286,
    twisting_vines = -287,
    unknown = -288,
    warped_button = -289,
    warped_door = -290,
    warped_double_slab = -291,
    warped_fence = -292,
    warped_fence_gate = -293,
    warped_fungus = -294,
    warped_hyphae = -295,
    warped_nylium = -296,
    warped_planks = -297,
    warped_pressure_plate = -298,
    warped_roots = -299,
    warped_slab = -300,
    warped_stairs = -301,
    warped_standing_sign = -302,
    warped_stem = -303,
    warped_trapdoor = -304,
    warped_wall_sign = -305,
    warped_wart_block = -306,
    weeping_vines = -307,
    wither_rose = -308
}

/**
 * Numeric IDs of vanilla items
 */
declare enum VanillaItemID {
    record_11 = 510,
    record_ward = 509,
    cooked_rabbit = 412,
    record_stal = 507,
    record_blocks = 502,
    hopper_minecart = 408,
    enchanted_book = 403,
    rabbit_hide = 415,
    iron_boots = 309,
    beetroot_soup = 459,
    fireball = 385,
    netherstar = 399,
    spawn_egg = 383,
    writable_book = 386,
    speckled_melon = 382,
    ender_eye = 381,
    glass_bottle = 374,
    quartz = 406,
    baked_potato = 393,
    potion = 373,
    ender_pearl = 368,
    record_cat = 501,
    shears = 359,
    map = 358,
    bone = 352,
    fishing_rod = 346,
    redstone = 331,
    slime_ball = 341,
    clay_ball = 337,
    horsearmorleather = 416,
    pumpkin_seeds = 361,
    experience_bottle = 384,
    brick = 336,
    boat = 333,
    minecart = 328,
    sign = 323,
    flint = 318,
    saddle = 329,
    iron_chestplate = 307,
    bread = 297,
    totem = 450,
    shield = 513,
    end_crystal = 426,
    iron_axe = 258,
    book = 340,
    armor_stand = 425,
    wooden_sword = 268,
    stick = 280,
    muttonraw = 423,
    flint_and_steel = 259,
    trident = 455,
    golden_leggings = 316,
    chainmail_boots = 305,
    netherbrick = 405,
    wooden_hoe = 290,
    melon_seeds = 362,
    gold_nugget = 371,
    chicken = 365,
    poisonous_potato = 394,
    emptymap = 395,
    wooden_pickaxe = 270,
    string = 287,
    clownfish = 461,
    golden_carrot = 396,
    paper = 339,
    potato = 392,
    comparator = 404,
    banner = 446,
    carrotonastick = 398,
    beetroot_seeds = 458,
    emerald = 388,
    rabbit = 411,
    ghast_tear = 370,
    appleenchanted = 466,
    dragon_breath = 437,
    bucket = 325,
    gunpowder = 289,
    mushroom_stew = 282,
    iron_pickaxe = 257,
    carrot = 391,
    chest_minecart = 342,
    record_chirp = 503,
    prismarine_crystals = 422,
    dye = 351,
    golden_apple = 322,
    diamond_sword = 276,
    chainmail_helmet = 302,
    record_far = 504,
    record_mall = 505,
    repeater = 356,
    pufferfish = 462,
    iron_ingot = 265,
    record_strad = 508,
    beef = 363,
    cooked_chicken = 366,
    iron_helmet = 306,
    muttoncooked = 424,
    leather_boots = 301,
    snowball = 332,
    cooked_salmon = 463,
    lead = 420,
    dried_kelp = 464,
    diamond_hoe = 293,
    sweet_berries = 477,
    cookie = 357,
    stone_pickaxe = 274,
    melon = 360,
    diamond_leggings = 312,
    record_13 = 500,
    wooden_shovel = 269,
    cooked_beef = 364,
    stone_hoe = 291,
    record_wait = 511,
    jungle_sign = 474,
    golden_chestplate = 315,
    rotten_flesh = 367,
    diamond = 264,
    horsearmoriron = 417,
    leather_leggings = 300,
    bow = 261,
    sugar = 353,
    leather = 334,
    rapid_fertilizer = 449,
    stone_shovel = 273,
    apple = 260,
    stone_axe = 275,
    rabbit_foot = 414,
    magma_cream = 378,
    porkchop = 319,
    diamond_axe = 279,
    fireworkscharge = 402,
    bowl = 281,
    blaze_powder = 377,
    clock = 347,
    gold_ingot = 266,
    golden_sword = 283,
    cooked_fish = 350,
    golden_hoe = 294,
    record_mellohi = 506,
    iron_leggings = 308,
    cooked_porkchop = 320,
    diamond_chestplate = 311,
    feather = 288,
    wooden_axe = 271,
    iron_hoe = 292,
    painting = 321,
    ice_bomb = 453,
    arrow = 262,
    stone_sword = 272,
    diamond_helmet = 310,
    iron_shovel = 256,
    diamond_pickaxe = 278,
    leather_chestplate = 299,
    salmon = 460,
    splash_potion = 438,
    written_book = 387,
    golden_shovel = 284,
    golden_helmet = 314,
    diamond_boots = 313,
    golden_boots = 317,
    prismarine_shard = 409,
    chorus_fruit = 432,
    chorus_fruit_popped = 433,
    iron_sword = 267,
    lingering_potion = 441,
    command_block_minecart = 443,
    elytra = 444,
    fish = 349,
    shulker_shell = 445,
    iron_nugget = 452,
    nautilus_shell = 465,
    darkoak_sign = 476,
    heart_of_the_sea = 467,
    turtle_shell_piece = 468,
    turtle_helmet = 469,
    phantom_membrane = 470,
    crossbow = 471,
    birch_sign = 473,
    fireworks = 401,
    acacia_sign = 475,
    wheat_seeds = 295,
    banner_pattern = 434,
    compound = 499,
    bleach = 451,
    balloon = 448,
    medicine = 447,
    name_tag = 421,
    sparkler = 442,
    golden_pickaxe = 285,
    glow_stick = 166,
    egg = 344,
    fermented_spider_eye = 376,
    real_double_stone_slab2 = 181,
    compass = 345,
    real_double_stone_slab3 = -167,
    real_double_stone_slab4 = -168,
    horsearmorgold = 418,
    spruce_sign = 472,
    concrete_powder = 237,
    horsearmordiamond = 419,
    tnt_minecart = 407,
    glowstone_dust = 348,
    leather_helmet = 298,
    pumpkin_pie = 400,
    chainmail_leggings = 304,
    rabbit_stew = 413,
    chainmail_chestplate = 303,
    blaze_rod = 369,
    diamond_shovel = 277,
    brewingstandblock = 117,
    coal = 263,
    spider_eye = 375,
    golden_axe = 286,
    real_double_stone_slab = 43,
    respawn_anchor = 721,
    ancient_debris = 722,
    warped_slab = 723,
    crimson_slab = 724,
    carved_pumpkin = 725,
    warped_roots = 726,
    flower_banner_pattern = 727,
    music_disc_blocks = 728,
    soul_campfire = 729,
    polished_blackstone_slab = 730,
    warped_door = 731,
    nether_sprouts = 732,
    netherite_scrap = 733,
    netherite_leggings = 734,
    netherite_shovel = 735,
    netherite_sword = 736,
    blackstone_slab = 737,
    netherite_ingot = 738,
    lodestone_compass = 739,
    light_gray_dye = 740,
    camera = 741,
    honey_bottle = 742,
    piglin_banner_pattern = 743,
    mojang_banner_pattern = 744,
    polished_blackstone_brick_slab = 745,
    field_masoned_banner_pattern = 746,
    creeper_banner_pattern = 747,
    brown_dye = 748,
    farmland = 749,
    light_block = 750,
    panda_spawn_egg = 751,
    crimson_sign = 752,
    scute = 753,
    totem_of_undying = 754,
    cooked_mutton = 755,
    mutton = 756,
    music_disc_11 = 757,
    music_disc_ward = 758,
    bordure_indented_banner_pattern = 759,
    music_disc_strad = 760,
    music_disc_mellohi = 761,
    music_disc_far = 762,
    music_disc_cat = 763,
    diamond_horse_armor = 764,
    music_disc_chirp = 765,
    carrot_on_a_stick = 766,
    iron_horse_armor = 767,
    warped_sign = 768,
    music_disc_stal = 769,
    suspicious_stew = 770,
    light_blue_dye = 771,
    leather_horse_armor = 772,
    green_dye = 773,
    firework_star = 774,
    sugar_cane = 775,
    nether_star = 776,
    netherite_helmet = 777,
    empty_map = 778,
    fire_charge = 779,
    zoglin_spawn_egg = 780,
    bee_spawn_egg = 781,
    ravager_spawn_egg = 782,
    pillager_spawn_egg = 783,
    cat_spawn_egg = 784,
    enderman_spawn_egg = 785,
    agent_spawn_egg = 786,
    phantom_spawn_egg = 787,
    turtle_spawn_egg = 788,
    dolphin_spawn_egg = 789,
    drowned_spawn_egg = 790,
    pufferfish_spawn_egg = 791,
    cod_spawn_egg = 792,
    polar_bear_spawn_egg = 793,
    shulker_spawn_egg = 794,
    donkey_spawn_egg = 795,
    cow_spawn_egg = 796,
    yellow_dye = 797,
    wither_skeleton_spawn_egg = 798,
    husk_spawn_egg = 799,
    stray_spawn_egg = 800,
    fox_spawn_egg = 801,
    salmon_spawn_egg = 802,
    guardian_spawn_egg = 803,
    endermite_spawn_egg = 804,
    cave_spider_spawn_egg = 805,
    blaze_spawn_egg = 806,
    ghast_spawn_egg = 807,
    witch_spawn_egg = 808,
    ocelot_spawn_egg = 809,
    zombie_pigman_spawn_egg = 810,
    squid_spawn_egg = 811,
    hoglin_spawn_egg = 812,
    bat_spawn_egg = 813,
    zombie_spawn_egg = 814,
    dark_oak_sign = 815,
    skeleton_spawn_egg = 816,
    netherite_pickaxe = 817,
    skull_banner_pattern = 818,
    parrot_spawn_egg = 819,
    mooshroom_spawn_egg = 820,
    wandering_trader_spawn_egg = 821,
    cod = 822,
    wolf_spawn_egg = 823,
    sheep_spawn_egg = 824,
    mule_spawn_egg = 825,
    netherite_boots = 826,
    chicken_spawn_egg = 827,
    tropical_fish = 828,
    glistering_melon_slice = 829,
    melon_slice = 830,
    music_disc_wait = 831,
    blue_dye = 832,
    filled_map = 833,
    lapis_lazuli = 834,
    ink_sac = 835,
    white_dye = 836,
    orange_dye = 837,
    magenta_dye = 838,
    gray_dye = 839,
    cyan_dye = 840,
    purple_dye = 841,
    red_dye = 842,
    netherite_block = 843,
    music_disc_13 = 844,
    black_dye = 845,
    crimson_door = 846,
    tropical_fish_spawn_egg = 847,
    villager_spawn_egg = 848,
    netherite_chestplate = 849,
    netherite_axe = 850,
    firework_rocket = 851,
    pink_dye = 852,
    cod_bucket = 853,
    pig_spawn_egg = 854,
    magma_cube_spawn_egg = 855,
    dark_oak_boat = 856,
    acacia_boat = 857,
    lava_bucket = 858,
    spruce_boat = 859,
    jungle_boat = 860,
    crying_obsidian = 861,
    tropical_fish_bucket = 862,
    salmon_bucket = 863,
    cocoa_beans = 864,
    silverfish_spawn_egg = 865,
    water_bucket = 866,
    enchanted_golden_apple = 867,
    creeper_spawn_egg = 868,
    lit_pumpkin = 869,
    popped_chorus_fruit = 870,
    zombie_horse_spawn_egg = 871,
    golden_horse_armor = 872,
    music_disc_pigstep = 873,
    bone_meal = 874,
    music_disc_mall = 875,
    evoker_spawn_egg = 876,
    piglin_brute_spawn_egg = 877,
    rabbit_spawn_egg = 878,
    llama_spawn_egg = 879,
    elder_guardian_spawn_egg = 880,
    crimson_roots = 881,
    oak_sign = 882,
    charcoal = 883,
    spider_spawn_egg = 884,
    lime_dye = 885,
    honeycomb = 886,
    npc_spawn_egg = 887,
    pufferfish_bucket = 888,
    vex_spawn_egg = 889,
    oak_boat = 890,
    chain = 891,
    skeleton_horse_spawn_egg = 892,
    birch_boat = 893,
    milk_bucket = 894,
    cooked_cod = 895,
    horse_spawn_egg = 896,
    slime_spawn_egg = 897,
    netherite_hoe = 898,
    zombie_villager_spawn_egg = 899,
    pumpkin = 900,
    strider_spawn_egg = 901,
    piglin_spawn_egg = 902,
    warped_fungus_on_a_stick = 903,
    vindicator_spawn_egg = 904
}

/**
 * Numeric IDs of vanilla blocks placed in the world
 */
declare enum VanillaTileID {
    lit_blast_furnace = 469,
    wood = 467,
    jigsaw = 466,
    sweet_berry_bush = 462,
    barrel = 458,
    smithing_table = 457,
    cartography_table = 455,
    lit_smoker = 454,
    smoker = 453,
    grindstone = 450,
    lectern = 449,
    darkoak_wall_sign = 448,
    darkoak_standing_sign = 447,
    acacia_wall_sign = 446,
    acacia_standing_sign = 445,
    jungle_wall_sign = 444,
    birch_wall_sign = 442,
    birch_standing_sign = 441,
    spruce_wall_sign = 437,
    red_nether_brick_stairs = 439,
    smooth_stone = 438,
    spruce_standing_sign = 436,
    normal_stone_stairs = 435,
    mossy_cobblestone_stairs = 434,
    bell = 461,
    end_brick_stairs = 433,
    polished_diorite_stairs = 428,
    andesite_stairs = 426,
    diorite_stairs = 425,
    stone_slab4 = 421,
    stone_slab3 = 417,
    undyed_shulker_box = 205,
    chorus_flower = 200,
    element_70 = 336,
    grass_path = 198,
    acacia_door = 196,
    dark_oak_door = 197,
    redstone_ore = 73,
    jungle_door = 195,
    dark_oak_trapdoor = 402,
    chain_command_block = 189,
    acacia_fence_gate = 187,
    standing_banner = 176,
    jungle_trapdoor = 403,
    element_88 = 354,
    stone_slab2 = 182,
    element_23 = 289,
    red_sandstone = 179,
    powered_repeater = 94,
    element_73 = 339,
    daylight_detector_inverted = 178,
    element_78 = 344,
    double_plant = 175,
    slime = 165,
    cobblestone_wall = 139,
    log2 = 162,
    element_26 = 292,
    stained_hardened_clay = 159,
    double_stone_slab2 = 181,
    melon_stem = 105,
    netherrack = 87,
    double_wooden_slab = 157,
    quartz_stairs = 156,
    emerald_ore = 129,
    ender_chest = 130,
    smooth_red_sandstone_stairs = 431,
    stripped_oak_log = 265,
    element_44 = 310,
    powered_comparator = 150,
    blast_furnace = 451,
    quartz_ore = 153,
    light_weighted_pressure_plate = 147,
    smooth_quartz_stairs = 440,
    skull = 144,
    brown_mushroom_block = 99,
    bamboo = 418,
    stained_glass_pane = 160,
    info_update2 = 249,
    carrots = 141,
    beacon = 138,
    monster_egg = 97,
    command_block = 137,
    log = 17,
    composter = 468,
    jungle_stairs = 136,
    packed_ice = 174,
    birch_stairs = 135,
    tripwire = 132,
    gold_ore = 14,
    element_45 = 311,
    flower_pot = 140,
    spruce_stairs = 134,
    dark_oak_stairs = 164,
    anvil = 145,
    redstone_lamp = 123,
    purple_glazed_terracotta = 219,
    concrete = 236,
    element_72 = 338,
    end_portal_frame = 120,
    element_43 = 309,
    cauldron = 118,
    brewing_stand = 117,
    enchanting_table = 116,
    spruce_door = 193,
    dragon_egg = 122,
    nether_wart = 115,
    element_7 = 273,
    wall_banner = 177,
    nether_brick_fence = 113,
    snow = 80,
    element_67 = 333,
    waterlily = 111,
    lantern = 463,
    quartz_block = 155,
    stone_slab = 44,
    mycelium = 110,
    conduit = 412,
    fence_gate = 107,
    iron_trapdoor = 167,
    element_95 = 361,
    pumpkin_stem = 104,
    element_94 = 360,
    melon_block = 103,
    element_57 = 323,
    red_mushroom_block = 100,
    element_61 = 327,
    stonebrick = 98,
    redstone_block = 152,
    iron_bars = 101,
    diamond_ore = 56,
    coral_block = 387,
    red_flower = 38,
    scaffolding = 420,
    chorus_plant = 240,
    wool = 35,
    hardened_clay = 172,
    invisiblebedrock = 95,
    magenta_glazed_terracotta = 222,
    activator_rail = 126,
    torch = 50,
    stripped_jungle_log = 262,
    element_21 = 287,
    acacia_button = 395,
    deadbush = 32,
    purpur_block = 201,
    repeating_command_block = 188,
    dropper = 125,
    prismarine = 168,
    heavy_weighted_pressure_plate = 148,
    sandstone = 24,
    element_11 = 277,
    iron_ore = 15,
    iron_door = 71,
    barrier = 416,
    element_51 = 317,
    glass_pane = 102,
    jukebox = 84,
    element_1 = 267,
    dirt = 3,
    stripped_birch_log = 261,
    brown_mushroom = 39,
    element_63 = 329,
    loom = 459,
    brick_block = 45,
    wooden_pressure_plate = 72,
    cocoa = 127,
    redstone_torch = 76,
    nether_brick = 112,
    hay_block = 170,
    stonecutter = 245,
    potatoes = 142,
    noteblock = 25,
    mossy_stone_brick_stairs = 430,
    green_glazed_terracotta = 233,
    tnt = 46,
    sealantern = 169,
    wooden_slab = 158,
    sand = 12,
    wall_sign = 68,
    vine = 106,
    portal = 90,
    sponge = 19,
    unlit_redstone_torch = 75,
    carpet = 171,
    dispenser = 23,
    water = 9,
    element_29 = 295,
    grass = 2,
    element_101 = 367,
    smooth_sandstone_stairs = 432,
    element_20 = 286,
    element_31 = 297,
    sapling = 6,
    detector_rail = 28,
    end_stone = 121,
    element_92 = 358,
    spruce_trapdoor = 404,
    sticky_piston = 29,
    oak_stairs = 53,
    red_sandstone_stairs = 180,
    element_75 = 341,
    emerald_block = 133,
    kelp = 393,
    lapis_ore = 21,
    element_66 = 332,
    stone_pressure_plate = 70,
    red_mushroom = 40,
    element_108 = 374,
    wooden_door = 64,
    bookshelf = 47,
    element_84 = 350,
    crafting_table = 58,
    chest = 54,
    yellow_glazed_terracotta = 224,
    lava = 11,
    obsidian = 49,
    stained_glass = 241,
    lit_furnace = 62,
    lit_redstone_lamp = 124,
    coal_ore = 16,
    gravel = 13,
    element_58 = 324,
    colored_torch_rg = 202,
    colored_torch_bp = 204,
    gold_block = 41,
    acacia_stairs = 163,
    piston = 33,
    iron_block = 42,
    acacia_pressure_plate = 405,
    glass = 20,
    golden_rail = 27,
    lit_pumpkin = 91,
    stone_brick_stairs = 109,
    tallgrass = 31,
    redstone_wire = 55,
    rail = 66,
    cake = 92,
    mob_spawner = 52,
    dark_oak_pressure_plate = 407,
    diamond_block = 57,
    element_71 = 337,
    wheat = 59,
    element_111 = 377,
    furnace = 61,
    standing_sign = 63,
    stone_stairs = 67,
    wooden_button = 143,
    element_105 = 371,
    pistonarmcollision = 34,
    double_stone_slab = 43,
    element_38 = 304,
    element_42 = 308,
    coal_block = 173,
    element_41 = 307,
    ice = 79,
    soul_sand = 88,
    jungle_standing_sign = 443,
    brick_stairs = 108,
    element_96 = 362,
    lapis_block = 22,
    shulker_box = 218,
    element_18 = 284,
    snow_layer = 78,
    glowstone = 89,
    element_17 = 283,
    leaves2 = 161,
    birch_trapdoor = 401,
    cactus = 81,
    gray_glazed_terracotta = 227,
    clay = 82,
    element_48 = 314,
    unpowered_comparator = 149,
    double_stone_slab3 = 422,
    air = 0,
    element_33 = 299,
    bedrock = 7,
    element_5 = 271,
    observer = 251,
    daylight_detector = 151,
    underwater_torch = 239,
    pumpkin = 86,
    ladder = 65,
    fence = 85,
    element_112 = 378,
    element_64 = 330,
    coral_fan_hang3 = 392,
    birch_door = 194,
    element_46 = 312,
    bed = 26,
    cyan_glazed_terracotta = 229,
    unpowered_repeater = 93,
    cobblestone = 4,
    red_nether_brick = 215,
    purpur_stairs = 203,
    trapdoor = 96,
    coral_fan = 388,
    stone_button = 77,
    frosted_ice = 207,
    end_rod = 208,
    jungle_fence_gate = 185,
    end_gateway = 209,
    magma = 213,
    coral = 386,
    bone_block = 216,
    white_glazed_terracotta = 220,
    element_28 = 294,
    orange_glazed_terracotta = 221,
    flowing_water = 8,
    flowing_lava = 10,
    element_14 = 280,
    light_blue_glazed_terracotta = 223,
    carved_pumpkin = 410,
    lime_glazed_terracotta = 225,
    element_2 = 268,
    pink_glazed_terracotta = 226,
    blue_glazed_terracotta = 231,
    brown_glazed_terracotta = 232,
    red_glazed_terracotta = 234,
    element_15 = 281,
    web = 30,
    lever = 69,
    black_glazed_terracotta = 235,
    sandstone_stairs = 128,
    concretepowder = 237,
    podzol = 243,
    element_90 = 356,
    turtle_egg = 414,
    stonecutter_block = 452,
    element_79 = 345,
    glowingobsidian = 246,
    dark_oak_fence_gate = 186,
    netherreactor = 247,
    info_update = 248,
    movingblock = 250,
    nether_brick_stairs = 114,
    structure_block = 252,
    leaves = 18,
    reserved6 = 255,
    prismarine_stairs = 257,
    acacia_trapdoor = 400,
    dark_prismarine_stairs = 258,
    prismarine_bricks_stairs = 259,
    element_86 = 352,
    element_118 = 384,
    stripped_spruce_log = 260,
    element_10 = 276,
    stripped_dark_oak_log = 264,
    polished_granite_stairs = 427,
    tripwire_hook = 131,
    element_53 = 319,
    blue_ice = 266,
    fire = 51,
    campfire = 464,
    dark_oak_button = 397,
    birch_button = 396,
    hard_stained_glass = 254,
    element_83 = 349,
    element_65 = 331,
    element_97 = 363,
    planks = 5,
    hard_glass_pane = 190,
    hard_stained_glass_pane = 191,
    chemical_heat = 192,
    element_16 = 282,
    element_49 = 315,
    element_3 = 269,
    element_4 = 270,
    trapped_chest = 146,
    element_6 = 272,
    stone = 1,
    element_8 = 274,
    element_9 = 275,
    element_12 = 278,
    element_76 = 342,
    polished_andesite_stairs = 429,
    element_13 = 279,
    element_113 = 379,
    element_19 = 285,
    lava_cauldron = 465,
    element_22 = 288,
    fletching_table = 456,
    element_24 = 290,
    element_25 = 291,
    hard_glass = 253,
    element_30 = 296,
    element_32 = 298,
    element_34 = 300,
    element_35 = 301,
    element_37 = 303,
    lit_redstone_ore = 74,
    element_39 = 305,
    element_40 = 306,
    element_47 = 313,
    bamboo_sapling = 419,
    element_50 = 316,
    farmland = 60,
    element_74 = 340,
    element_81 = 347,
    element_54 = 320,
    element_55 = 321,
    element_0 = 36,
    element_56 = 322,
    element_59 = 325,
    element_62 = 328,
    element_68 = 334,
    granite_stairs = 424,
    spruce_fence_gate = 183,
    element_77 = 343,
    element_80 = 346,
    reeds = 83,
    element_82 = 348,
    element_85 = 351,
    element_60 = 326,
    element_87 = 353,
    element_89 = 355,
    element_91 = 357,
    element_36 = 302,
    nether_wart_block = 214,
    element_93 = 359,
    element_98 = 364,
    element_99 = 365,
    element_103 = 369,
    element_69 = 335,
    element_100 = 366,
    element_102 = 368,
    double_stone_slab4 = 423,
    element_104 = 370,
    yellow_flower = 37,
    beetroot = 244,
    sea_pickle = 411,
    element_106 = 372,
    frame = 199,
    chemistry_table = 238,
    element_107 = 373,
    element_116 = 382,
    element_109 = 375,
    stripped_acacia_log = 263,
    element_110 = 376,
    element_114 = 380,
    element_115 = 381,
    silver_glazed_terracotta = 228,
    element_117 = 383,
    element_52 = 318,
    coral_fan_dead = 389,
    coral_fan_hang = 390,
    coral_fan_hang2 = 391,
    dried_kelp_block = 394,
    mossy_cobblestone = 48,
    seagrass = 385,
    birch_fence_gate = 184,
    jungle_button = 398,
    end_bricks = 206,
    spruce_button = 399,
    end_portal = 119,
    birch_pressure_plate = 406,
    hopper = 154,
    jungle_pressure_plate = 408,
    element_27 = 293,
    spruce_pressure_plate = 409,
    bubble_column = 415,
    allow = 470,
    ancient_debris = 471,
    basalt = 472,
    bee_nest = 473,
    beehive = 474,
    blackstone = 475,
    blackstone_double_slab = 476,
    blackstone_slab = 477,
    blackstone_stairs = 478,
    blackstone_wall = 479,
    border_block = 480,
    camera = 481,
    chain = 482,
    chiseled_nether_bricks = 483,
    chiseled_polished_blackstone = 484,
    cracked_nether_bricks = 485,
    cracked_polished_blackstone_bricks = 486,
    crimson_button = 487,
    crimson_door = 488,
    crimson_double_slab = 489,
    crimson_fence = 490,
    crimson_fence_gate = 491,
    crimson_fungus = 492,
    crimson_hyphae = 493,
    crimson_nylium = 494,
    crimson_planks = 495,
    crimson_pressure_plate = 496,
    crimson_roots = 497,
    crimson_slab = 498,
    crimson_stairs = 499,
    crimson_standing_sign = 500,
    crimson_stem = 501,
    crimson_trapdoor = 502,
    crimson_wall_sign = 503,
    crying_obsidian = 504,
    deny = 505,
    gilded_blackstone = 506,
    honey_block = 507,
    honeycomb_block = 508,
    light_block = 509,
    lodestone = 510,
    nether_gold_ore = 511,
    nether_sprouts = 512,
    netherite_block = 513,
    polished_basalt = 514,
    polished_blackstone = 515,
    polished_blackstone_brick_double_slab = 516,
    polished_blackstone_brick_slab = 517,
    polished_blackstone_brick_stairs = 518,
    polished_blackstone_brick_wall = 519,
    polished_blackstone_bricks = 520,
    polished_blackstone_button = 521,
    polished_blackstone_double_slab = 522,
    polished_blackstone_pressure_plate = 523,
    polished_blackstone_slab = 524,
    polished_blackstone_stairs = 525,
    polished_blackstone_wall = 526,
    quartz_bricks = 527,
    respawn_anchor = 528,
    shroomlight = 529,
    soul_campfire = 530,
    soul_fire = 531,
    soul_lantern = 532,
    soul_soil = 533,
    soul_torch = 534,
    stickypistonarmcollision = 535,
    stripped_crimson_hyphae = 536,
    stripped_crimson_stem = 537,
    stripped_warped_hyphae = 538,
    stripped_warped_stem = 539,
    structure_void = 540,
    target = 541,
    twisting_vines = 542,
    unknown = 543,
    warped_button = 544,
    warped_door = 545,
    warped_double_slab = 546,
    warped_fence = 547,
    warped_fence_gate = 548,
    warped_fungus = 549,
    warped_hyphae = 550,
    warped_nylium = 551,
    warped_planks = 552,
    warped_pressure_plate = 553,
    warped_roots = 554,
    warped_slab = 555,
    warped_stairs = 556,
    warped_standing_sign = 557,
    warped_stem = 558,
    warped_trapdoor = 559,
    warped_wall_sign = 560,
    warped_wart_block = 561,
    weeping_vines = 562,
    wither_rose = 563
}

/**
 * Module that allows to work with current Minecraft world
 * Most of the methods are out of date in multiplayer, use BlockSource instead
 */
declare namespace World {
    /**
     * Setups the module to work properly with the world. Usually called by 
     * Core Engine, so you generally shouldn't call it yourself
     * @param isLoaded whether the world is loaded or not
     */
    function setLoaded(isLoaded: boolean): boolean;

    /**
     * @returns whether the world is loaded or not
     */
    function isWorldLoaded(): boolean;

    /**
     * @returns current tick number since the player joined the world
     */
	function getThreadTime(): number;

	/**
	 * @param side number from 0 to 6 (exclusive)
     * @returns opposite side to argument
     */
    function getInverseBlockSide(side: number): number;

    /**
     * @param side block side
     * @returns normal vector for this side
     */
    function getVectorByBlockSide(side: number): Vector;

    /**
     * Retrieves coordinates relative to the block. For example, the following code
     * will return coordinates of the block above the specified:
     * ```ts
     * World.getRelativeCoords(x, y, z, Native.BlockSide.UP);
     * ```
     * @param side block side
     * @returns relative coordinates
     */
    function getRelativeCoords(x: number, y: number, z: number, side: number): Vector;

    /**
     * Sets block in the world using its tile id and data
     * @param id block tile id
     * @param data block data
     * @deprecated Consider using [[World.setBlock]] instead
     */
    function nativeSetBlock(x: number, y: number, z: number, id: number, data: number): void;

    /**
     * @returns tile id of the block located on the specified coordinates
     * @deprecated Consider using [[World.getBlockID]] instead
     */
    function nativeGetBlockID(x: number, y: number, z: number): number;

    /**
     * @returns data of the block located on the specified coordinates 
     * @deprecated Consider using [[World.getBlockData]] instead
     */
    function nativeGetBlockData(x: number, y: number, z: number): number;

    /**
     * Sets block in the world using its tile id and data
     * @param id block tile id
     * @param data block data
     */
    function setBlock(x: number, y: number, z: number, id: number, data: number): void;

    /**
     * Sets block in the world using specified [[Tile]] object
     * @param fullTile object containing id and data of the tile
     */
    function setFullBlock(x: number, y: number, z: number, fullTile: Tile): void;

    /**
     * @returns [[Tile]] object containing tile id and data of the block located 
     * on the specified coordinates
     */
    function getBlock(x: number, y: number, z: number): Tile;

    /**
     * @returns tile id of the block located on the specified coordinates
     */
    function getBlockID(x: number, y: number, z: number): number;

    /**
     * @returns data of the block located on the specified coordinates
     */
    function getBlockData(x: number, y: number, z: number): number;

    /**
     * Destroys block on the specified coordinates producing appropriate drop
     * and particles. Do not use for massive tasks due to particles being 
     * produced
     * @param drop whether to provide drop for the block or not
     */
    function destroyBlock(x: number, y: number, z: number, drop?: boolean): void;

    /**
     * @returns light level on the specified coordinates, from 0 to 15
     * @deprecated Out of date in multiplayer
     */
    function getLightLevel(x: number, y: number, z: number): number;

    /**
     * @param x chunk coordinate
     * @param z chunk coordinate
     * @returns whether the chunk with specified coordinates is loaded or not
     */
    function isChunkLoaded(x: number, z: number): boolean;

    /**
     * @param x block coordinate
     * @param y block coordinate
     * @param z block coordinate
     * @returns whether the chunk containing specified block coordinates is 
     * loaded or not
     */
    function isChunkLoadedAt(x: number, y: number, z: number): boolean;

    /**
     * @returns [[TileEntity]] located on the specified coordinates
     */
    function getTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;

    /**
     * If the block on the specified coordinates is a TileEntity block and is 
     * not initialized, initializes it and returns created [[TileEntity]] object
     * @returns [[TileEntity]] if one was created, null otherwise
     */
    function addTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;

    /**
     * If the block on the specified coordinates is a [[TileEntity]], destroys 
     * it, dropping its container
     * @returns true if the [[TileEntity]] was destroyed successfully, false 
     * otherwise
     */
    function removeTileEntity(x: number, y: number, z: number, region?: BlockSource): boolean;

    /**
     * @returns if the block on the specified coordinates is a [[TileEntity]], returns
     * its container, if the block is a [[NativeTileEntity]], returns it, if 
     * none of above, returns null
	 * @param region BlockSource
     */
    function getContainer(x: number, y: number, z: number, region?: BlockSource): Nullable<NativeTileEntity | UI.Container | ItemContainer>;

    /**
     * @returns current world's time in ticks 
     */
    function getWorldTime(): number;

    /**
     * Sets current world time
     * @param time time in ticks
     */
    function setWorldTime(time: number): number;

    /**
     * Sets current time to day or night
     * @param day if true, sets time to 10000 (day), else to 13000 (night)
     * @deprecated Consider using [[World.setWorldTime]] instead
     */
    function setDayMode(day: boolean): void;

    /**
     * Sets current time to day or night
     * @param day if true, sets time to 13000 (night), else to 10000 (day)
     * @deprecated Consider using [[World.setWorldTime]] instead
     */
    function setNightMode(night: boolean): void;

    /**
     * @returns current weather object. This value should not be edited, call 
     * [[World.setWeather]] to change current weather
     */
    function getWeather(): Weather;

    /**
     * Sets current weather in the world
     * @param weather [[Weather]] object to be used as current weather value
     */
    function setWeather(weather: Weather): void;

    /**
     * Drops item or block with specified id, count, data and extra on the
     * specified coordinates. For blocks, be sure to use block id, not the tile
     * id
     * @returns created drop entity id
     */
    function drop(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;

    /**
     * Creates an explosion on the specified coordinates
     * @param power defines how many blocks can the explosion destroy and what
     * blocks can or cannot be destroyed
     * @param fire if true, puts the crater on fire
     */
    function explode(x: number, y: number, z: number, power: number, fire: boolean): void;

    /**
     * @returns biome id on the specified coordinates
     */
    function getBiome(x: number, z: number): number;

    /**
     * @returns biome name on the specified coordinates
     * @deprecated This method will return "Unknown" for all the biomes
     */
    function getBiomeName(x: number, z: number): string;

    /**
     * @returns grass color for specified coordinates, uses android integer
     * color model
     */
    function getGrassColor(x: number, z: number): number;

    /**
     * Sets grass color on the specified coordinates, uses android integer color
     * model
     * @param color grass color to be set for the specified coordinates
     */
    function setGrassColor(x: number, z: number, color: number): void;

    /**
     * @returns grass color for specified coordinates, uses rgb color model
     */
    function getGrassColorRGB(x: number, z: number): Color;

    /**
     * Sets grass color on the specified coordinates, uses rgb color model
     * @param color grass color to be set for the specified coordinates
     */
    function setGrassColorRGB(x: number, z: number, rgb: Color): void;

    /**
     * @returns true, if one can see sky from the specified position, false 
     * otherwise
	 * @deprecated Out of date in multiplayer
     */
    function canSeeSky(x: number, y: number, z: number): boolean;

    /**
     * @returns true, if tile can be replaced (for example, grass and water can be replaced), false otherwise
     */
    function canTileBeReplaced(id: number, data: number): boolean;

    /**
     * Plays standart Minecraft sound on the specified coordinates
     * @param name sound name
     * @param volume sound volume from 0 to 1
     * @param pitch sound pitch, from 0 to 1, 0.5 is default value
     */
    function playSound(x: number, y: number, z: number, name: string, volume: number, pitch?: number): void;

    /**
     * Plays standart Minecraft sound from the specified entity
     * @param name sound name
     * @param volume sound volume from 0 to 1
     * @param pitch sound pitch, from 0 to 1, 0.5 is default value
     */
    function playSoundAtEntity(entity: number, name: string, volume: number, pitch?: number): void;

    /**
     * Enables "BlockChanged" event for the block id. Event occurs when either
     * old block or new block is registered using this method
     * @param id numeric tile id
     * @param enabled if true, the block will be watched
     */
    function setBlockChangeCallbackEnabled(id: number, enabled: boolean): void;

    /**
     * Enables "BlockChanged" event for specified block ids and registers 
     * callback function for the ids
     * @param ids string or numeric tile id, or an array of string and/or 
     * numeric tile ids
     * @param callback function that will be called when "BlockChanged" callback 
     * occurs involving one of the blocks. **Warning!** If both old and new 
     * blocks are in the ids list, callback function will be called twice.
     */
    function registerBlockChangeCallback(ids: number | string | (string | number)[], callback: Callback.BlockChangedFunction): void;

    /**
     * Gets biome on the specified coordinates when generating biome map. 
     * Should be called only in *GenerateBiomeMap* callback
     * @param x block x coordinate
     * @param z block y coordinate
     * @returns biome's numeric id
     */
    function getBiomeMap(x: number, z: number): number;

    /**
     * Sets biome on the specified coordinates when generating biome map. 
     * Should be called only in *GenerateBiomeMap* callback
     * @param x block x coordinate
     * @param z block y coordinate
     * @param id biome id to be set on the specified coordinates
     */
    function setBiomeMap(x: number, z: number, id: number): void;

    /**
     * Adds a new generation callback using string hash to generate a unique 
     * random seed for the chunk generator
     * @param callbackName one of the generation callbacks, see {@page Callbacks}
     * for details
     * @param callback callback function
     * @param uniqueHashStr if specified, will be used as string hash for seed
     * generation, otherwise default hash string will be used
     */
    function addGenerationCallback(callbackName: string, callback: Callback.GenerateChunkFunction, uniqueHashStr?: string): void;
}