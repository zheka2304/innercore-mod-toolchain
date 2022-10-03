/// <reference path="./android.d.ts"/>

/**
 * Type used to mark Java bytes
 */
type jbyte = number;

type Nullable<T> = T | null;

declare module com {
    export module zhekasmirnov {
        export module apparatus {
            export module api {
                export module container {
                    type PrimitiveTypes = string | number | boolean;
                    type PacketData = {[key: string]: PrimitiveTypes};
                    export namespace ItemContainerFuncs {
                        export interface BindingValidator {
                            (container: ItemContainer, str: string, obj: any, time: number): any;
                        }
                        export interface ClientEventListener {
                            (container: ItemContainer, window: innercore.api.mod.ui.window.IWindow, scriptable: any, obj: any): void;
                        }
                        export interface ClientOnCloseListener {
                            (container: ItemContainer): void;
                        }
                        export interface ClientOnOpenListener {
                            (container: ItemContainer, str: string): void;
                        }
                        export interface DirtySlotListener {
                            (container: ItemContainer, str: string, slot: ItemContainerSlot): void;
                        }
                        export interface ServerEventListener {
                            (container: ItemContainer, client: NetworkClient, obj: any): void;
                        }
                        export interface ServerOnCloseListener {
                            (container: ItemContainer, client: NetworkClient): void;
                        }
                        export interface ServerOnOpenListener {
                            (container: ItemContainer, client: NetworkClient, str: string): void;
                        }
                        export interface Transaction {
                            (container: ItemContainer, str: string): void;
                        }
                        export interface TransferPolicy {
                            (container: ItemContainer, str: string, id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>, time: number): number;
                        }
                        export interface UiScreenFactory {
                            (container: ItemContainer, screen: string): innercore.api.mod.ui.window.IWindow;
                        }
                    }
                    export class ItemContainer extends java.lang.Object implements innercore.api.mod.recipes.workbench.WorkbenchField {
                        static class: java.lang.Class<ItemContainer>;
                        readonly isServer: boolean;
                        readonly slots: {[key: string]: ItemContainerSlot};
                        readonly transactionLock: any;
                        static loadClass(): void;
                        static registerScreenFactory(factoryName: string, factory: ItemContainerFuncs.UiScreenFactory): void;
                        static addClientEventListener(typeName: string, packetName: string, listener: ItemContainerFuncs.ClientEventListener): void;
                        static addClientOpenListener(typeName: string, listener: ItemContainerFuncs.ClientOnOpenListener): void;
                        static addClientCloseListener(typeName: string, listener: ItemContainerFuncs.ClientOnCloseListener): void;
                        static getClientContainerInstance(name: string): Nullable<ItemContainer>;
                        /**
                         * Constructs a new [[ItemContainer]] object
                         */
                        constructor();
                        /**
                         * Constructs a new [[ItemContainer]] object from given deprecated [[innercore.api.mod.ui.container.Container]] object
                         */
                        constructor(legacyContainer: innercore.api.mod.ui.container.Container);
                        getNetworkEntity(): NetworkEntity;
                        getNetworkName(): string;
                        getUiAdapter(): ItemContainerUiHandler;
                        getWindow(): innercore.api.mod.ui.window.IWindow;
                        getWindowContent(): innercore.api.mod.ui.window.WindowContent;
                        removeEntity(): void;
                        /**
                         * Sets container's parent object, for [[TileEntity]]'s container it 
                         * should be a [[TileEntity]] reference, otherwise you can pass any 
                         * value to be used in your code later
                         * @param parent an object to be set as container's parent
                         */
                        setParent(parent: Nullable<TileEntity> | any): void;
                        /**
                         * @returns [[TileEntity]] if the following container is part of it,
                         * and null otherwise
                         */
                        getParent(): Nullable<TileEntity> | any;

                        setGlobalAddTransferPolicy(policy: ItemContainerFuncs.TransferPolicy): ItemContainer;
                        setGlobalGetTransferPolicy(policy: ItemContainerFuncs.TransferPolicy): ItemContainer;
                        setSlotAddTransferPolicy(slotName: string, policy: ItemContainerFuncs.TransferPolicy): ItemContainer;
                        setSlotGetTransferPolicy(slotName: string, policy: ItemContainerFuncs.TransferPolicy): ItemContainer;
                        setGlobalDirtySlotListener(listener: ItemContainerFuncs.DirtySlotListener): ItemContainer;
                        setDirtySlotListener(listener: ItemContainerFuncs.DirtySlotListener): void;
                        sealSlot(slotName: string): void;
                        sealAllSlots(): void;
                        getAddTransferPolicy(slot: string): ItemContainerFuncs.TransferPolicy;
                        getGetTransferPolicy(slot: string): ItemContainerFuncs.TransferPolicy;
                        setGlobalBindingValidator(validator: ItemContainerFuncs.BindingValidator): void;
                        setBindingValidator(composedBindingName: string, validator: ItemContainerFuncs.BindingValidator): void;
                        getBindingValidator(composedBindingName: string): ItemContainerFuncs.BindingValidator;
                        runTransaction(transaction: ItemContainerFuncs.Transaction): void;
                        /**
                         * Gets the slot by its name. If a slot with specified name doesn't 
                         * exists, creates an empty one with specified name
                         * @param name slot name
                         * @returns contents of the slot in a [[ItemContainerSlot]] object.
                         * You can modify it to change the contents of the slot
                         */
                        getSlot(name: string): ItemContainerSlot;
                        /** @deprecated */ getFullSlot(name: string): ItemContainerSlot;
                        markSlotDirty(name: string): void;
                        markAllSlotsDirty(): void;
                        /**
                         * Sets slot's content by its name from given slot object. If a slot with specified
                         * name doesn't exist, a new slot with specified name and item will be created.
                         * @param name slot name
                         * @param slot [[ItemContainerSlot]] object to specify slot contents
                         */
                        setSlot(name: string, slot: ItemContainerSlot): void;
                        /**
                         * Set slot's content by its name. If a slot with specified name doesn't 
                         * exists, creates new with specified name and item
                         * @param name slot name
                         * @param extra item extra data.
                         */
                        setSlot(name: string, id: number, count: number, data: number): void;
                        setSlot(name: string, id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>): void;
                        addToSlot(name: string, id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>, player: number): number;
                        getFromSlot(name: string, id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>, player: number): number;
                        /**
                         * Sends changes in container to all clients.
                         * Needs to be used every time when something changes in container.
                         */
                        sendChanges(): void;
                        dropAt(region: BlockSource, x: number, y: number, z: number): void;
                        /**
                         * Validates all the slots in the container
                         */
                        validateAll(): void;
                        /**
                         * Validates slot contents. If the data value is less then 0, it becomes
                         * 0, if id is 0 or count is less then or equals to zero, slot is reset 
                         * to an empty one
                         * @param name slot name
                         */
                        validateSlot(name: string): void;
                        /**
                         * Clears slot's contents
                         * @param name slot name
                         */
                        clearSlot(name: string): void;
                        /**
                         * Drops slot's contents on the specified coordinates and clears the 
                         * slot
                         * @param name slot name
                         */
                        dropSlot(region: BlockSource, name: string, x: number, y: number, z: number): void;
                        /**
                         * Sends event to move specified amount of items from the player inventory slot by given index
                         * to container slot by given name. This event is sent from client to server,
                         * so you should use it only on the client side, for example, in custom slot element touch events etc.
                         * @param inventorySlot numeric index of the inventory slot, from where to retrieve the item
                         * @param slotName string name of the container slot, where to put taken item
                         * @param amount item count to be retrieved from inventory slot
                         * @clientside
                         */
                        sendInventoryToSlotTransaction(inventorySlot: number, slotName: string, amount: number): void;
                        handleInventoryToSlotTransaction(player: number, inventorySlot: number, slotName: string, amount: number): void;
                        /**
                         * Sends event to move specified amount of items from one container slot to another by given names.
                         * This event is sent from client to server, so you should use it only on the client side,
                         * for example, in custom slot element touch events etc.
                         * @param slot1 string name of the container slot, from where to retrieve item
                         * @param slot2 string name of the container slot, where to put taken item
                         * @param amount item count to be retrieved from container slot
                         * @clientside
                         */
                        sendSlotToSlotTransaction(slot1: string, slot2: string, amount: number): void;
                        handleSlotToSlotTransaction(player: number, slot1: string, slot2: string, amount: number): void;
                        /**
                         * Sends event to move specified amount of items from the container slot by given name
                         * to player's inventory. The index of the inventory slot, where to put item, can't be specified,
                         * because it's decided by [[ItemContainer]] automatically, and you just don't need to do this.
                         * This event is sent from client to server, so you should use it only on the client side,
                         * for example, in custom slot element touch events etc.
                         * @param slot string name of the container slot, from where to retrieve item
                         * @param amount item count to be retrieved from container slot
                         * @clientside
                         */
                        sendSlotToInventoryTransaction(slot: string, amount: number): void;
                        handleSlotToInventoryTransaction(player: number, slotName: string, inventorySlot: number, amount: number): void;
                        sendDirtyClientBinding(key: string, value: PrimitiveTypes): void;
                        handleDirtyBindingsPacket(client: NetworkClient, packet: org.json.JSONObject): void;
                        setBinding(composedBindingName: string, value: PrimitiveTypes): void;
                        setClientBinding(composedBindingName: string, value: PrimitiveTypes): void;
                        getBinding(composedBindingName: string): PrimitiveTypes;
                        setBinding(elementName: string, bindingName: string, value: PrimitiveTypes): void;
                        setClientBinding(elementName: string, bindingName: string, value: PrimitiveTypes): void;
                        getBinding(elementName: string, bindingName: string): PrimitiveTypes;
                        /**
                         * Sets "value" binding value for the element. Used to set scales values
                         * @param elementName element name
                         * @param value value to be set for the element
                         */
                        setScale(elementName: string, value: number): void;
                        setClientScale(elementName: string, value: number): void;
                        /**
                         * @param elementName element name
                         * @returns "value" binding value, e.g. scale value, or null if no 
                         * element with specified name exist
                         */
                        getValue(elementName: string, value: number): Nullable<number>;
                        /**
                         * Sets "text" binding value for the element. Used to set element's text
                         * @param elementName element name
                         * @param text value to be set for the element
                         */
                        setText(elementName: string, text: string | number): void;
                        setClientText(elementName: string, text: string): void;
                        /**
                         * @param elementName element name
                         * @returns "text" binding value, usually the text displayed on the 
                         * element, or null if no element with specified name exist
                         */
                        getText(elementName: string): Nullable<string>;
                        setClientContainerTypeName(type: string): void;
                        getClientContainerTypeName(): string;
                        addServerEventListener(name: string, listener: ItemContainerFuncs.ServerEventListener): void;
                        addServerOpenListener(listener: ItemContainerFuncs.ServerOnOpenListener): void;
                        addServerCloseListener(listener: ItemContainerFuncs.ServerOnCloseListener): void;
                        /**
                         * Sends packet from client container copy to server.
                         */
                        sendEvent(name: string, data: PacketData | string): void;
                        /**
                         * Sends packet from server container copy to client.
                         */
                        sendEvent(client: NetworkClient, name: string, data: PacketData | string): void;
                        /**
                         * Sends packet from server container. 
                         * ONLY AVAILABLE IN SERVER CONTAINER EVENTS
                         */
                        sendResponseEvent(name: string, data: PacketData | string): void;
                        /**
                         * Opens UI for client
                         * @param client client in which UI will be open
                         * @param screenName name of the screen to open
                         */
                        openFor(client: NetworkClient, screenName: string): void;
                        /**
                         * Closes UI for client
                         * @param client client in which UI will be open
                         */
                        closeFor(client: NetworkClient): void;
                        /**
                         * Closes UI for all clients
                         */
                        close(): void;
                        sendClosed(): void;
                        setGlobalSlotSavingEnabled(enabled: boolean): void;
                        isGlobalSlotSavingEnabled(): boolean;
                        setSlotSavingEnabled(name: string, enabled: boolean): void;
                        resetSlotSavingEnabled(name: string): void;
                        isSlotSavingEnabled(name: string): boolean;
                        /**
                         * @returns false if container supports multiplayer, true otherwise.
                         * For [[ItemContainer]], it returns false
                         */
                        isLegacyContainer(): false;
                        asLegacyContainer(allSlots: boolean): innercore.api.mod.ui.container.Container;
                        asLegacyContainer(): innercore.api.mod.ui.container.Container;
                        setWorkbenchFieldPrefix(prefix: string): void;
                        getFieldSlot(index: number): innercore.api.mod.ui.container.AbstractSlot;
                        asScriptableField(): innercore.api.mod.ui.container.AbstractSlot[];
                    }
                    export class ItemContainerSlot extends java.lang.Object implements innercore.api.mod.ui.container.AbstractSlot {
                        static class: java.lang.Class<ItemContainerSlot>;
                        count: number;
                        data: number;
                        extra: Nullable<innercore.api.NativeItemInstanceExtra>;
                        id: number;
                        constructor(id: number, count: number, data: number);
                        constructor(id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>);
                        constructor();
                        constructor(item: ItemInstance);
                        constructor(json: org.json.JSONObject, convert: boolean);
                        /**
                         * @returns slot name
                         */
                        getName(): string;
                        /**
                         * @returns container linked to the slot
                         */
                        getContainer(): ItemContainer;
                        /**
                         * @returns following [[ItemContainerSlot]] as [[ItemInstance]] object
                         */
                        asScriptable(): ItemInstance;
                        /**
                         * @returns following [[ItemContainerSlot]] as [[org.json.JSONObject]] instance
                         */
                        asJson(): org.json.JSONObject;
                        /**
                         * @returns whether the slot is empty or not
                         */
                        isEmpty(): boolean;
                        /**
                         * Refreshes slot in UI
                         */
                        markDirty(): void;
                        /**
                         * Clears slot contents
                         */
                        clear(): void;
                        /**
                         * Resets slot if its id or count equals 0
                         */
                        validate(): void;
                        /**
                         * Drops slot contents in given world at given coords
                         */
                        dropAt(region: BlockSource, x: number, y: number, z: number): void;
                        /**
                         * Sets slot contents 
                         */
                        setSlot(id: number, count: number, data: number): void;
                        setSlot(id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>): void;
                        resetSavingEnabled(): void;
                        setSavingEnabled(enabled: boolean): void;
                        isSavingEnabled(): boolean;
                        /**
                         * @returns numeric id of the item in slot
                         */
                        getId(): number;
                        /**
                         * @returns count of the item in slot
                         */
                        getCount(): number;
                        /**
                         * @returns data of the item in slot
                         */
                        getData(): number;
                        /**
                         * @returns extra data object of the item in slot,
                         * or null if it is not present in the given item
                         */
                        getExtra(): Nullable<innercore.api.NativeItemInstanceExtra>;
                        set(id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>): void;
                        toString(): string;
                    }
                    export class ItemContainerUiHandler extends java.lang.Object implements innercore.api.mod.ui.container.UiAbstractContainer {
                        static class: java.lang.Class<ItemContainerUiHandler>;
                        constructor(container: ItemContainer);
                        onWindowClosed(): void;
                        getWindow(): innercore.api.mod.ui.window.IWindow;
                        openAs(window: innercore.api.mod.ui.window.IWindow): void;
                        close(): void;
                        getParent(): ItemContainer;
                        addElementInstance(element: innercore.api.mod.ui.elements.UIElement, name: string): void;
                        getElement(elementName: string): Nullable<innercore.api.mod.ui.elements.UIElement>;
                        getSlotVisualImpl(name: string): innercore.api.mod.ui.container.UiVisualSlotImpl;
                        getBinding<T=any>(elementName: string, bindingName: string): T;
                        setBinding<T=any>(elementName: string, bindingName: string, value: T): void;
                        handleBindingDirty(elementName: string, bindingName: string): void;
                        applyAllBindingsFromMap(): void;
                        setBindingByComposedName(name: string, value: PrimitiveTypes): void;
                        receiveBindingsFromServer(bindings: org.json.JSONObject): void;
                        handleInventoryToSlotTransaction(inventorySlot: number, slot: string, amount: number): void;
                        handleSlotToSlotTransaction(from: string, to: string, amount: number): void;
                        handleSlotToInventoryTransaction(slot: string, amount: number): void;
                    }
                }
            }
        }
        export module horizon {
            export module modloader {
                export module configuration {
                    export abstract class Configuration extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<Configuration>;
                        abstract refresh(): void;
                        abstract get<T>(key: string, clazz: globalThis.java.lang.Class<T>): T;
                        abstract get(key: string): any;
                        abstract set(key: string, value: any): boolean;
                        abstract delete(key: string): any;
                        abstract isContainer(key: string): boolean;
                        abstract getChild(key: string): Configuration;
                        abstract isReadOnly(): boolean;
                        abstract save(): void;
                        abstract load(): void;
                        getInt(key: string): number;
                        getFloat(key: string): number;
                        getDouble(key: string): number;
                        getLong(key: string): number;
                        getString(key: string): Nullable<string>;
                        getBoolean(key: string): boolean;
                        getArray<T>(key: string): Nullable<globalThis.java.util.List<T>>;
                        checkAndRestore(json: org.json.JSONObject): void;
                        checkAndRestore(json: string): void;
                    }
                }
                export class ExecutionDirectory extends globalThis.java.lang.Object {
                    static class: globalThis.java.lang.Class<ExecutionDirectory>;
                    readonly directory: globalThis.java.io.File;
                    readonly isPackDriven: boolean;
                    constructor(dir: globalThis.java.io.File, isPackDriven: boolean);
                    addLibraryDirectory(lib: library.LibraryDirectory): void;
                    getLibByName(name: string): Nullable<library.LibraryDirectory>;
                    addJavaDirectory(directory: java.JavaDirectory): void;
                    build(context: android.content.Context, logger: runtime.logger.EventLogger): LaunchSequence;
                    clear(): void;
                }
                export module java {
                    export class JavaDirectory extends globalThis.java.lang.Object {
                        readonly mod: mod.Mod;
                        readonly directory: globalThis.java.io.File;
                        readonly manifest: JavaLibraryManifest;
                        constructor(mod: mod.Mod, dir: globalThis.java.io.File);
                        getName(): string;
                        getSubDirectory(path: string, createIfRequired: boolean): globalThis.java.io.File;
                        getDestinationDirectory(): globalThis.java.io.File;
                        getJarDirectory(): globalThis.java.io.File;
                        getBuildDexFile(): globalThis.java.io.File;
                        getCompiledDexFile(): globalThis.java.io.File;
                        getSourceDirectories(): string;
                        getLibraryPaths(bootPaths: globalThis.java.util.List<globalThis.java.io.File>): string;
                        getArguments(): string[];
                        isVerboseRequired(): boolean;
                        getAllSourceFiles(): string[];
                        getBootClassNames(): globalThis.java.util.List<string>;
                        addToExecutionDirectory(exdir: ExecutionDirectory, context: android.content.Context): JavaLibrary;
                        compileToClassesFile(context: android.content.Context): void;
                        getCompiledClassesFile(): globalThis.java.io.File;
                        getCompiledClassesFiles(): globalThis.java.util.List<globalThis.java.io.File>;
                        isInDevMode(): boolean;
                        setPreCompiled(prec: boolean): void;
                        isPreCompiled(): boolean;
                    }
                    export class JavaLibrary extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<JavaLibrary>;
                        constructor(dir: JavaDirectory, dexFile: globalThis.java.io.File);
                        constructor(dir: JavaDirectory, dexFiles: globalThis.java.util.List<globalThis.java.io.File>);
                        getDirectory(): JavaDirectory;
                        getDexFiles(): globalThis.java.util.List<globalThis.java.io.File>;
                        isInitialized(): boolean;
                        initialize(): void;
                    }
                    export class JavaLibraryManifest extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<JavaLibraryManifest>;
                        readonly arguments: string[];
                        readonly verbose: boolean;
                        readonly sourceDirs: globalThis.java.util.List<globalThis.java.io.File>;
                        readonly libraryDirs: globalThis.java.util.List<globalThis.java.io.File>;
                        readonly libraryPaths: globalThis.java.util.List<globalThis.java.io.File>;
                        readonly bootClasses: globalThis.java.util.List<string>;
                        constructor(file: globalThis.java.io.File);
                    }
                }
                export class LaunchSequence extends globalThis.java.lang.Object {
                    static class: globalThis.java.lang.Class<LaunchSequence>;
                    constructor(dir: ExecutionDirectory, libraries: globalThis.java.util.List<library.LibraryDirectory>, javaLibraries: globalThis.java.util.List<java.JavaLibrary>);
                    buildSequence(logger: runtime.logger.EventLogger): void;
                    loadAll(logger: runtime.logger.EventLogger): void;
                    getAllLibraries(): globalThis.java.util.List<library.LibraryDirectory>;
                }
                export module library {
                    export class Library extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<Library>;
                        static load(path: string): Library;
                        getResult(): number;
                        refreshModuleList(): void;
                        getModules(): globalThis.java.util.List<mod.Module>;
                    }
                    export class LibraryDirectory extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<LibraryDirectory>;
                        readonly directory: globalThis.java.io.File;
                        readonly manifest: LibraryManifest;
                        readonly makeFile: LibraryMakeFile;
                        readonly soFile: globalThis.java.io.File;
                        constructor(mod: mod.Mod, directory: globalThis.java.io.File);
                        constructor(directory: globalThis.java.io.File);
                        isInDevMode(): boolean;
                        isPreCompiled(): boolean;
                        isSharedLibrary(): boolean;
                        getVersionCode(): number;
                        getName(): string;
                        getSoFileName(): string;
                        getIncludeDirs(): globalThis.java.util.List<globalThis.java.io.File>;
                        getDependencyNames(): globalThis.java.util.List<string>;
                        getExecutableFile(): globalThis.java.io.File;
                        getLibrary(): Library;
                        compileToTargetFile(directory: ExecutionDirectory, context: android.content.Context, target: globalThis.java.io.File): void;
                        setPreCompiled(pre: boolean): void;
                        addToExecutionDirectory(dir: ExecutionDirectory, context: android.content.Context, target: globalThis.java.io.File): void;
                        loadExecutableFile(): void;
                        hashCode(): number;
                    }
                    export class LibraryMakeFile extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<LibraryMakeFile>;
                        constructor(file: globalThis.java.io.File);
                        getCppFlags(): string;
                        getFiles(): globalThis.java.util.List<string>;
                    }
                    export class LibraryManifest extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<LibraryManifest>;
                        constructor(file: globalThis.java.io.File);
                        getFile(): globalThis.java.io.File;
                        getName(): string;
                        getSoName(): string;
                        getVersion(): number;
                        getDependencies(): globalThis.java.util.List<string>;
                        getInclude(): globalThis.java.util.List<string>;
                        isSharedLibrary(): boolean;
                        isShared(): boolean;
                    }
                }
                export module mod {
                    export class Mod extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<Mod>;
                        readonly directory: globalThis.java.io.File;
                        readonly manifest: ModManifest;
                        readonly libraries: globalThis.java.util.List<library.LibraryDirectory>;
                        readonly resources: globalThis.java.util.List<resource.directory.ResourceDirectory>;
                        readonly java: globalThis.java.util.List<java.JavaDirectory>;
                        readonly modules: globalThis.java.util.List<mod.Module>;
                        readonly modInstances: globalThis.java.util.List<mod.ModInstance>;
                        readonly subModLocations: globalThis.java.util.List<repo.location.ModLocation>;
                        constructor(ctx: ModContext, dir: globalThis.java.io.File);
                        inject(): void;
                        initialize(): void;
                        toString(): string;
                        getDisplayedName(): string;
                        getConfigurationInterface(): Mod.ConfigurationInterface;
                        getDeveloperInterface(): Mod.DeveloperInterface;
                        getSafetyInterface(): Mod.SafetyInterface;
                        getGraphics(): ModGraphics;
                    }
                    export module Mod {
                        export class ConfigurationInterface extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ConfigurationInterface>;
                            configuration: configuration.Configuration;
                            constructor();
                            isActive(): boolean;
                            setActive(active: boolean): void;
                        }
                        export class DeveloperInterface extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<DeveloperInterface>;
                            toProductionMode(logger: runtime.logger.EventLogger): void;
                            toDeveloperMode(): void;
                            toProductModeUiProtocol(): boolean;
                            anyForDeveloperModeTransfer(): boolean;
                            anyForProductionModeTransfer(): boolean;
                        }
                        export class SafetyInterface extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<SafetyInterface>;
                            static readonly CRASH_LOCK = ".crash-lock";
                            static readonly CRASH_DISABLED_LOCK = ".crash-disabled-lock";
                            getLock(name: string): boolean;
                            setLock(name: string, exists: boolean): boolean;
                            beginUnsafeSection(): boolean;
                            endUnsafeSection(): boolean;
                            isInUnsafeSection(): boolean;
                            isCrashRegistered(): boolean;
                            removeCrashLock(): boolean;
                            isDisabledDueToCrash(): boolean;
                            setDisabledDueToCrash(disabled: boolean): boolean;
                        }
                    }
                    export class ModGraphics extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ModGraphics>;
                        constructor();
                        constructor(dir: globalThis.java.io.File);
                        getNamedGroup(name: string): globalThis.java.util.HashMap<string, android.graphics.Bitmap>;
                        getGroup(name: string): globalThis.java.util.Collection<android.graphics.Bitmap>;
                        getAllBitmaps(): globalThis.java.util.List<android.graphics.Bitmap>;
                    }
                    export class ModInstance extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ModInstance>;
                        constructor(module: Module);
                        getModule(): Module;
                    }
                    export class ModManifest extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ModManifest>;
                        constructor(file: globalThis.java.io.File);
                        getParentDirectory(): globalThis.java.io.File;
                        getDirectories(): globalThis.java.util.List<ModManifest.Directory>;
                        getModules(): globalThis.java.util.List<ModManifest.Module>;
                        getMainModule(): ModManifest.Module;
                        getName(): string;
                    }
                    export module ModManifest {
                        export class DirectoryType extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<DirectoryType>;
                            static readonly LIBRARY: DirectoryType;
                            static readonly RESOURCE: DirectoryType;
                            static readonly SUBMOD: DirectoryType;
                            static readonly JAVA: DirectoryType;
                            static byName(name: string): DirectoryType;
                        }
                        export class Directory extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<Directory>;
                            readonly file: globalThis.java.io.File;
                            readonly type: DirectoryType;
                            constructor(file: globalThis.java.io.File, type: DirectoryType);
                            constructor(json: org.json.JSONObject);
                            asModLocation(): repo.location.ModLocation;
                        }
                        export class Module extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<Module>;
                            readonly nameId: string;
                            readonly name: string;
                            readonly author: string;
                            readonly description: string;
                            readonly versionName: string;
                            readonly versionCode: number;
                            constructor(nameId: string, json: org.json.JSONObject);
                            getDisplayedDescription(): string;
                        }
                    }
                    export class Module extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<Module>;
                        static getInstance(handle: number): Module;
                        getParent(): Module;
                        getNameID(): string;
                        getType(): string;
                        isInitialized(): boolean;
                        onEvent(event: string): void;
                        isMod(): boolean;
                    }
                }
                export class ModContext extends globalThis.java.lang.Object {
                    static class: globalThis.java.lang.Class<ModContext>;
                    readonly context: android.content.Context;
                    readonly resourceManager: resource.ResourceManager;
                    readonly executionDirectory: ExecutionDirectory;
                    getActivityContext(): android.content.Context;
                    getResourceManager(): resource.ResourceManager;
                    getExecutionDirectory(): ExecutionDirectory;
                    getActiveMods(): globalThis.java.util.List<mod.Mod>;
                    getDisabledMods(): globalThis.java.util.List<mod.Mod>;
                    getEventLogger(): runtime.logger.EventLogger;
                    clearContext(): void;
                    clearModsAndContext(): void;
                    addMod(mod: mod.Mod): void;
                    addMods(mods: globalThis.java.util.Collection<mod.Mod>): void;
                    injectAll(): void;
                    buildAll(): void;
                    initializeAll(): void;
                    launchAll(): void;
                    constructor(context: android.content.Context, resman: resource.ResourceManager, exdir: ExecutionDirectory);
                    addEventReceiver(event: string, receiver: ModContext.EventReceiver | ((...mods: mod.Mod[]) => void)): void;
                }
                export module ModContext {
                    export class EventReceiver extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<EventReceiver>;
                        onEvent(...mods: mod.Mod[]): void;
                        constructor();
                        constructor(impl: {
                            onEvent: (...mods: mod.Mod[]) => void;
                        });
                    }
                }
                export module repo {
                    export module location {
                        export class ModLocation extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ModLocation>;
                            initializeInLocalStorage(temporaryStorage: storage.TemporaryStorage, logger: runtime.logger.EventLogger): globalThis.java.io.File;
                            constructor();
                            constructor(impl: {
                                initializeInLocalStorage: (temporaryStorage: storage.TemporaryStorage, logger: runtime.logger.EventLogger) => globalThis.java.io.File;
                            });
                        }
                    }
                    export module storage {
                        export class TemporaryStorage extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<TemporaryStorage>;
                            constructor(dir: globalThis.java.io.File);
                            allocate(key: string): globalThis.java.io.File;
                            recycle(key: string): boolean;
                        }
                    }
                }
                export module resource {
                    export module directory {
                        export class Resource extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<Resource>;
                            static readonly DEFAULT_RESOURCE_PACK = "resource_packs/vanilla/";
                            static readonly RESOURCE_INDEX_SEPARATOR = "_";
                            readonly directory: ResourceDirectory;
                            readonly file: globalThis.java.io.File;
                            constructor(dir: ResourceDirectory, file: globalThis.java.io.File, path: string);
                            constructor(dir: ResourceDirectory, file: globalThis.java.io.File);
                            getPath(): string;
                            getPathWithIndex(): string;
                            getRealPath(): string;
                            getPathWithoutExtension(): string;
                            getAtlasPath(): string;
                            getName(): string;
                            getNameWithoutExtension(): string;
                            getNameWithIndex(): string;
                            getRealName(): string;
                            hasIndex(): boolean;
                            getIndex(): number;
                            getExtension(): string;
                            getMeta(): ResourceMeta;
                            getLink(path: string): Resource;
                            addOverrides(overrides: globalThis.java.util.List<ResourceOverride>): void;
                        }
                        export class ResourceDirectory extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ResourceDirectory>;
                            readonly manager: ResourceManager;
                            readonly runtimeDir: runtime.RuntimeResourceDirectory;
                            readonly mod: mod.Mod;
                            readonly directory: globalThis.java.io.File;
                            constructor(manager: ResourceManager, mod: mod.Mod, directory: globalThis.java.io.File);
                            constructor(manager: ResourceManager, directory: globalThis.java.io.File);
                            equals(obj: globalThis.java.lang.Object): boolean;
                            initialize(): void;
                            getResourceName(file: globalThis.java.io.File): string;
                            getResource(path: string): globalThis.java.util.List<Resource>;
                        }
                        export class ResourceMeta extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ResourceMeta>;
                            readonly file: globalThis.java.io.File;
                            constructor(file: globalThis.java.io.File);
                        }
                    }
                    export module processor {
                        export class ResourceProcessor extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ResourceProcessor>;
                            initialize(manager: ResourceManager): void;
                            process(resource: directory.Resource, resources: globalThis.java.util.Collection<directory.Resource>): void;
                            constructor();
                            constructor(impl: {
                                initialize: (manager: ResourceManager) => void;
                                process: (resource: directory.Resource, resources: globalThis.java.util.Collection<directory.Resource>) => void;
                            });
                        }
                    }
                    export class ResourceManager extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ResourceManager>;
                        readonly context: android.content.Context;
                        readonly runtimeDir: runtime.RuntimeResourceDirectory;
                        constructor(ctx: android.content.Context);
                        getAssets(): android.content.res.AssetManager;
                        addResourcePrefixes(...prefixes: string[]): void;
                        getResourceOverridePrefixes(): globalThis.java.util.List<string>;
                        addResourceProcessor(processor: processor.ResourceProcessor): void;
                        addRuntimeResourceHandler(handler: runtime.RuntimeResourceHandler): void;
                        addResourceDirectory(directory: directory.ResourceDirectory): void;
                        clear(): void;
                        getProcessedResources(resources: globalThis.java.util.List<directory.Resource>): globalThis.java.util.List<directory.Resource>;
                        getResource(path: string): globalThis.java.util.List<directory.Resource>;
                        addResourcePath(path: string): void;
                        deployAllOverrides(): void;
                    }
                    export class ResourceOverride extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ResourceOverride>;
                        readonly path: string;
                        readonly override: string;
                        constructor(path: string, override: string);
                        constructor(path: string, override: globalThis.java.io.File);
                        constructor(resource: directory.Resource, override: string);
                        constructor(resource: directory.Resource, override: globalThis.java.io.File);
                        constructor(resource: directory.Resource);
                        isActive(): boolean;
                        deploy(): boolean;
                        deploy(prefixes: globalThis.java.util.List<string>): boolean;
                        deploy(prefixes: string[]): boolean;
                        remove(): boolean;
                    }
                    export module runtime {
                        export class RuntimeResource extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<RuntimeResource>;
                            constructor(directory: RuntimeResourceDirectory, override: ResourceOverride, name: string);
                            getOverride(): ResourceOverride;
                            getDirectory(): RuntimeResourceDirectory;
                            getName(): string;
                            getFile(): globalThis.java.io.File;
                        }
                        export class RuntimeResourceDirectory extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<RuntimeResourceDirectory>;
                            readonly resourceManager: ResourceManager;
                            readonly directory: globalThis.java.io.File;
                            constructor(manager: ResourceManager, dir: globalThis.java.io.File);
                            clear(): void;
                            addHandler(handler: RuntimeResourceHandler): void;
                            handleAll(): void;
                        }
                        export class RuntimeResourceHandler extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<RuntimeResourceHandler>;
                            getResourceName(): string;
                            getResourcePath(): string;
                            handle(res: RuntimeResource): void;
                            constructor();
                            constructor(impl: {
                                getResourceName: () => string;
                                getResourcePath: () => string;
                                handle: (res: RuntimeResource) => void;
                            });
                        }
                    }
                }
            }
            export module runtime {
                export module logger {
                    export class EventLogger extends java.lang.Object {
                        static class: java.lang.Class<EventLogger>;
                        getMessages(filter: EventLogger.Filter): java.util.List<EventLogger.Message>;
                        constructor();
                        section(section: string): void;
                        debug(tag: string, message: string): void;
                        info(tag: string, message: string): void;
                        fault(tag: string, message: string, error: java.lang.Throwable): void;
                        fault(tag: string, message: string): void;
                        getStream(type: EventLogger.MessageType, tag: string): java.io.OutputStream;
                        clear(): void;
                    }
                    export module EventLogger {
                        export class MessageType extends java.lang.Object {
                            static class: java.lang.Class<MessageType>;
                            static readonly DEBUG: MessageType;
                            static readonly INFO: MessageType;
                            static readonly FAULT: MessageType;
                            static readonly EXCEPTION: MessageType;
                            static readonly STACKTRACE: MessageType;
                        }
                        export class Message extends java.lang.Object {
                            static class: java.lang.Class<Message>;
                            readonly type: java.lang.Object;
                            readonly tag: string;
                            readonly message: string;
                            readonly section: string;
                        }
                        export class Filter extends java.lang.Object {
                            static class: java.lang.Class<Filter>;
                            filter(message: Message): boolean;
                            constructor();
                            constructor(impl: {
                                filter: (message: Message) => boolean
                            });
                        }
                    }
                }
            }
        }
        export module innercore {
            export module api {
                export module mod {
                    export module recipes {
                        export module workbench {
                            export class InventoryPool extends java.lang.Object {
                                static class: java.lang.Class<InventoryPool>;
                                constructor(player: number);
                                addRecipeEntry(entry: RecipeEntry): void;
                                addPoolEntry(entry: InventoryPool.PoolEntry): void;
                                getPoolEntrySet(entry: RecipeEntry): Nullable<InventoryPool.PoolEntrySet>;
                                getPoolEntries(entry: RecipeEntry): Nullable<java.util.ArrayList<InventoryPool.PoolEntry>>;
                                pullFromInventory(): void;
                            }
                            export module InventoryPool {
                                interface PoolEntry {
                                    count: number,
                                    data: number,
                                    extra: NativeItemInstanceExtra,
                                    id: number,
                                    slot: number,
                                    isMatchesWithExtra(other: PoolEntry): boolean;
                                    isMatches(other: PoolEntry): boolean;
                                    hasExtra(): boolean;
                                    getAmountOfItem(amount: number): number;
                                    toString(): string;
                                }
                                export class PoolEntrySet extends java.lang.Object {
                                    static class: java.lang.Class<PoolEntrySet>;
                                    constructor();
                                    constructor(entries: java.util.ArrayList<PoolEntry>);
                                    isEmpty(): boolean;
                                    getEntries(): java.util.ArrayList<PoolEntry>;
                                    getMajorEntrySet(): PoolEntrySet;
                                    removeMatchingEntries(set: PoolEntrySet): void;
                                    getFirstEntry(): PoolEntry;
                                    getTotalCount(): number;
                                    toString(): string;
                                    spreadItems(slots: java.util.ArrayList<ui.container.AbstractSlot>): void;
                                }
                            }
                            export class RecipeEntry extends java.lang.Object {
                                static class: java.lang.Class<RecipeEntry>;
                                static readonly noentry: RecipeEntry;
                                readonly data: number;
                                readonly id: number;
                                constructor(id: number, data: number);
                                constructor(slot: ui.container.Slot);
                                getMask(): java.lang.Character;
                                getCodeByItem(id: number, data: number): number;
                                getCode(): number;
                                isMatching(slot: ui.container.AbstractSlot): boolean;
                                isMatching(entry: RecipeEntry): boolean;
                                equals(obj: java.lang.Object): boolean;
                                hashCode(): number;
                            }
                            export class WorkbenchField extends java.lang.Object {
                                static class: java.lang.Class<WorkbenchField>;
                                constructor();
                                constructor(impl: {
                                    asScriptableField: () => ui.container.AbstractSlot[],
                                    getFieldSlot: (i: number) => ui.container.AbstractSlot;
                                });
                                asScriptableField(): ui.container.AbstractSlot[];
                                getFieldSlot(i: number): ui.container.AbstractSlot;
                            }
                            export class WorkbenchFieldAPI extends java.lang.Object {
                                static class: java.lang.Class<WorkbenchFieldAPI>;
                                readonly container: WorkbenchField;
                                constructor(field: WorkbenchField);
                                getFieldSlot(i: number): ui.container.AbstractSlot;
                                decreaseFieldSlot(i: number): void;
                                prevent(): void;
                                isPrevented(): boolean;
                            }
                        }
                    }
                    export module ui {
                        export module background {
                            export interface ColorDrawingDescription {
                                type: "background",
                                color?: number,
                                mode?: number,
                                colorMode?: number
                            }
                            export class DrawColor extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawColor>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: ColorDrawingDescription, style: types.UIStyle): void;
                            }
                            export interface CustomDrawingDescription {
                                type: "custom",
                                onDraw?: (canvas: android.graphics.Canvas, scale: number) => void;
                            }
                            export class DrawCustom extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawCustom>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: CustomDrawingDescription, style: types.UIStyle): void;
                            }
                            export interface FrameDrawingDescription {
                                type: "frame",
                                bitmap?: string,
                                sides?: boolean[],
                                x?: number,
                                y?: number,
                                scale?: number,
                                width?: number, height?: number,
                                color?: number,
                                bg?: number
                            }
                            export class DrawFrame extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawFrame>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: FrameDrawingDescription, style: types.UIStyle): void;
                            }
                            export interface ImageDrawingDescription {
                                type: "bitmap",
                                x?: number, y?: number,
                                width?: number,
                                height?: number,
                                scale?: number,
                                bitmap?: string
                            }
                            export class DrawImage extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawImage>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: ImageDrawingDescription, style: types.UIStyle): void;
                            }
                            export type StandardDrawingTypes =
                                ColorDrawingDescription |
                                CustomDrawingDescription |
                                FrameDrawingDescription |
                                ImageDrawingDescription |
                                LineDrawingDescription |
                                TextDrawingDescription;
                            export class DrawingFactory extends java.lang.Object {
                                static class: java.lang.Class<DrawingFactory>;
                                static put<T extends IDrawing>(name: string, element: java.lang.Class<T>): void;
                                static construct(desc: StandardDrawingTypes, style: types.UIStyle): Nullable<IDrawing>;
                            }
                            export interface LineDrawingDescription {
                                type: "line",
                                x1?: number, y1?: number, x2?: number, y2?: number,
                                color?: number, width?: number
                            }
                            export class DrawLine extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawLine>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: LineDrawingDescription, style: types.UIStyle): void;
                            }
                            export interface TextDrawingDescription {
                                type: "text",
                                x?: number, y?: number,
                                text?: string,
                                font?: types.FontDescription
                            }
                            export class DrawText extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawText>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: TextDrawingDescription, style: types.UIStyle): void;
                            }
                            export class IDrawing extends java.lang.Object {
                                static class: java.lang.Class<IDrawing>;
                                constructor();
                                constructor(impl: {
                                    onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                    onSetup(scriptable: object, style: types.UIStyle): void;
                                });
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: object, style: types.UIStyle): void;
                            }
                        }
                        export module container {
                            export class AbstractSlot extends java.lang.Object {
                                static class: java.lang.Class<AbstractSlot>;
                                constructor();
                                constructor(impl: {
                                    getId(): number; getCount(): number; getData(): number;
                                    getExtra(): Nullable<NativeItemInstanceExtra>;
                                    set(id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): void;
                                    validate(): void;
                                })
                                getId(): number; getCount(): number; getData(): number;
                                getExtra(): Nullable<NativeItemInstanceExtra>;
                                set(id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): void;
                                validate(): void;
                            }
                            export module Container {
                                export class OnCloseListener extends java.lang.Object {
                                    static class: java.lang.Class<OnCloseListener>;
                                    constructor();
                                    constructor(impl: { onClose(container: Container, win: window.IWindow): void });
                                    onClose(container: Container, win: window.IWindow): void;
                                }
                                export class OnOpenListener extends java.lang.Object {
                                    static class: java.lang.Class<OnOpenListener>;
                                    constructor();
                                    constructor(impl: { onOpen(container: Container, win: window.IWindow): void });
                                    onOpen(container: Container, win: window.IWindow): void;
                                }
                            }
                            /**
                             * @param container [[UI.Container]] the window was opened in
                             * @param window an instance of [[UI.IWindow]] that was opened
                             */
                            export interface OnOpenCloseListenerJS { (container: Container, window: window.IWindow): void; }
                            export class Container extends java.lang.Object implements UiAbstractContainer, recipes.workbench.WorkbenchField {
                                static class: java.lang.Class<Container>;
                                static readonly isContainer: boolean;
                                /**
                                 * If container is a part of [[TileEntity]], this field stores reference 
                                 * to it, otherwise null. You can also assign any value of any type to
                                 * it using [[UI.Container.setParent]] method or using constructor 
                                 * parameter. Consider using [[UI.Container.getParent]] instead of direct 
                                 * field access
                                 */
                                parent: Nullable<TileEntity> | any;
                                slots: {[slotName: string]: container.Slot}
                                /**
                                 * Same as [[UI.Container.parent]]
                                 */
                                tileEntity: Nullable<TileEntity> | any;
                                constructor();
                                constructor(parent: any);
                                /**
                                 * Sets container's parent object, for [[TileEntity]]'s container it 
                                 * should be a [[TileEntity]] reference, otherwise you can pass any 
                                 * value to be used in your code later
                                 * @param parent an object to be set as container's parent
                                 */
                                setParent(parent: Nullable<TileEntity> | any): void;
                                /**
                                 * Getter for [[UI.Container.parent]] field
                                 */
                                getParent(): Nullable<TileEntity> | any;
                                /**
                                 * Gets the slot by its name. If a slot with specified name doesn't 
                                 * exists, creates an empty one with specified name
                                 * @param name slot name
                                 * @returns contents of the slot in a [[UI.Slot]] object.
                                 * You can modify it to change the contents of the slot
                                 */
                                getSlot(name: string): Slot;
                                /**
                                 * Gets the slot by its name. If a slot with specified name doesn't 
                                 * exists, creates an empty one with specified name
                                 * @param name slot name
                                 * @returns contents of the slot in a FullSlot object containing 
                                 * more useful methods for slot manipulation
                                 */
                                getFullSlot(name: string): Slot;
                                getSlotVisualImpl(name: string): UiVisualSlotImpl;
                                handleInventoryToSlotTransaction(invSlot: number, slotName: string, amount: number): void;
                                handleSlotToSlotTransaction(from: string, to: string, amount: number): void;
                                handleSlotToInventoryTransaction(slotName: string, amount: number): void;
                                /**
                                 * Set slot's content by its name. If a slot with specified name doesn't 
                                 * exists, creates an empty one with specified name and item
                                 * @param name slot name
                                 */
                                setSlot(name: string, id: number, count: number, data: number): void;
                                /**
                                 * Set slot's content by its name. If a slot with specified name doesn't 
                                 * exists, creates new with specified name and item
                                 * @param name slot name
                                 * @param extra item extra value. Note that it should be an instance of
                                 * [[ItemExtraData]] and not its numeric id
                                 */
                                setSlot(name: string, id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): void;
                                /**
                                 * Validates slot contents. If the data value is less then 0, it becomes
                                 * 0, if id is 0 or count is less then or equals to zero, slot is reset 
                                 * to an empty one
                                 * @param name slot name
                                 */
                                validateSlot(name: string): void;
                                /**
                                 * Clears slot's contents
                                 * @param name slot name
                                 */
                                clearSlot(name: string): void;
                                /**
                                 * Drops slot's contents on the specified coordinates
                                 * and clears the slot
                                 * @param name slot name
                                 * @deprecated doesn't make sense in multiplayer
                                 */
                                dropSlot(name: string, x: number, y: number, z: number): void;
                                /**
                                 * Drops the contents of all the slots in the container on the specified
                                 * coordinates and clears them
                                 * @deprecated doesn't make sense in multiplayer
                                 */
                                dropAt(x: number, y: number, z: number): void;
                                /**
                                 * Validates all the slots in the container
                                 */
                                validateAll(): void;
                                /**
                                 * @returns currently opened [[UI.IWindow]]
                                 * or null if no window is currently opened in the container
                                 */
                                getWindow(): window.IWindow;
                                _addElement(element: elements.UIElement, name: string): void;
                                addElementInstance(element: elements.UIElement, name: string): void;
                                _removeElement(name: string): void;
                                /**
                                 * Opens [[UI.IWindow]] object in the container
                                 * @param win [[UI.IWindow]] object to be opened
                                 */
                                openAs(win: window.IWindow): void;
                                /**
                                 * Closes currently opened window 
                                 */
                                close(): void;
                                /**
                                 * Sets an object to be notified when the window is opened
                                 * @param listener object to be notified when the window is opened
                                 */
                                setOnOpenListener(listener: Container.OnOpenListener | OnOpenCloseListenerJS): void;
                                /**
                                 * Sets an object to be notified when the window is closed
                                 * @param listener object to be notified when the window is closed
                                 */
                                setOnCloseListener(listener: Container.OnCloseListener | OnOpenCloseListenerJS): void;
                                onWindowClosed(): void;
                                /**
                                 * @returns true, if some window is opened in the container
                                 */
                                isOpened(): boolean;
                                /**
                                 * Same as [[UI.Container.getWindow]]
                                 */
                                getGuiScreen(): window.IWindow;
                                /**
                                 * @returns window's content object (usually specified in the window's 
                                 * constructor) if a window was opened in the container, null otherwise
                                 */
                                getGuiContent(): Nullable<window.WindowContent>;
                                /**
                                 * @returns window's element by its name
                                 * @param name element name
                                 */
                                getElement(name: string): Nullable<elements.UIElement>;
                                /**
                                 * Passes any value to the element
                                 * @param elementName element name
                                 * @param bindingName binding name, you can access the value from the 
                                 * element by this name
                                 * @param val value to be passed to the element
                                 */
                                setBinding<T=any>(elementName: string, bindingName: string, val: T): void;
                                /**
                                 * Gets any value from the element
                                 * @param elementName element name
                                 * @param bindingName binding name, you can access the value from the 
                                 * element by this name. Some binding names are reserved for additional
                                 * element information, e.g. "element_obj" contains pointer to the
                                 * current object and "element_rect" contains android.graphics.Rect 
                                 * object containing drawing rectangle 
                                 * @returns value that was get from the element or null if the element 
                                 * doesn't exist
                                 */
                                getBinding<T=any>(elementName: string, bindingName: string): elements.UIElement | android.graphics.Rect | T | null;
                                handleBindingDirty(): void;
                                sendChanges(): void;
                                /**
                                 * Sets "value" binding value for the element. Used to set scales values
                                 * @param name element name
                                 * @param value value to be set for the element
                                 */
                                setScale(name: string, value: number): void;
                                /**
                                 * @param name element name
                                 * @returns "value" binding value, e.g. scale value, or null if no 
                                 * element with specified name exist
                                 */
                                getValue(name: string): Nullable<number>;
                                /**
                                 * Sets "text" binding value for the element. Used to set element's text
                                 * @param name element name
                                 * @param value value to be set for the element
                                 */
                                setText(name: string, value: string | number): void;
                                /**
                                 * 
                                 * @param name element name
                                 * @returns "text" binding value, usually the text displayed on the 
                                 * element, or null if no element with specified name exist
                                 */
                                getText(name: string): Nullable<string>;
                                /**
                                 * @param name element name
                                 * @returns true if the element is currently touched
                                 */
                                isElementTouched(name: string): boolean;
                                /**
                                 * Forces ui elements of the window to refresh
                                 * @param onCurrentThread if true, the elements will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateUIElements(onCurrentThread: boolean): void;
                                invalidateUIElements(): void;
                                /**
                                 * Forces ui drawables of the window to refresh
                                 * @param onCurrentThread if true, the drawables will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateUIDrawing(onCurrentThread: boolean): void;
                                invalidateUIDrawing(): void;
                                /**
                                 * Forces ui elements and drawables of the window to refresh
                                 * @param onCurrentThread if true, the elements drawables will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateUI(onCurrentThread: boolean): void;
                                invalidateUI(): void;
                                /** @deprecated no longer supported */ refreshSlots(): void;
                                /** @deprecated no longer supported */ applyChanges(): void;
                                /**
                                 * If the container is a custom workbench, you can set the slot prefix
                                 * via this method call. [[UI.Container.getFieldSlot]]
                                 * will get field slot by *prefix + slot* name
                                 * @param prefix custom workbench slot prefix
                                 */
                                setWbSlotNamePrefix(wbsnp: string): void;
                                /**
                                 * @param slot slot index
                                 * @returns workbench slot instance by slot index
                                 */
                                getFieldSlot(i: number): Slot;
                                /**
                                 * @returns js array of all slots
                                 */
                                asScriptableField(): Slot[];
                                /**
                                 * @returns false if container supports multiplayer, true otherwise
                                 */
                                isLegacyContainer(): boolean;
                            }
                            export class ScriptableUiVisualSlotImpl extends java.lang.Object implements UiVisualSlotImpl {
                                static class: java.lang.Class<ScriptableUiVisualSlotImpl>;
                                constructor(scriptable: ItemInstance);
                                getId(): number;
                                getCount(): number;
                                getData(): number;
                                getExtra(): Nullable<NativeItemInstanceExtra>;
                            }
                            export class Slot extends java.lang.Object implements AbstractSlot {
                                static class: java.lang.Class<Slot>;
                                id: number;
                                count: number;
                                data: number;
                                extra: Nullable<NativeItemInstanceExtra>;
                                getClassName(): "slot";
                                constructor(id: number, count: number, data: number);
                                constructor(id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>);
                                constructor();
                                constructor(parent: ItemInstance);
                                set(id: number, count: number, data: number): void;
                                set(id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): void;
                                put(name: string, prop: any): void;
                                getInt(name: string): number;
                                validate(): void;
                                /** @deprecated */ drop(x: number, y: number, z: number): void;
                                getTarget(): ItemInstance;
                                getId(): number; getCount(): number; getData(): number;
                                getExtraValue(): number;
                                getExtra(): Nullable<NativeItemInstanceExtra>;
                                save(): Slot;
                            }
                            export class UiAbstractContainer extends java.lang.Object {
                                static class: java.lang.Class<UiAbstractContainer>;
                                constructor();
                                constructor(impl: {
                                    addElementInstance(element: elements.UIElement, name: string): void;
                                    close(): void;
                                    getBinding<T=any>(element: string, bindingName: string): elements.UIElement | android.graphics.Rect | T | null;
                                    getElement(elementName: string): Nullable<elements.UIElement>;
                                    getParent(): any;
                                    getSlotVisualImpl(slotName: string): UiVisualSlotImpl;
                                    handleBindingDirty(element: string, bindingName: string): void;
                                    handleInventoryToSlotTransaction(invSlot: number, containerSlot: string, count: number): void;
                                    handleSlotToInventoryTransaction(containerSlot: string, invSlot: number): void;
                                    handleSlotToSlotTransaction(slot1: string, slot2: string, count: number): void;
                                    onWindowClosed(): void;
                                    openAs(win: window.IWindow): void;
                                    setBinding<T>(element: string, bindingName: string, obj: T): void;
                                });
                                addElementInstance(element: elements.UIElement, name: string): void;
                                close(): void;
                                getBinding<T=any>(element: string, bindingName: string): elements.UIElement | android.graphics.Rect | T | null;
                                getElement(elementName: string): Nullable<elements.UIElement>;
                                getParent(): any;
                                getSlotVisualImpl(slotName: string): UiVisualSlotImpl;
                                handleBindingDirty(element: string, bindingName: string): void;
                                handleInventoryToSlotTransaction(invSlot: number, containerSlot: string, count: number): void;
                                handleSlotToInventoryTransaction(containerSlot: string, invSlot: number): void;
                                handleSlotToSlotTransaction(slot1: string, slot2: string, count: number): void;
                                onWindowClosed(): void;
                                openAs(win: window.IWindow): void;
                                setBinding<T>(element: string, bindingName: string, obj: T): void;
                            }
                            export class UiVisualSlotImpl extends java.lang.Object {
                                static class: java.lang.Class<UiVisualSlotImpl>;
                                constructor();
                                constructor(impl: {
                                    getId(): number; getCount(): number; getData(): number;
                                    getExtra(): Nullable<NativeItemInstanceExtra>;
                                });
                                getId(): number; getCount(): number; getData(): number;
                                getExtra(): Nullable<NativeItemInstanceExtra>;
                            }
                        }
                        export class ContentProvider extends java.lang.Object {
                            static class: java.lang.Class<ContentProvider>;
                            content: window.WindowContent;
                            drawing: object;
                            drawingWatcher: util.ScriptableWatcher;
                            elementMap: java.util.HashMap<string, elements.UIElement>;
                            elements: object;
                            window: window.UIWindow;
                            constructor(window: window.UIWindow);
                            setContentObject(content: window.WindowContent): void;
                            setupElements(): void;
                            refreshElements(): void;
                            setupDrawing(): void;
                            refreshDrawing(): void;
                            invalidateAllContent(): void;
                            toString(): string;
                        }
                        export module elements {
                            export type StandardElementTypes = 
                                ButtonElementDescription |
                                CustomElementDescription |
                                FPSTextElementDescription |
                                FrameElementDescription |
                                ImageElementDescription |
                                InvSlotElementDescription |
                                ScaleElementDescription |
                                ScrollElementDescription |
                                SlotElementDescription |
                                SwitchElementDescription |
                                TabElementDescription |
                                TextElementDescription;
                            export class ElementFactory extends java.lang.Object {
                                static class: java.lang.Class<ElementFactory>;
                                static put<T extends UIElement>(name: string, element: java.lang.Class<T>): void;
                                static construct<T extends BasicElementDescription>(type: string, win: window.UIWindow, descr: StandardElementTypes | T): Nullable<UIElement>;
                                static construct<T extends BasicElementDescription>(win: window.UIWindow, descr: StandardElementTypes | T): Nullable<UIElement>;
                            }
                            export interface ButtonElementDescription extends BasicElementDescription {
                                type: "button" | "closeButton" | "close_button",
                                scale?: number,
                                bitmap?: BitmapTypes,
                                bitmap2?: BitmapTypes
                            }
                            export class UIButtonElement extends UIElement {
                                static class: java.lang.Class<UIButtonElement>;
                                constructor(win: window.UIWindow, desc: ButtonElementDescription);
                                onSetup<ButtonElementDescription>(desc: ButtonElementDescription): void;
                                onDraw(cvs: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, value: T): void;
                            }
                            export class UICloseButtonElement extends UIButtonElement {
                                static class: java.lang.Class<UICloseButtonElement>;
                                constructor(window: window.UIWindow, desc: ButtonElementDescription);
                                onTouchEvent(event: types.TouchEvent): void;
                            }
                            export interface CustomElementDescription extends BasicElementDescription {
                                type: "custom",
                                custom?: {
                                    onSetup?: (element: UICustomElement) => void,
                                    onDraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void,
                                    onTouchReleased?: (element: UICustomElement) => void,
                                    onBindingUpdated?: <T>(element: UICustomElement, name: string, val: T) => void,
                                    onReset?: (element: UICustomElement) => void,
                                    onRelease?: (element: UICustomElement) => void,
                                    onContainerInit?: (element: UICustomElement, container: container.UiAbstractContainer, elementName: string) => void
                                }
                            }
                            export class UICustomElement extends UIElement {
                                static class: java.lang.Class<UICustomElement>;
                                constructor(win: window.UIWindow, desc: CustomElementDescription);
                                getScope(): object;
                                onSetup<CustomElementDescription>(desc: CustomElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onTouchReleased(event: types.TouchEvent): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                onReset(): void;
                                onRelease(): void;
                                setupInitialBindings(container: container.UiAbstractContainer, elementName: string): void;
                            }
                            /* <DMHYT>: 'I am not sure about the function parameters order in this interface,
                            which I saw in previous docs. In the source code I could see (container, position),\
                            whereas here is (position, container, tile, window, canvas, scale). So TODO here is
                            to make sure if parameters order is correct' */
                            /**
                             * Object where you can specify how the UI element will behave on touch events.
                             */
                            export interface UIClickEvent {
                                /**
                                 * This function will be called when element is short touched
                                 */
                                onClick?: (position: Vector, container: container.UiAbstractContainer | apparatus.api.container.ItemContainer, tileEntity: Nullable<TileEntity> | any, window: window.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
                                /**
                                 * This function will be called when element is long touched
                                 */
                                onLongClick?: (position: Vector, container: container.UiAbstractContainer | apparatus.api.container.ItemContainer, tileEntity: Nullable<TileEntity> | any, window: window.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
                            }
                            /**
                             * Types that can be used to create element texture.
                             * For static textures it can be string path to texture in assets directory, or [[android.graphics.Bitmap]] instance.
                             * For animated textures it can be array of string paths to texture in assets directory, or an array of [[android.graphics.Bitmap]] instances.
                             * Each element in the array represents one of animation frames
                             */
                            export type BitmapTypes = string | string[] | android.graphics.Bitmap | android.graphics.Bitmap[];
                            /**
                             * There are 12 types of UI elements given by InnerCore, and you can also create your custom ones.
                             * Each element type has its own specific description object.
                             * These description objects are all inherited from this [[BasicElementDescription]].
                             * It means that each element must have coords on the GUI by X, Y, and additionally Z axis,
                             * and also you can specify how the element will behave when touched, in clicker object (optional).
                             */
                            export interface BasicElementDescription {
                                x?: number, y?: number, z?: number,
                                clicker?: UIClickEvent,
                                [key: string]: any
                            }
                            /**
                             * This is the base Java abstract class, which are all InnerCore element types inherited from.
                             * In Java, to create custom element types, you can inherit your element class from this one as well.
                             * Whereas in JavaScript, you should use "custom" element type in description object,
                             * where you can specify custom behavior for different events.
                             * For more information about custom element types in JavaScript,
                             * see [[UI.UICustomElement]]
                             */
                            export abstract class UIElement extends java.lang.Object {
                                static class: java.lang.Class<UIElement>;
                                cleaner: UIElementCleaner;
                                description: object;
                                descriptionWatcher: util.ScriptableWatcher;
                                elementName: string;
                                elementRect: android.graphics.Rect;
                                isDirty: boolean;
                                isTouched: boolean;
                                window: window.UIWindow;                                
                                x: number;
                                y: number;
                                z: number;
                                abstract onBindingUpdated<T>(str: string, obj: T): void;
                                abstract onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                abstract onSetup<T extends BasicElementDescription>(descr?: T): void;
                                /**
                                 * Creates a new [[UI.Texture]] instance
                                 * with specified style applied.
                                 * See [[UI.Texture.constructor]] for parameters description
                                 */
                                createTexture(obj: BitmapTypes): types.Texture;
                                /**
                                 * Sets element's position in the window's unit coordinates
                                 * @param x x position
                                 * @param y y position
                                 */
                                setPosition(x: number, y: number): void;
                                /**
                                 * Sets element's size in the window's unit coordinates
                                 * @param width element's width 
                                 * @param height element's height
                                 */
                                setSize(width: number, height: number): void;
                                constructor(window: window.UIWindow, scriptable: object);
                                getCleanerCopy(): UIElementCleaner;
                                /**
                                 * Passes any value to the element
                                 * @param bindingName binding name, you can access the value from the 
                                 * element by this name
                                 * @param value value to be passed to the element
                                 */
                                setBinding<T=any>(bindingName: string, value: T): void;
                                /**
                                 * Gets any value from the element
                                 * @param bindingName binding name, you can access the value from the 
                                 * element by this name. Some binding names are reserved for additional
                                 * element information, e.g. "element_obj" contains pointer to the
                                 * current object and "element_rect" contains [[android.graphics.Rect]] 
                                 * object containing drawing rectangle 
                                 * @returns value that was get from the element or null if the element 
                                 * doesn't exist
                                 */
                                getBinding<T=any>(name: string): UIElement | android.graphics.Rect | T;
                                setupInitialBindings(container: container.UiAbstractContainer, elementName: string): void;
                                onTouchEvent(event: types.TouchEvent): void;
                                onTouchReleased(event: types.TouchEvent): void;
                                isReleased(): boolean;
                                onRelease(): void;
                                onReset(): void;
                                invalidate(): void;
                                debug(canvas: android.graphics.Canvas, scale: number): void;
                            }
                            export class UIElementCleaner extends java.lang.Object {
                                static class: java.lang.Class<UIElementCleaner>;
                                element: UIElement;
                                rect: android.graphics.Rect;
                                constructor(element: UIElement);
                                clone(): UIElementCleaner;
                                set(rect: android.graphics.Rect): void;
                                clean(canvas: android.graphics.Canvas, scale: number): void;
                                debug(canvas: android.graphics.Canvas, scale: number): void;
                            }
                            export interface FPSTextElementDescription extends BasicElementDescription {
                                type: "fps",
                                font?: types.FontDescription,
                                multiline?: boolean,
                                format?: boolean,
                                formatMaxCharsPerLine?: number,
                                text?: string,
                                interpolate?: boolean,
                                period?: number
                            }
                            export class UIFPSTextElement extends UITextElement {
                                static class: java.lang.Class<UIFPSTextElement>;
                                constructor(win: window.UIWindow, desc: FPSTextElementDescription);
                                onSetup<FPSTextElementDescription>(desc: FPSTextElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                            }
                            export interface FrameElementDescription extends BasicElementDescription {
                                type: "frame",
                                bitmap?: BitmapTypes,
                                width?: number, height?: number,
                                scale?: number,
                                color?: number,
                                sides?: types.Sides
                            }
                            export class UIFrameElement extends UIElement {
                                static class: java.lang.Class<UIFrameElement>;
                                constructor(win: window.UIWindow, desc: FrameElementDescription);
                                onSetup<FrameElementDescription>(desc: FrameElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                onRelease(): void;
                            }
                            export interface ImageElementDescription extends BasicElementDescription {
                                type: "image",
                                width?: number, height?: number,
                                scale?: number,
                                bitmap?: BitmapTypes,
                                overlay?: BitmapTypes
                            }
                            export class UIImageElement extends UIElement {
                                static class: java.lang.Class<UIImageElement>;
                                height: number;
                                overlay: types.Texture;
                                texture: types.Texture;
                                textureScale: number;
                                width: number;
                                constructor(win: window.UIWindow, desc: ImageElementDescription);
                                onSetup<ImageElementDescription>(desc: ImageElementDescription): void;
                                isAnimated(): boolean;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                onRelease(): void;
                            }
                            export interface InvSlotElementDescription extends BasicElementDescription {
                                type: "invSlot" | "invslot",
                                bitmap?: string,
                                size?: number,
                                maxStackSize?: number,
                                visual?: boolean,
                                darken?: boolean,
                                isDarkenAtZero?: boolean,
                                text?: string,
                                onItemChanged?: (container: container.UiAbstractContainer, oldId: number, oldCount: number, oldData: number) => void,
                                isValid?: (id: number, count: number, data: number, container: container.UiAbstractContainer, item: ItemInstance) => boolean,
                                index?: number;
                            }
                            export class UIInvSlotElement extends UISlotElement {
                                static class: java.lang.Class<UIInvSlotElement>;
                                constructor(win: window.UIWindow, desc: UIInvSlotElement);
                                onSetup<InvSlotElementDescription>(desc: InvSlotElementDescription): void;
                                onTouchEvent(event: types.TouchEvent): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                setupInitialBindings(container: container.UiAbstractContainer, elementName: string): void;
                            }
                            export interface ScaleElementDescription extends BasicElementDescription {
                                type: "scale",
                                scale?: number,
                                direction?: number,
                                invert?: boolean,
                                pixelate?: boolean,
                                bitmap?: string,
                                width?: number, height?: number,
                                background?: string,
                                backgroundOffset?: { x?: number, y?: number },
                                overlay?: string,
                                overlayOffset?: { x?: number, y?: number },
                                value?: number
                            }
                            export class UIScaleElement extends UIElement {
                                static class: java.lang.Class<UIScaleElement>;
                                static readonly DIRECTION_DOWN: number;
                                static readonly DIRECTION_LEFT: number;
                                static readonly DIRECTION_RIGHT: number;
                                static readonly DIRECTION_UP: number;
                                constructor(win: window.UIWindow, desc: ScaleElementDescription);
                                onSetup<ScaleElementDescription>(desc: ScaleElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                onRelease(): void;
                            }
                            export interface ScrollElementDescription extends BasicElementDescription {
                                type: "scroll",
                                isInt?: boolean,
                                width?: number, length?: number,
                                min?: number, max?: number,
                                divider?: number,
                                bindingObject?: any,
                                bindingProperty?: string,
                                configValue?: Config.ConfigValue,
                                bitmapHandle?: BitmapTypes,
                                bitmapHandleHover?: BitmapTypes,
                                bitmapBg?: string,
                                bitmapBgHover?: string,
                                ratio?: number,
                                onNewValue?: (result: number, container: container.UiAbstractContainer, element: UIScrollElement) => void
                            }
                            export class UIScrollElement extends UIElement {
                                static class: java.lang.Class<UIScrollElement>;
                                constructor(win: window.UIWindow, desc: ScrollElementDescription);
                                onSetup<ScrollElementDescription>(desc: ScrollElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                onRelease(): void;
                                onTouchEvent(event: types.TouchEvent): void;
                            }
                            export interface SlotElementDescription extends BasicElementDescription {
                                type: "slot",
                                bitmap?: string,
                                size?: number,
                                maxStackSize?: number,
                                visual?: boolean,
                                darken?: boolean,
                                isDarkenAtZero?: boolean,
                                text?: string,
                                source?: ItemInstance,
                                onItemChanged?: (container: container.UiAbstractContainer, oldId: number, oldCount: number, oldData: number) => void,
                                isValid?: (id: number, count: number, data: number, container: container.Container, item: ItemInstance) => boolean;
                            }
                            export class UISlotElement extends UIElement {
                                static class: java.lang.Class<UISlotElement>;
                                background: types.Texture;
                                curCount: number;
                                curData: number;
                                curExtra: Nullable<NativeItemInstanceExtra>;
                                curId: number;
                                isDarken: boolean;
                                isDarkenAtZero: boolean;
                                isVisual: boolean;
                                maxStackSize: number;
                                size: number;
                                slotName: string;
                                source: container.UiVisualSlotImpl;
                                textOverride: Nullable<string>;
                                constructor(win: window.UIWindow, desc: SlotElementDescription);
                                onSetup<UISlotElement>(desc: UISlotElement): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                                setupInitialBindings(container: container.UiAbstractContainer, elementName: string): void;
                                onRelease(): void;
                                onReset(): void;
                                getMaxStackSize(): number;
                                isValidItem(id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): boolean;
                                getMaxItemTransferAmount(slot: UISlotElement): number;
                                onTouchEvent(event: types.TouchEvent): void;
                            }
                            export interface SwitchElementDescription extends BasicElementDescription {
                                type: "switch",
                                bindingObject?: any,
                                bindingProperty?: string,
                                configValue?: Config.ConfigValue,
                                bitmapOn?: BitmapTypes,
                                bitmapOnHover?: BitmapTypes,
                                bitmapOff?: BitmapTypes,
                                bitmapOffHover?: BitmapTypes,
                                scale?: number,
                                onNewState?: (val: boolean, container: container.UiAbstractContainer, element: UISwitchElement) => void
                            }
                            export class UISwitchElement extends UIElement {
                                static class: java.lang.Class<UISwitchElement>;
                                constructor(win: window.UIWindow, desc: SwitchElementDescription);
                                onSetup<SwitchElementDescription>(desc: SwitchElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T=boolean>(name: string, val: T): void;
                                onTouchEvent(event: types.TouchEvent): void;
                                onRelease(): void;
                            }
                            export interface TabElementDescription extends BasicElementDescription {
                                type: "tab",
                                selectedColor?: number,
                                deselectedColor?: number,
                                tabIndex?: number,
                                isAlwaysSelected?: boolean,
                                isSelected?: boolean
                            }
                            export class UITabElement extends UIFrameElement {
                                static class: java.lang.Class<UITabElement>;
                                constructor(win: window.UIWindow, desc: TabElementDescription);
                                onSetup<TabElementDescription>(desc: TabElementDescription): void;
                                onTouchEvent(event: types.TouchEvent): void;
                                onReset(): void;
                            }
                            export interface TextElementDescription extends BasicElementDescription {
                                type: "text",
                                font?: types.FontDescription,
                                multiline?: boolean,
                                format?: boolean,
                                formatMaxCharsPerLine?: number,
                                text?: string
                            }
                            export class UITextElement extends UIElement {
                                static class: java.lang.Class<UITextElement>;
                                constructor(win: window.UIWindow, desc: TextElementDescription);
                                onSetup<TextElementDescription>(desc: TextElementDescription): void;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onBindingUpdated<T>(name: string, val: T): void;
                            }
                        }
                        export class GuiBlockModel extends java.lang.Object {
                            static class: java.lang.Class<GuiBlockModel>;
                            setShadow(shadow: boolean): void;
                            constructor(resolution: number);
                            constructor();
                            addBox(box: GuiBlockModel.Box): void;
                            clear(): void;
                            constructor(textures: string[], ids: number[], shape: unlimited.BlockShape);
                            constructor(textures: string[], ids: number[]);
                            updateShape(shape: unlimited.BlockShape): void;
                            genTexture(): android.graphics.Bitmap;
                            addToMesh(mesh: NativeRenderMesh, x: number, y: number, z: number): void;
                            addToRenderModelPart(modelPart: NativeRenderer.ModelPart, x: number, y: number, z: number): void;
                            static createModelForBlockVariant(variant: unlimited.BlockVariant): GuiBlockModel;
                        }
                        export module GuiBlockModel {
                            export class Box extends java.lang.Object {
                                static class: java.lang.Class<Box>;
                                readonly enabledSides: [boolean, boolean, boolean, boolean, boolean, boolean];
                                textureNames: java.util.ArrayList<android.util.Pair<string, number>>;
                                readonly x1: number;
                                readonly x2: number;
                                readonly y1: number;
                                readonly y2: number;
                                readonly z1: number;
                                readonly z2: number;
                                setShadow(shadow: boolean): void;
                                setRenderAllSides(renderAllSides: boolean): void;
                                constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
                                getShape(): unlimited.BlockShape;
                                constructor(shape: unlimited.BlockShape);
                                constructor();
                                constructor(name: string, id: number);
                                constructor(box: Box, shape: unlimited.BlockShape);
                                addTexturePath(tex: string): void;
                                addTexture(name: string, id: number): void;
                                addTexture(name: android.util.Pair<string, number>): void;
                                genTexture(resolution: number): android.graphics.Bitmap;
                                public addToMesh(mesh: NativeRenderMesh, x: number, y: number, z: number): void;
                            }
                            export class Builder extends java.lang.Object {
                                static class: java.lang.Class<Builder>;
                                build(resolveCollisionsAndSort: boolean): GuiBlockModel;
                                add(box: Builder.PrecompiledBox): void;
                                add(builder: Builder): void;
                            }
                            export module Builder {
                                export class PrecompiledBox extends java.lang.Object {
                                    static class: java.lang.Class<PrecompiledBox>;
                                    blockData: number;
                                    blockId: number;
                                    readonly enabledSides: [boolean, boolean, boolean, boolean, boolean, boolean];
                                    textureNames: java.util.ArrayList<android.util.Pair<string, number>>;
                                    x1: number;
                                    x2: number;
                                    y1: number;
                                    y2: number;
                                    z1: number;
                                    z2: number;
                                    constructor(inherit: PrecompiledBox, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
                                    disableSide(side: number): PrecompiledBox;
                                    addTexture(name: string, id: number): PrecompiledBox;
                                    setBlock(id: number, data: number): PrecompiledBox;
                                    inside(b: PrecompiledBox): boolean;
                                    intersects(b: PrecompiledBox): boolean;
                                    inFrontOf(b: PrecompiledBox): boolean;
                                    compile(): Box;
                                    toString(): string;
                                }
                            }
                            export class VanillaRenderType extends java.lang.Object {
                                static class: java.lang.Class<VanillaRenderType>;
                                static getFor(id: number): VanillaRenderType;
                                buildModelFor(textures: string[], textureIds: number[]): GuiBlockModel;
                                buildModelFor(textures: java.util.List<android.util.Pair<string, number>>): GuiBlockModel;
                            }
                        }
                        export class GuiRenderMesh extends java.lang.Object {
                            static class: java.lang.Class<GuiRenderMesh>;
                            rx: number;
                            ry: number;
                            rz: number;
                            x: number;
                            y: number;
                            z: number;
                            draw(gl: javax.microedition.khronos.opengles.GL10): void;
                            setVertices(vertices: number[]): void;
                            setIndices(indices: number[]): void;
                            setTextureCoordinates(textureCoords: number[]): void;
                            setColors(colors: number[]): void;
                            loadBitmap(bitmap: android.graphics.Bitmap): void;
                        }
                        export class IBackgroundProvider extends java.lang.Object {
                            static class: java.lang.Class<IBackgroundProvider>;
                            constructor();
                            constructor(impl: {
                                addDrawing(idrawing: background.IDrawing): void;
                                clearAll(): void;
                                prepareCache(): void;
                                releaseCache(): void;
                                setBackgroundColor(color: number): void;
                            });
                            addDrawing(idrawing: background.IDrawing): void;
                            clearAll(): void;
                            prepareCache(): void;
                            releaseCache(): void;
                            setBackgroundColor(color: number): void;
                        }
                        export module icon {
                            export class ItemIconLoader extends java.lang.Object {
                                static class: java.lang.Class<ItemIconLoader>;
                                static load(): void;
                                static init(): void;
                            }
                            export class ItemIconSource extends java.lang.Object {
                                static class: java.lang.Class<ItemIconSource>;
                                static readonly instance: ItemIconSource;
                                private constructor();
                                static init(): void;
                                static isGlintAnimationEnabled(): boolean;
                                registerIcon(id: number, name: string): void;
                                registerIcon(id: number, data: number, name: string): void;
                                registerIcon(id: number, bmp: android.graphics.Bitmap): void;
                                registerIcon(id: number, data: number, bmp: android.graphics.Bitmap): void;
                                checkoutIcon(_name: string): Nullable<android.graphics.Bitmap>;
                                getIconName(id: number, data: number): string;
                                getIconPath(id: number, data: number): string;
                                getNullableIcon(id: number, data: number): Nullable<android.graphics.Bitmap>;
                                getIcon(id: number, data: number, icon: android.graphics.Bitmap, enableCache: boolean): android.graphics.Bitmap;
                                getScaledIcon(originIcon: android.graphics.Bitmap, id: number, data: number, size: number, glint: number): android.graphics.Bitmap;
                                static generateAllModItemModels(): void;
                            }
                            export class ItemModels extends java.lang.Object {
                                static class: java.lang.Class<ItemModels>;
                                static readonly ATLAS_NAME = "textures/entity/camera_tripod";
                                static readonly ATLAS_PATH: string;
                                static readonly CACHE_DIR: string;
                                static prepareModelInfo(idKey: string): ItemModels.ModelInfo;
                                static prepareModelInfo(idKey: string, spritePath: string): ItemModels.ModelInfo;
                                static prepareModelInfo(idKey: string, model: GuiBlockModel): ItemModels.ModelInfo;
                                static createAtlasLink(formattedName: string, bmp: android.graphics.Bitmap): number;
                                static createAtlasLink(path: string): number;
                                static createAtlas(): void;
                                static getAtlasUnit(iconName: string): Nullable<ItemModels.AltasUnit>;
                                static init(): void;
                                static getAtlasWidth(): number;
                                static getAtlasHeight(): number;
                                static getModelInfo(idKey: string): ItemModels.ModelInfo;
                                static getModelInfo(id: number, data: number): ItemModels.ModelInfo;
                                static updateBlockShape(id: number, data: number, shape: unlimited.BlockShape): void;
                                static setCustomUiModel(id: number, data: number, model: GuiBlockModel): void;
                                static getItemOrBlockModel(id: number, count: number, data: number, scale: number, rX: number, rY: number, rZ: number, randomize: boolean): NativeRenderer.Renderer;
                            }
                            export module ItemModels {
                                export class ModelInfo extends java.lang.Object {
                                    static class: java.lang.Class<ModelInfo>;
                                    private constructor(idKey: string);
                                    getModel(): GuiBlockModel;
                                    isSprite(): boolean;
                                    isCustomized(): boolean;
                                    getSkinName(): string;
                                    getCache(): android.graphics.Bitmap;
                                    writeToCache(bmp: android.graphics.Bitmap): void;
                                    setShape(shape: unlimited.BlockShape): void;
                                }
                                export class AltasUnit extends java.lang.Object {
                                    static class: java.lang.Class<AltasUnit>;
                                    readonly bitmap: android.graphics.Bitmap;
                                    readonly pos: number;
                                    readonly size: number;
                                    constructor(bmp: android.graphics.Bitmap, pos: number, size: number);
                                }
                            }
                        }
                        export class IElementProvider extends java.lang.Object {
                            static class: java.lang.Class<IElementProvider>;
                            constructor();
                            constructor(impl: {
                                addOrRefreshElement(element: elements.UIElement): void;
                                getStyleFor(element: elements.UIElement): types.UIStyle;
                                invalidateAll(): void;
                                releaseAll(): void;
                                removeElement(element: elements.UIElement): void;
                                resetAll(): void;
                                runCachePreparation(): void;
                                setBackgroundProvider(bgprovider: IBackgroundProvider): void;
                                setWindowStyle(style: types.UIStyle): void;
                            });
                            addOrRefreshElement(element: elements.UIElement): void;
                            getStyleFor(element: elements.UIElement): types.UIStyle;
                            invalidateAll(): void;
                            releaseAll(): void;
                            removeElement(element: elements.UIElement): void;
                            resetAll(): void;
                            runCachePreparation(): void;
                            setBackgroundProvider(bgprovider: IBackgroundProvider): void;
                            setWindowStyle(style: types.UIStyle): void;
                        }
                        export interface IElementProvider {
                            addOrRefreshElement(element: elements.UIElement): void;
                            getStyleFor(element: elements.UIElement): types.UIStyle;
                            invalidateAll(): void;
                            releaseAll(): void;
                            removeElement(element: elements.UIElement): void;
                            resetAll(): void;
                            runCachePreparation(): void;
                            setBackgroundProvider(bgprovider: IBackgroundProvider): void;
                            setWindowStyle(style: types.UIStyle): void;
                        }
                        export class ItemModelCacheManager extends java.lang.Object {
                            static class: java.lang.Class<ItemModelCacheManager>;
                            static getSingleton(): ItemModelCacheManager;
                            getCacheGroupDirectory(group: string): java.io.File;
                            getCachePath(group: string, name: string): java.io.File;
                            getCurrentCacheGroup(): string;
                            setCurrentCacheGroup(groupName: string, lock: string): void;
                        }
                        export module memory {
                            export class BitmapCache extends java.lang.Object {
                                static class: java.lang.Class<BitmapCache>;
                                static readonly CACHE_DIR: string;
                                static init(): void;
                                static getCacheFile(name: string): java.io.File;
                                static getUseId(): number;
                                static getStackPos(id: number): number;
                                static registerWrap(wrap: BitmapWrap): void;
                                static unregisterWrap(wrap: BitmapWrap): void;
                                static writeToFile(file: java.io.File, bitmap: android.graphics.Bitmap): void;
                                static readFromFile(file: java.io.File, bitmap: android.graphics.Bitmap): void;
                                static testCaching(src: android.graphics.Bitmap): android.graphics.Bitmap;
                                static storeOldWraps(maxStackPos: number): void;
                                static immediateGC(): void;
                                static asyncGC(): void;
                            }
                            export abstract class BitmapWrap extends java.lang.Object {
                                static class: java.lang.Class<BitmapWrap>;
                                static readonly MISSING_BITMAP: android.graphics.Bitmap;
                                abstract resize(x: number, y: number): BitmapWrap;
                                abstract restore(): boolean;
                                abstract store(): boolean;
                                constructor();
                                storeIfNeeded(): void;
                                restoreIfNeeded(): void;
                                getWidth(): number;
                                getHeight(): number;
                                getConfig(): android.graphics.Bitmap.Config;
                                getStackPos(): number;
                                get(): android.graphics.Bitmap;
                                isRecycled(): boolean;
                                recycle(): void;
                                removeCache(): void;
                                getResizedCache(width: number, height: number): android.graphics.Bitmap;
                                static wrap(bmp: android.graphics.Bitmap): BitmapWrap;
                                static wrap(name: string, width: number, height: number): BitmapWrap;
                                static wrap(name: string): BitmapWrap;
                            }
                            export class RandomBitmapWrap extends BitmapWrap {
                                static class: java.lang.Class<RandomBitmapWrap>;
                                constructor(bitmap: android.graphics.Bitmap);
                                store(): boolean;
                                restore(): boolean;
                                resize(width: number, height: number): BitmapWrap;
                                recycle(): void;
                            }
                            export class SourceBitmapWrap extends BitmapWrap {
                                static class: java.lang.Class<SourceBitmapWrap>;
                                constructor(name: string, width: number, height: number);
                                store(): boolean;
                                restore(): boolean;
                                resize(width: number, height: number): BitmapWrap;
                                recycle(): void;
                            }
                        }
                        export class TextureSource extends java.lang.Object {
                            static class: java.lang.Class<TextureSource>;
                            loadAllStandartAssets(): void;
                            put(name: string, bmp: android.graphics.Bitmap): void;
                            get(name: string): android.graphics.Bitmap;
                            getSafe(name: string): android.graphics.Bitmap;
                            loadFile(file: java.io.File, namePrefix: string): void;
                            loadAsset(name: string): void;
                            loadDirectory(dir: java.io.File): void;
                            loadDirectory(dir: java.io.File, namePrefix: string): void;
                        }
                        export module types {
                            /**
                             * Object containing font parameters. If no color, size and shadow are 
                             * specified, default values are ignored and white font with text size 20,
                             * white color and 0.45 shadow is created
                             */
                            export interface FontDescription {
                                /**
                                 * Font color, android integer color value (produced by
                                 * [[android.graphics.Color]]). Default value is black
                                 */
                                color?: number,
                                /**
                                 * Font size. Default value is 20
                                 */
                                size?: number,
                                /**
                                 * Font shadow offset. Default value is 0, witch produces no shadow
                                 */
                                shadow?: number,
                                /**
                                 * Font alignment, one of the [[Font.ALIGN_DEFAULT]],
                                 * [[Font.ALIGN_CENTER]], [[Font.ALIGN_END]] constants
                                 */
                                alignment?: number,
                                /**
                                 * Same as [[FontDescription.alignment]]
                                 */
                                align?: number,
                                /**
                                 * If true, the font is bold, false otherwise. Default value is false
                                 */
                                bold?: boolean,
                                /**
                                 * If true, the font is italic, false otherwise. Default value is false
                                 */
                                cursive?: boolean,
                                /**
                                 * If true, the font is underlined, false otherwise. Default value is false
                                 */
                                underline?: boolean
                            }
                            export class Font extends java.lang.Object {
                                static class: java.lang.Class<Font>;
                                /**
                                 * Aligns text to the start of the element (left for English locale)
                                 */
                                static readonly ALIGN_CENTER: number;
                                /**
                                 * Aligns text to the center of the element
                                 */
                                static readonly ALIGN_DEFAULT: number;
                                /**
                                 * Aligns text to the end of the element (right for English locale)
                                 */
                                static readonly ALIGN_END: number;
                                /**
                                 * Aligns text to the center of the element horizontally
                                 */
                                static ALIGN_CENTER_HORIZONTAL: number;
                                alignment: number;
                                color: number;
                                isBold: boolean;
                                isCursive: boolean;
                                isUnderlined: boolean;
                                shadow: number;
                                size: number;
                                /**
                                 * Constructs new instance of the font with specified parameters
                                 * @param color font color, android integer color value (produced by
                                 * android.graphics.Color)
                                 * @param size font size
                                 * @param shadow shadow offset
                                 */
                                constructor(color: number, size: number, shadow: number);
                                /**
                                 * Constructs new instance of the font with specified parameters
                                 * @param params parameters of the font
                                 */
                                constructor(params: FontDescription);
                                /**
                                 * Draws text on the canvas using created font
                                 * @param canvas [[android.graphics.Canvas]] instance to draw the text on
                                 * @param x x coordinate of the text in pixels
                                 * @param y x coordinate of the text in pixels
                                 * @param text text string to draw
                                 * @param scale additional scale to apply to the text
                                 */
                                drawText(canvas: android.graphics.Canvas, x: number, y: number, text: string, scale: number): void;
                                /**
                                 * Calculates bounds of the text given text position, text string and 
                                 * additional scale
                                 * @returns [[android.graphics.Rect]] object containing calculated bounds of 
                                 * the text
                                 */
                                getBounds(text: string, x: number, y: number, scale: number): android.graphics.Rect;
                                /**
                                 * Calculates text width given text string and additional scale
                                 * @returns width of the specified string when painted with specified 
                                 * scale
                                 */
                                getTextWidth(text: string, scale: number): number;
                                /**
                                 * Calculates text height given text string and additional scale
                                 * @returns height of the specified string when painted with specified 
                                 * scale
                                 */
                                getTextHeight(text: string, x: number, y: number, scale: number): number;
                                /**
                                 * Converts current [[Font]] object to scriptable font description
                                 */
                                asScriptable(): FontDescription;

                                /* <DMHYT>: "Not sure about these two methods, that I saw in previous docs.
                                I can't see them in sources 0_0" */

                                /**
                                 * Sets listener to be notified about window opening/closing events
                                 */
                                setEventListener(listener: window.IWindowEventListener | UI.WindowEventListener): void;
                                /**
                                 * Sets listener to be notified about tab with specified index opening/closing events
                                 * @param tab tab index
                                 * @param listener object to be notified about the events
                                 */
                                setTabEventListener(tab: number, listener: window.IWindowEventListener | UI.WindowEventListener): void;
                            }
                            /**
                             * Object used to manipulate frame textures. Frame texture allows to 
                             */
                            export class FrameTexture extends java.lang.Object {
                                static class: java.lang.Class<FrameTexture>;
                                /** Specifies bottom left corner of the frame */
                                static readonly CORNER_BOTTOM_LEFT: number;
                                /** Specifies bottom right corner of the frame */
                                static readonly CORNER_BOTTOM_RIGHT: number;
                                /** Specifies top left corner of the frame */
                                static readonly CORNER_TOP_LEFT: number;
                                /** Specifies top right corner of the frame */
                                static readonly CORNER_TOP_RIGHT: number;
                                /** Specifies bottom side of the frame */
                                static readonly SIDE_BOTTOM: number;
                                /** Specifies left side of the frame */
                                static readonly SIDE_LEFT: number;
                                /** Specifies right side of the frame */
                                static readonly SIDE_RIGHT: number;
                                /** Specifies top side of the frame */
                                static readonly SIDE_TOP: number;
                                constructor(source: android.graphics.Bitmap);
                                /**
                                 * Expands side of the texture by specified amount of pixels
                                 * @param sideId side of the texture, one of the 
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**, 
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN** constants
                                 * @returns expanded [[android.graphics.Bitmap]] instance with the frame
                                 */
                                expandSide(sideId: number, pixels: number): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with 
                                 * specified color
                                 * @param color integer color value produced by [[android.graphics.Color]] 
                                 * class
                                 * @param sides array of booleans marking whether the side should be 
                                 * expanded or not. The order of the sides is
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**, 
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN**
                                 * @returns expanded [[android.graphics.Bitmap]] instance with the frame
                                 */
                                expand(width: number, height: number, color: number, sides: [boolean, boolean, boolean, boolean]): android.graphics.Bitmap;
                                expand(width: number, height: number, color: number): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with 
                                 * specified color
                                 * @param scale scale of the created bitmap
                                 * @param color integer color value produced by [[android.graphics.Color]] 
                                 * class
                                 * @param sides array of booleans marking whether the side should be 
                                 * expanded or not. See [[FrameTexture.expand]] parameters for details. 
                                 * Default behavior is to scale all sides
                                 * @returns expanded and scaled [[android.graphics.Bitmap]] instance with
                                 */
                                expandAndScale(width: number, height: number, scale: number, color: number, sides: [boolean, boolean, boolean, boolean]): android.graphics.Bitmap;
                                expandAndScale(width: number, height: number, scale: number, color: number): android.graphics.Bitmap;
                                /**
                                 * @returns original frame texture source stored in 
                                 * [[android.graphics.Bitmap]] instance
                                 */
                                getSource(): android.graphics.Bitmap;
                                /**
                                 * @param side side of the texture, one of the 
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**, 
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN** constants
                                 * @returns texture side source extracted from the original frame 
                                 * texture source stored in [[android.graphics.Bitmap]] instance
                                 */
                                getSideSource(side: number): android.graphics.Bitmap;
                                /**
                                 * @returns [[android.graphics.Color]] integer color value
                                 * of the central pixel of the source texture
                                 */
                                getCentralColor(): number;
                                draw(canvas: android.graphics.Canvas, rect: android.graphics.RectF, scale: number, color: number, sides: [boolean, boolean, boolean, boolean]): void;
                            }
                            export interface Sides { up?: boolean, down?: boolean, left?: boolean, right?: boolean }
                            export class FrameTextureSource extends java.lang.Object {
                                static class: java.lang.Class<FrameTextureSource>;
                                static getFrameTexture(name: string, style: UIStyle): FrameTexture;
                                static scriptableAsSides(obj: Sides): [boolean, boolean, boolean, boolean];
                            }
                            export interface ITouchEventListenerJS {
                                (touchEvent: TouchEvent): void;
                            }
                            export class ITouchEventListener extends java.lang.Object {
                                static class: java.lang.Class<ITouchEventListener>;
                                constructor();
                                constructor(impl: { onTouchEvent: (event: TouchEvent) => void });
                                onTouchEvent(event: TouchEvent): void;
                            }
                            export class Texture extends java.lang.Object {
                                static class: java.lang.Class<Texture>;
                                animation: memory.BitmapWrap[];
                                bitmap: memory.BitmapWrap;
                                delay: number;
                                isAnimation: boolean;
                                /**
                                 * Constructs new static [[Texture]] with specified bitmap
                                 * @param bitmap [[android.graphics.Bitmap]] instance
                                 */
                                constructor(bitmap: android.graphics.Bitmap);
                                /**
                                 * Constructs new animated [[Texture]] with specified frames
                                 * @param bitmaps an array of [[android.graphics.Bitmap]] instances to be 
                                 * used as animation frames
                                 */
                                constructor(bitmaps: android.graphics.Bitmap[]);
                                /**
                                 * Constructs new static or animated [[Texture]] with specified frames
                                 * @param obj texture name or array of texture names for animated 
                                 * textures. Accepts raw gui textures names and style bindings
                                 * (formatted as "style:binding_name"). 
                                 * @param style [[Style]] object to look for style bindings. If not 
                                 * specified, default style is used
                                 */
                                constructor(obj: string | {[key: string]: string}, style?: UIStyle);
                                isAnimated(): boolean;
                                /**
                                 * Sets texture offsets in pixels from the upper left bound of the bitmap
                                 */
                                readOffset(obj: { x?: number, y?: number }): void;
                                /**
                                 * @returns frame number of the animation corresponding to current system time
                                 */
                                getFrame(): number;
                                /**
                                 * @param frame frame number
                                 * @returns [[android.graphics.Bitmap]] object containing animation frame 
                                 * for the corresponding frame number
                                 */
                                getBitmap(frame: number): android.graphics.Bitmap;
                                getBitmapWrap(frame: number): memory.BitmapWrap;
                                draw(canvas: android.graphics.Canvas, x: number, y: number, scale: number): void;
                                drawCutout(canvas: android.graphics.Canvas, cutout: android.graphics.RectF, x: number, y: number, scale: number): void;
                                /**
                                 * @returns width of the texture in pixels
                                 */
                                getWidth(): number;
                                /**
                                 * @returns height of the texture in pixels
                                 */
                                getHeight(): number;
                                /**
                                 * Resizes all the frames of the texture to the specified size
                                 */
                                resizeAll(width: number, height: number): void;
                                /**
                                 * Resizes all the frames by constant scale multiplier
                                 * @param scale scale to modify the frames by
                                 */
                                rescaleAll(scale: number): void;
                                /**
                                 * Resizes all the frames to match the first one
                                 */
                                fitAllToOneSize(): void;
                                /**
                                 * Releases all allocated resources, should be called when the texture 
                                 * is not longer needed 
                                 */
                                release(): void;
                            }
                            export class TouchEvent extends java.lang.Object {
                                static class: java.lang.Class<TouchEvent>;
                                _x: number;
                                _y: number;
                                downX: number;
                                downY: number;
                                localX: number;
                                localY: number;
                                type: TouchEventType;
                                x: number;
                                y: number;
                                constructor(listener: ITouchEventListener | ITouchEventListenerJS);
                                hasMovedSinceLastDown(): boolean;
                                update(event: android.view.MotionEvent): void;
                                preparePosition(win: window.UIWindow, rect: android.graphics.Rect): void;
                                posAsScriptable(): { x: number, y: number };
                                localPosAsScriptable(): { x: number, y: number };
                            }
                            export class TouchEventType extends java.lang.Object {
                                static class: java.lang.Class<TouchEventType>;
                                static readonly DOWN: TouchEventType;
                                static readonly UP: TouchEventType;
                                static readonly MOVE: TouchEventType;
                                static readonly CLICK: TouchEventType;
                                static readonly LONG_CLICK: TouchEventType;
                                static readonly CANCEL: TouchEventType;
                            }
                            /**
                             * Object containing binding names as keys and string values as gui textures
                             * names
                             */
                            export type BindingSet = {[key: string]: string};
                            /**
                             * Object representing window style. Window styles allows to customize the 
                             * way your windows look like
                             */
                            export class UIStyle extends java.lang.Object {
                                static class: java.lang.Class<UIStyle>;
                                /**
                                 * Classic (0.16.*-like) windows style
                                 */
                                static readonly CLASSIC: UIStyle;
                                /**
                                 * Default windows style
                                 */
                                static readonly DEFAULT: UIStyle;
                                static readonly LEGACY: UIStyle;
                                /**
                                 * Adds gui texture name to use for the specified window part
                                 * @param key binding name
                                 * @param name gui texture name
                                 */
                                addBinding(key: string, name: string): void;
                                /**
                                 * Gets texture binding bt its name. Searches first in the additional 
                                 * styles, then in the current style, then in all its parents
                                 * @param key binding name
                                 * @param fallback value to return on binding failure
                                 * @returns gui texture name if current object, additional styles or one 
                                 * of the parents contains such a binding name, fallback otherwise. 
                                 */
                                getBinding(key: string, fallback: string): string;
                                /**
                                 * Adds an additional style object to the current style
                                 * @param style additional style object to be added
                                 */
                                addStyle(style: UIStyle): void;
                                /**
                                 * Constructs new [[UIStyle]] object
                                 * with bindings from [[UIStyle.DEFAULT]]
                                 */
                                constructor();
                                /**
                                 * Constructs new [[UIStyle]] object
                                 * from given [[BindingSet]] object
                                 */
                                constructor(bindings: BindingSet);
                                /**
                                 * @returns a copy of the current style. Only style bindings of the 
                                 * current style are copied, no parent/additional styles are copied
                                 */
                                copy(): UIStyle;
                                /**
                                 * Specifies parent style object for the current style
                                 * @param style style to be set as parent
                                 */
                                inherit(style: UIStyle): void;
                                /**
                                 * Adds all values from given [[BindingSet]] object
                                 */
                                addAllBindings(bindings: BindingSet): void;
                                /**
                                 * @returns [[java.util.Collection]] containing all binding names
                                 * from the current style object
                                 */
                                getAllBindingNames(): java.util.Collection<string>;
                                /**
                                 * If name is a style value (starts with "style:"), returns 
                                 * corresponding gui texture name, else returns input string
                                 * @param name style value or bitmap name
                                 */
                                getBitmapName(name: string): string;
                                getIntProperty(name: string, fallback: number): number;
                                getFloatProperty(name: string, fallback: number): number;
                                getDoubleProperty(name: string, fallback: number): number;
                                getStringProperty(name: string, fallback: string): string;
                                getBooleanProperty(name: string, fallback: boolean): boolean;
                                setProperty(name: string, value: any): void;
                                static getBitmapByDescription(style: UIStyle, description: string): memory.BitmapWrap;
                            }
                        }
                        export module window {
                            export class IWindow extends java.lang.Object {
                                static class: java.lang.Class<IWindow>;
                                constructor();
                                /**
                                 * Constructs new object inherited from
                                 * [[UI.IWindow]].
                                 * You need to implement all the interface methods in the object param.
                                 */
                                constructor(impl: {
                                    close(): void;
                                    frame(frm: number): void;
                                    getContainer(): container.UiAbstractContainer;
                                    getContent(): Nullable<WindowContent>;
                                    getElements(): java.util.HashMap<string, elements.UIElement>;
                                    getStyle(): Nullable<types.UIStyle>;
                                    invalidateDrawing(onCurrentThread: boolean): void;
                                    invalidateElements(onCurrentThread: boolean): void;
                                    isDynamic(): boolean;
                                    isInventoryNeeded(): boolean;
                                    isOpened(): boolean;
                                    onBackPressed(): boolean;
                                    open(): void;
                                    setContainer(container: container.UiAbstractContainer): void;
                                    setDebugEnabled(debug: boolean): void;
                                });
                                /**
                                 * Closes window without container. Use only if the window was opened 
                                 * without container
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * @returns [[UI.Container]]
                                 * that was used to open this window or null, if
                                 * the window wasn't opened in container
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * @returns window's content object
                                 * (usually specified in the window's constructor)
                                 */
                                getContent(): Nullable<WindowContent>;
                                /**
                                 * Gets all the elements in the window
                                 * @returns java.util.HashMap containing string element name as keys and
                                 * element instances as values
                                 */
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                /**
                                 * @returns object containing current style of the window
                                 */
                                getStyle(): Nullable<types.UIStyle>;
                                /**
                                 * Forces ui drawables of the window to refresh
                                 * @param onCurrentThread if true, the drawables will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui elements of the window to refresh
                                 * @param onCurrentThread if true, the elements will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * @returns true if the window can change its contents position
                                 */
                                isDynamic(): boolean;
                                /**
                                 * @returns true if the window has an inventory that should be updated
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns true if the window is opened, false otherwise
                                 */
                                isOpened(): boolean;
                                /**
                                 * @returns whether the window can be closed on pressing back navigation button
                                 */
                                onBackPressed(): boolean;
                                /**
                                 * Opens window without container. It is usually mor
                                 */
                                open(): void;
                                /**
                                 * Sets container for the current window. Be careful when calling it 
                                 * manually. You should prefer opening the window via 
                                 * [[UI.Container.openAs]] call
                                 * @param container [[UI.Container]]
                                 * to be associated with current window or null to associate no container with current window
                                 */
                                setContainer(container: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off
                                 * @param debug if true, additional debug information will be drawn on
                                 * the window canvas
                                 */
                                setDebugEnabled(debug: boolean): void;
                            }
                            export class IWindowEventListener extends java.lang.Object {
                                static class: java.lang.Class<IWindowEventListener>;
                                constructor(implementation: { 
                                    onClose(win: UIWindow): void;
                                    onOpen(win: UIWindow): void;
                                });
                                onClose(win: UIWindow): void;
                                onOpen(win: UIWindow): void;
                            }
                            export class UIAdaptiveWindow extends UIWindowGroup {
                                static class: java.lang.Class<UIAdaptiveWindow>;
                                constructor(content: WindowContent);
                                setContent(content: WindowContent): void;
                                /**
                                 * Sets style profile for the current [[AdaptiveWindow]]
                                 * @param profile 0 for classic profile, 1 for default profile
                                 */
                                setProfile(profile: 0 | 1): void;
                                /**
                                 * Forces [[AdaptiveWindow]] to be displayed using some profile
                                 * @param profile 0 for classic profile, 1 for default profile or -1 not
                                 * to force any profile. By default forced profile is -1
                                 */
                                setForcedProfile(profile: 0 | 1): void;
                                open(): void;
                            }
                            export interface TabbedWindowContent extends WindowContent {
                                isButtonHidden?: boolean
                            }
                            export class UITabbedWindow extends java.lang.Object implements IWindow {
                                static class: java.lang.Class<UITabbedWindow>;
                                closeOnBackPressed: boolean;
                                currentTab: number;
                                /**
                                 * Sets window location (bounds) to draw window within
                                 * @param location location to be used for the tabbed window
                                 */
                                setLocation(location: UIWindowLocation): void;
                                /**
                                 * @returns tab content window width in units
                                 */
                                getInnerWindowWidth(): number;
                                /**
                                 * @returns tab content window height in units
                                 */
                                getInnerWindowHeight(): number;
                                /**
                                 * @returns tab selector window width in units
                                 */
                                getWindowTabSize(): number;
                                /**
                                 * @returns tab selector window width in global units
                                 */
                                getGlobalTabSize(): number;
                                /**
                                 * Constructs new [[UI.TabbedWindow]] with specified location
                                 * @param loc location to be used for the tabbed window
                                 */
                                constructor(loc: UIWindowLocation);
                                /**
                                 * Constructs new [[UI.TabbedWindow]] with specified content
                                 * @param content object containing window description
                                 */
                                constructor(content: TabbedWindowContent);
                                /**
                                 * Sets content of the tab
                                 * @param index index of the tab. There are 12 tabs available, from 0 to
                                 * 11. The location of the tabs is as follows:
                                 * ```
                                 * 0    6
                                 * 1    7
                                 * 2    8
                                 * 3    9
                                 * 4    10
                                 * 5    11
                                 * ```
                                 * @param tabOverlay content of the tab selector
                                 * @param tabContent content of the window to be created for the tab
                                 * @param isAlwaysSelected if true, tab is always displayed as selected.
                                 * Default value is false
                                 */
                                setTab(index: number, tabOverlay: UI.ElementSet, tabContent: WindowContent, isAlwaysSelected: boolean): void;
                                setTab(index: number, tabOverlay: UI.ElementSet, tabContent: WindowContent): void;
                                /**
                                 * Creates fake tab with no content
                                 * @param index index of the tab, see [[TabbedWindow.setTab]] for 
                                 * details
                                 * @param tabOverlay content of the tab selector
                                 */
                                setFakeTab(index: number, tabOverlay: UI.ElementSet): void;
                                /**
                                 * @param index index of the tab
                                 * @returns [[UI.Window]] instance
                                 * created for the specified tab or null if
                                 * no window was created for specified window
                                 */
                                getWindowForTab(index: number): Nullable<UIWindow>;
                                open(): void;
                                close(): void;
                                frame(time: number): void;
                                invalidateElements(onCurrentThread: boolean): void;
                                invalidateDrawing(onCurrentThread: boolean): void;
                                isOpened(): boolean;
                                isInventoryNeeded(): boolean;
                                isDynamic(): boolean;
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                getContent(): Nullable<TabbedWindowContent>;
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                setContainer(con: container.UiAbstractContainer): void;
                                setDebugEnabled(debug: boolean): void;
                                setEventListener(listener: IWindowEventListener): void;
                                setTabEventListener(index: number, listener: IWindowEventListener): void;
                                onTabSelected(index: number): void;
                                /**
                                 * Specifies whether the window should darken and block background. 
                                 * Default value is false
                                 * @param b pass true if you want the window to block 
                                 * background
                                 */
                                setBlockingBackground(b: boolean): void;
                                /**
                                 * @returns current default tab index. If no default tab was specified 
                                 * via [[UI.TabbedWindow.setDefaultTab]],
                                 * the first tab added becomes default
                                 */
                                getDefaultTab(): number;
                                /**
                                 * Sets default tab index
                                 * @param tab index of the tab to be opened by default
                                 */
                                setDefaultTab(tab: number): void;
                                /**
                                 * Sets new style object as current window's style. If the new style is
                                 * a different object then an old one, forces window invalidation
                                 * @param style [[UI.Style]] object to be used as style for the window
                                 */
                                setStyle(style: types.UIStyle): void;
                                /**
                                 * Overrides style properties of the current style by the values 
                                 * specified in the style parameter
                                 * @param style js object where keys represent binding names and values
                                 * represent texture gui names
                                 */
                                setStyle(style: types.BindingSet): void;
                                getStyle(): Nullable<types.UIStyle>;
                                getStyleSafe(): types.UIStyle;
                                setCloseOnBackPressed(cobp: boolean): void;
                                onBackPressed(): boolean;
                            }
                            /**
                             * Specifies contents and additional parameters for all types of windows
                             */
                            export interface WindowContent {
                                /**
                                 * Specifies window's location, used for
                                 * [[UI.Window]], [[UI.TabbedWindow]]
                                 * and [[UI.StandartWindow]]
                                 */
                                location?: WindowLocationDescription,
                                /**
                                 * If [[WindowContent.style]] is not specified, 
                                 * this argument will be used instead
                                 */
                                params?: types.BindingSet;
                                /**
                                 * Specifies window's style, an object containing keys as style binding 
                                 * names and values as gui texture names corresponding to the binding
                                 */
                                style?: types.BindingSet;
                                /**
                                 * Array of drawings
                                 */
                                drawing?: UI.DrawingSet;
                                /**
                                 * Object containing keys as gui elements names and [[UI.Elements]] 
                                 * instances as values. Gui elements are interactive components that are
                                 * used to create interfaces functionality
                                 */
                                elements?: UI.ElementSet;
                            }
                            export namespace StandardWindowDescriptionTypes {
                                export interface StandardWindowBackground {
                                    /**
                                     * If true, default window is created
                                     */
                                    standard?: boolean,
                                    /**
                                     * Background color integer value, produced by 
                                     * [[android.graphics.Color]] class. Default is white
                                     */
                                    color?: number,
                                    /**
                                     * Background bitmap texture name. If the bitmap size doesn't
                                     * match the screen size, bitmap will be stretched to fit
                                     */
                                    bitmap?: string,
                                    /**
                                     * Specifies window's frame parameters
                                     */
                                    frame?: {
                                        /**
                                         * Frame bitmap scale. Default value is 3
                                         */
                                        scale?: number,
                                        /**
                                         * Frame bitmap gui texture name. Defaults to *"frame"* 
                                         * style binding or, if not specified, to 
                                         * *"default_frame_8"* gui texture
                                         */
                                        bitmap?: string
                                    }
                                }
                                export interface StandardWindowHeaderText {
                                    /**
                                     * Specifies header text. Defaults to *"No Title"*
                                     */
                                    text?: string,
                                    /**
                                     * Specifies font params for the header text. Only 
                                     * [[size]], [[color]] and [[shadow]]
                                     * properties are used
                                     */
                                    font?: types.FontDescription,
                                    /**
                                     * If [[font]] is not specified, used as
                                     * [[size]] value
                                     */
                                    size?: number,
                                    /**
                                     * If [[font]] is not specified, used as
                                     * [[color]] value
                                     */
                                    color?: number,
                                    /**
                                     * If [[font]] is not specified, used as
                                     * [[shadow]] value
                                     */
                                    shadow?: number,
                                }
                                export interface StandardWindowHeader {
                                    /**
                                     * Specifies whether the header should have shadow or not. If 
                                     * true, the shadow is not displayed. Default is false
                                     */
                                    hideShadow?: boolean,
                                    /**
                                     * Specifies header height in units. Defaults to 80
                                     */
                                    height?: number,
                                    /**
                                     * If *height* is not specified, used to specify header height
                                     * in units
                                     */
                                    width?: number,
                                    /**
                                     * Frame bitmap gui texture name. Defaults to *"headerFrame"* 
                                     * style binding or, if not specified, to 
                                     * *"default_frame_7"* gui texture
                                     */
                                    frame?: string,
                                    /**
                                     * Header background color integer value, produced by 
                                     * [[android.graphics.Color]] class. Default is 
                                     * *Color.rgb(0x72, 0x6a, 0x70)*
                                     */
                                    color?: number,
                                    /**
                                     * Specifies header text styles and value
                                     */
                                    text?: StandardWindowHeaderText
                                    /**
                                     * If true, close button is not displayed. Default is false
                                     */
                                    hideButton?: boolean
                                }
                                export interface StandardWindowInventory {
                                    /**
                                     * Inventory width in units. Defaults to 300 units
                                     */
                                    width?: number,
                                    /**
                                     * Specifies additional padding for the inventory in units. 
                                     * Defaults to 20 units
                                     */
                                    padding?: number,
                                    /**
                                     * If true, default window is created
                                     */
                                    standard?: boolean
                                }
                                export interface StandardWindowParams {
                                    /**
                                     * Specifies minimum contents window height. If actual height is 
                                     * less then desired, scrolling is used
                                     */
                                    minHeight?: number,
                                    /**
                                     * Specifies background properties
                                     */
                                    background?: StandardWindowBackground;
                                    /**
                                     * Specifies additional parameters for standard window's header
                                     */
                                    header?: StandardWindowHeader
                                    /**
                                     * Specifies parameters for standard inventory window
                                     */
                                    inventory?: StandardWindowInventory
                                }
                            }
                            /**
                             * Extended [[WindowContent]] object with additional params for
                             * [[UI.StandartWindow]] and [[UI.StandardWindow]]
                             */                            
                            export interface StandardWindowContent extends WindowContent {
                                /**
                                 * Used for [[UI.StandartWindow]]s and [[UI.StandardWindow]]s.
                                 * Specifies additional parameters for standard windows
                                 */
                                standard?: StandardWindowDescriptionTypes.StandardWindowParams
                            }
                            export class UIWindow extends java.lang.Object implements IWindow {
                                static class: java.lang.Class<UIWindow>;
                                closeOnBackPressed: boolean;
                                content: WindowContent;
                                elementProvider: IElementProvider;
                                elementView: android.widget.ImageView;
                                isBackgroundDirty: boolean;
                                isForegroundDirty: boolean;
                                layout: android.view.ViewGroup;
                                location: UIWindowLocation;
                                updateWindowLocation(): void;
                                constructor(location: UIWindowLocation);
                                constructor(content: WindowContent);
                                /**
                                 * Opens window without container. It is usually mor
                                 */
                                open(): void;
                                /**
                                 * Adds another window as adjacent window, so that several windows open
                                 * at the same time. This allows to divide window into separate parts
                                 * and treat them separately. 
                                 * @param window another window to be added as adjacent
                                 */
                                addAdjacentWindow(window: UIWindow): void;
                                /**
                                 * Removes adjacent window from the adjacent windows list
                                 * @param window another window that was added as adjacent
                                 */
                                removeAdjacentWindow(window: UIWindow): void;
                                preOpen(): void;
                                postOpen(): void;
                                /**
                                 * Closes window without container. Use only if the window was opened 
                                 * without container
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * Forces ui elements of the window to refresh
                                 * @param onCurrentThread if true, the elements will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui drawables of the window to refresh
                                 * @param onCurrentThread if true, the drawables will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * @returns true if the window is opened, false otherwise
                                 */
                                isOpened(): boolean;
                                postElementRefresh(): void;
                                postBackgroundRefresh(): void;
                                forceRefresh(): void;
                                /**
                                 * Specifies whether touch events should be handled by this window or 
                                 * passed to underlying windows (to the game). By default all windows 
                                 * are touchable
                                 * @param touchable pass true if the window should handle touch events, 
                                 * false otherwise
                                 */
                                setTouchable(touchable: boolean): void;
                                /**
                                 * @returns true if the window is touchable, false otherwise
                                 */
                                isTouchable(): boolean;
                                /**
                                 * @returns true if window blocks background
                                 */
                                isBlockingBackground(): boolean;
                                /**
                                 * Specifies whether the window should darken and block background. 
                                 * Default value is false
                                 * @param blockingBackground pass true if you want the window to block 
                                 * background
                                 */
                                setBlockingBackground(blockingBackground: boolean): void;
                                /**
                                 * @returns true if the window is game overlay, false otherwise
                                 */
                                isNotFocusable(): boolean;
                                /**
                                 * Allows window to be displayed as game overlay without blocking 
                                 * Minecraft sounds. Note that this drops window's FPS. Default value is
                                 * false
                                 * @param inGameOverlay if true, the window is opened in PopupWindow 
                                 * to avoid blocking Minecraft sounds
                                 */
                                setAsGameOverlay(inGameOverlay: boolean): void;
                                /**
                                 * Set background color of window
                                 * @param color integer color value (you can specify it using hex value)
                                 */
                                setBackgroundColor(color: number): void;
                                /**
                                 * @returns true if the window has an inventory that should be updated
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns true if the window can change its contents position
                                 */
                                isDynamic(): boolean;
                                /**
                                 * Gets all the elements in the window
                                 * @returns [[java.util.HashMap]] containing string element names
                                 * as keys and element instances as values
                                 */
                                getElements(): java.util.HashMap<String, elements.UIElement>;
                                /**
                                 * @returns window's content object (usually specified in the window's 
                                 * constructor)
                                 */
                                getContent(): WindowContent;
                                /**
                                 * Specifies the content of the window
                                 * @param content content object to be applied to the window
                                 */
                                setContent(content: WindowContent): void;
                                /**
                                 * @param dynamic specify true, if the window contains dynamic 
                                 * (animated) elements, false otherwise. By default all windows are 
                                 * dynamic. Make them static for better performance
                                 */
                                setDynamic(dynamic: boolean): void;
                                /**
                                 * @param inventoryNeeded specify true if the window requires player's 
                                 * inventory. Default value is false
                                 */
                                setInventoryNeeded(inventoryNeeded: boolean): void;
                                invalidateBackground(): void;
                                invalidateForeground(): void;
                                /**
                                 * @returns window's current location object
                                 */
                                getLocation(): UIWindowLocation;
                                getElementProvider(): IElementProvider;
                                getBackgroundProvider(): IBackgroundProvider;
                                getContentProvider(): ContentProvider;
                                /**
                                 * @returns unit size (in pixel) in the window's bounds
                                 */
                                getScale(): number;
                                /**
                                 * @returns object containing current style of the window
                                 */
                                getStyle(): types.UIStyle;
                                /**
                                 * Overrides style properties of the current style by the values 
                                 * specified in the style parameter
                                 * @param style js object where keys represent binding names and values
                                 * represent texture gui names
                                 */
                                setStyle(style: types.BindingSet): void;
                                /**
                                 * Sets new style object as current window's style. If the new style is
                                 * a different object then an old one, forces window invalidation
                                 * @param style [[UI.Style]] object to be used as style for the window
                                 */
                                setStyle(style: types.UIStyle): void;
                                invalidateAllContent(): void;
                                /**
                                 * Gets custom property by its name. Custom properties can be used to
                                 * store some values containing window's current state. Note that these 
                                 * properties are not saved between Inner Core launches
                                 * @param name custom property name
                                 * @returns value set by [[UI.Window.putProperty]]
                                 * or null if no value was specified for this name
                                 */
                                getProperty<T>(name: string): T;
                                /**
                                 * Sets custom property value
                                 * @param name custom property name
                                 * @param value custom property value
                                 */
                                putProperty<T>(name: string, value: T): void;
                                /**
                                 * @returns [[UI.Container]]
                                 * that was used to open this window or null, if
                                 * the window wasn't opened in container
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * Sets container for the current window. Be careful when calling it 
                                 * manually. You should prefer opening the window via 
                                 * [[UI.Container.openAs]] call
                                 * @param container [[UI.Container]]
                                 * to be associated with current window
                                 * or null to associate no container with current window
                                 */
                                setContainer(container: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off
                                 * @param enabled if true, additional debug information will be drawn on
                                 * the window canvas
                                 */
                                setDebugEnabled(enabled: boolean): void;
                                /**
                                 * Sets any window as current window's parent. If current window closes,
                                 * parent window closes too
                                 * @param window window to be used as parent window for the current 
                                 * window
                                 */
                                setParentWindow(parent: IWindow): void;
                                /**
                                 * @returns current window's parent window
                                 */
                                getParentWindow(): Nullable<IWindow>;
                                /**
                                 * Sets listener to be notified about window opening/closing events
                                 */
                                setEventListener(listener: UI.WindowEventListener | IWindowEventListener): void;

                                runCachePreparation(async: boolean): void;
                                /**
                                 * Writes debug information about current window to the log
                                 */
                                debug(): void;
                                /**
                                 * Gives the property to be closed on pressing back navigation button to the given window
                                 */
                                setCloseOnBackPressed(val: boolean): void;
                                /**
                                 * @returns whether the window can be closed on pressing back navigation button
                                 */
                                onBackPressed(): boolean;
                            }
                            export class UIWindowBackgroundDrawable extends android.graphics.drawable.Drawable implements IBackgroundProvider {
                                static class: java.lang.Class<UIWindowBackgroundDrawable>;
                                window: UIWindow;
                                constructor(win: UIWindow);
                                setBackgroundColor(color: number): void;
                                addDrawing(drawing: background.IDrawing): void;
                                clearAll(): void;
                                draw(canvas: NonNullable<android.graphics.Canvas>): void;
                                prepareCache(): void;
                                releaseCache(): void;
                                setAlpha(alpha: number): void;
                                /* Just for TS not to be angry */
                                setColorFilter(par1: number, par2: android.graphics.PorterDuff.Mode): void;
                                setColorFilter(filter: Nullable<android.graphics.ColorFilter>): void;
                                /** @returns -3 */
                                getOpacity(): number;
                            }
                            export class UIWindowElementDrawable extends android.graphics.drawable.Drawable implements IElementProvider, types.ITouchEventListener {
                                static class: java.lang.Class<UIWindowElementDrawable>;
                                isDebugEnabled: boolean;
                                window: UIWindow;
                                windowElements: java.util.ArrayList<elements.UIElement>;
                                constructor(win: UIWindow);
                                setBackgroundProvider(provider: IBackgroundProvider): void;
                                addOrRefreshElement(element: elements.UIElement): void;
                                removeElement(element: elements.UIElement): void;
                                releaseAll(): void;
                                resetAll(): void;
                                invalidateAll(): void;
                                runCachePreparation(): void;
                                getStyleFor(element: elements.UIElement): types.UIStyle;
                                setWindowStyle(style: types.UIStyle): void;
                                draw(canvas: NonNullable<android.graphics.Canvas>): void;
                                drawDirty(canvas: android.graphics.Canvas, scale: number): void;
                                onTouchEvent(event: types.TouchEvent): void;
                                setAlpha(alpha: number): void;
                                /* Just for TS not to be angry */
                                setColorFilter(par1: number, par2: android.graphics.PorterDuff.Mode): void;
                                setColorFilter(filter: Nullable<android.graphics.ColorFilter>): void;
                                /** @returns -3 */
                                getOpacity(): number;
                                toString(): string;
                            }
                            export class UIWindowGroup extends java.lang.Object implements IWindow {
                                static class: java.lang.Class<UIWindowGroup>;
                                closeOnBackPressed: boolean;
                                /**
                                 * Removes window from group by its name
                                 * @param name window name
                                 */
                                removeWindow(name: string): void;
                                /**
                                 * Adds window instance with specified name to the group
                                 * @param name window name
                                 * @param window window to be added to the group
                                 */
                                addWindowInstance(name: string, win: IWindow): void;
                                /**
                                 * Creates a new window using provided description and adds it to the 
                                 * group
                                 * @param name window name
                                 * @param content window description object
                                 * @returns created [[Window]] object
                                 */
                                addWindow(name: string, content: WindowContent): UIWindow;
                                /**
                                 * @param name window name
                                 * @returns window from the group by its name or null if no window with 
                                 * such a name was added
                                 */
                                getWindow(name: string): UIWindow;
                                /**
                                 * @param name window name
                                 * @returns window's description object if a window with specified name 
                                 * exists or null otherwise
                                 */
                                getWindowContent(name: string): Nullable<WindowContent>;
                                /**
                                 * Sets content for the window by its name
                                 * @param name window name
                                 * @param content content object
                                 */
                                setWindowContent(name: string, content: WindowContent): void;
                                /**
                                 * @returns [[java.util.Collection]] object containing all the
                                 * [[UI.Window]]s in the group
                                 */
                                getAllWindows(): java.util.Collection<UIWindow>;
                                /**
                                 * @returns [[java.util.Collection]] object containing string names of the 
                                 * windows in the group
                                 */
                                getWindowNames(): java.util.Collection<string>;
                                /**
                                 * Forces window refresh by its name
                                 * @param name name of the window to refresh
                                 */
                                refreshWindow(name: string): void;
                                /**
                                 * Forces refresh for all windows
                                 */
                                refreshAll(): void;
                                /**
                                 * Moves window with specified name to the top of the group
                                 * @param name window name
                                 */
                                moveOnTop(name: string): void;
                                /**
                                 * Opens window without container. It is usually mor
                                 */
                                open(): void;
                                /**
                                 * Closes window without container. Use only if the window was opened 
                                 * without container
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * @returns true if the window is opened, false otherwise
                                 */
                                isOpened(): boolean;
                                /**
                                 * @returns true if the window has an inventory that should be updated
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns true if the window can change its contents position
                                 */
                                isDynamic(): boolean;
                                /**
                                 * Gets all the elements in the window
                                 * @returns [[java.util.HashMap]] containing string element name
                                 * as keys and element instances as values
                                 */
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                /** @returns null for [[UIWindowGroup]] */
                                getContent(): Nullable<WindowContent>;
                                /**
                                 * @returns [[UI.Container]]
                                 * that was used to open this window or null, if the window wasn't opened in container
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * Sets container for the current window. Be careful when calling it 
                                 * manually. You should prefer opening the window via 
                                 * [[UI.Container.openAs]] call
                                 * @param container [[UI.Container]]
                                 * to be associated with current window or null to associate no container with current window
                                 */
                                setContainer(con: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off
                                 * @param enabled if true, additional debug information will be drawn on
                                 * the window canvas
                                 */
                                setDebugEnabled(debug: boolean): void;
                                invalidateAllContent(): void;
                                setStyle(style: types.UIStyle): void;
                                setStyle(style: types.BindingSet): void;
                                /**
                                 * @returns object containing current style of the window
                                 */
                                getStyle(): types.UIStyle;
                                setBlockingBackground(bb: boolean): void;
                                /**
                                 * Forces ui elements of the window to refresh
                                 * @param onCurrentThread if true, the elements will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui drawables of the window to refresh
                                 * @param onCurrentThread if true, the drawables will be refreshed 
                                 * immediately, otherwise refresh event will be posted. Default value 
                                 * if false. Ensure you are in the UI thread if you pass true as the 
                                 * parameter
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * Gives the property to be closed on pressing back navigation button to the given window group
                                 */
                                setCloseOnBackPressed(val: boolean): void;
                                /**
                                 * @returns whether the window group can be closed on pressing back navigation button
                                 */
                                onBackPressed(): boolean;
                            }
                            export interface IWindowLocation {
                                /**
                                 * X coordinate of the window in units, 0 by default
                                 */
                                x?: number,
                                /**
                                 * Y coordinate of the window in units, 0 by default
                                 */
                                y?: number,
                                /**
                                 * Width of the window in units, by default calculated to match right
                                 * screen bound
                                 */
                                width?: number,
                                /**
                                 * Height of the window in units, by default calculated to match bottom
                                 * screen bound
                                 */
                                height?: number,
                                /**
                                 * Defines scrollable window size along the X axis
                                 */
                                scrollX?: number,
                                /**
                                 * Defines scrollable window size along the Y axis
                                 */
                                scrollY?: number;
                            }
                            /**
                             * Object representing window location used in window content object and 
                             * [[WindowLocation]] constructor
                             */
                            export interface WindowLocationDescription extends IWindowLocation {
                                forceScrollX?: boolean, forceScrollY?: boolean,
                                /**
                                 * Paddings are distances from the window bounds to the elements in the
                                 * window
                                 */
                                padding?: { top?: number, bottom?: number, left?: number, right?: number };
                            }
                            export class UIWindowLocation extends java.lang.Object {
                                static class: java.lang.Class<UIWindowLocation>;
                                /** Constant used to represent bottom padding */
                                static readonly PADDING_BOTTOM: number;
                                /** Constant used to represent left padding */
                                static readonly PADDING_LEFT: number;
                                /** Constant used to represent right padding */
                                static readonly PADDING_RIGHT: number;
                                /** Constant used to represent top padding */
                                static readonly PADDING_TOP: number;
                                forceScrollX: boolean;
                                forceScrollY: boolean;
                                /** Window height */
                                height: number;
                                /** Window scale */
                                scale: number;
                                /** Horizontal window scroll */
                                scrollX: number;
                                /** Vertical window scroll */
                                scrollY: number;
                                /** Window width */
                                width: number;
                                /** Window horizontal position */
                                x: number;
                                /** Window vertical position */
                                y: number;
                                /** Window position on layers */
                                zIndex: number;
                                /**
                                 * Constructs new [[UIWindowLocation]] instance with default position and 
                                 * size (fullscreen window)
                                 */
                                constructor();
                                /**
                                 * Constructs new [[UIWindowLocation]] instance with specified parameters
                                 * @param params 
                                 */
                                constructor(desc: WindowLocationDescription);
                                /**
                                 * Sets scrollable window size. Should be greater then window 
                                 * width/height for the changes to take effect
                                 * @param x scrollable window size along the X axis
                                 * @param y scrollable window size along the Y axis
                                 */
                                setScroll(x: number, y: number): void;
                                /**
                                 * Sets the size of the window 
                                 * @param x window's width
                                 * @param y window's height
                                 */
                                setSize(x: number, y: number): void;
                                /**
                                 * @returns window location as a js object. Note that paddings are not 
                                 * included into the object
                                 */
                                asScriptable(): IWindowLocation;
                                /**
                                 * Creates a copy of current [[WindowLocation]] object
                                 * @returns newly created copy of the object
                                 */
                                copy(): UIWindowLocation;
                                /**
                                 * Sets window location parameters
                                 * @param x X coordinate of the window
                                 * @param y Y coordinate of the window
                                 * @param width width of the window
                                 * @param height height of the window
                                 */
                                set(x: number, y: number, width: number, height: number): void;
                                /**
                                 * Sets window location parameters from another [[WindowLocation]]. 
                                 * Note that paddings are not copied
                                 * instance
                                 * @param location another [[WindowLocation]] instance to copy 
                                 * parameters from
                                 */
                                set(location: UIWindowLocation): void;
                                /**
                                 * Sets window's scroll size to the windows size to remove scroll
                                 */
                                removeScroll(): void;
                                /**
                                 * Sets padding of the window
                                 * @param padding one of the [[UIWindowLocation.PADDING_TOP]], 
                                 * [[UIWindowLocation.PADDING_BOTTOM]], [[UIWindowLocation.PADDING_LEFT]],
                                 * [[UIWindowLocation.PADDING_RIGHT]] constants
                                 * @param value value of the padding to be assigned to appropriate 
                                 * window bound
                                 */
                                setPadding(padding: 0 | 1 | 2 | 3, value: number): void;
                                /**
                                 * Sets the four paddings of the window for the appropriate bounds
                                 */
                                setPadding(top: number, bottom: number, left: number, right: number): void;
                                /**
                                 * @returns unit size (in pixels) in the fullscreen context (*screen width / 1000*)
                                 */
                                getScale(): number;
                                /**
                                 * @returns unit size (in pixels) in the window's bounds
                                 */
                                getDrawingScale(): number;
                                /**
                                 * @returns window's rectangle in the [[android.graphics.Rect]] object
                                 */
                                getRect(): android.graphics.Rect;
                                showPopupWindow(win: android.widget.PopupWindow): void;
                                updatePopupWindow(win: android.widget.PopupWindow): void;
                                getLayoutParams(a1: number, a2: number, a3: number): android.view.WindowManager.LayoutParams;
                                setupAndShowPopupWindow(win: android.widget.PopupWindow): void;
                                /**
                                 * Sets window's Z index. Z index determines how the window will be 
                                 * displayed when several windows are open
                                 * @param z window Z index
                                 */
                                setZ(z: number): void;
                                /**
                                 * @returns window's width in units
                                 * (always 1000 by definition of the unit)
                                 */
                                getWindowWidth(): 1000;
                                /**
                                 * @returns window's height in units
                                 */
                                getWindowHeight(): number;
                                /**
                                 * Transforms dimension in fullscreen units to the dimension within
                                 * window's bounds
                                 * @param val value to be transformed
                                 */
                                globalToWindow(val: number): number;
                                /**
                                 * Transforms dimension within window's bounds to the dimension in 
                                 * fullscreen units
                                 * @param val value to be transformed
                                 */
                                windowToGlobal(val: number): number;
                            }
                            export abstract class UIWindowStandard extends UIWindowGroup {
                                static class: java.lang.Class<UIWindowStandard>;
                                constructor(content: StandardWindowContent);
                                getContent(): StandardWindowContent;
                                getStyleSafe(): types.UIStyle;
                                setContent(content: StandardWindowContent): void;
                            }
                            export class WindowParent extends java.lang.Object {
                                static class: java.lang.Class<WindowParent>;
                                static openWindow(window: UIWindow): void;
                                static closeWindow(window: UIWindow): void;
                                static applyWindowInsets(window: UIWindow, insets: android.view.WindowInsets): void;
                                static releaseWindowLayout(layout: android.view.View): void;
                            }
                            export class WindowProvider extends java.lang.Object {
                                static class: java.lang.Class<WindowProvider>;
                                static readonly instance: WindowProvider;
                                static getFrame(): number;
                                onWindowOpened(window: IWindow): void;
                                onWindowClosed(window: IWindow): void;
                                onBackPressed(): boolean;
                                onActivityStopped(): void;
                            }
                        }
                    }
                    export module util {
                        export class ConfigVisualizer extends java.lang.Object {
                            static class: java.lang.Class<ConfigVisualizer>;
                            /**
                             * Constructs new [[ConfigVisualizer]] instance with specified elements 
                             * names prefix
                             * @param config configuration file to be loaded
                             * @param prefix elements names prefix used for this visualizer
                             */
                            constructor(config: innercore.mod.build.Config, prefix: string);
                            /**
                             * Constructs new [[ConfigVisualizer]] instance with default elements 
                             * names prefix (*config_vis*)
                             * @param config configuration file to be loaded
                             */
                            constructor(config: innercore.mod.build.Config);
                            /**
                             * Removes all elements with current element name prefix. In other 
                             * words, removes all elements that were created by this 
                             * [[ConfigVisualizer]] instance
                             * @param elements target [[WindowContent.elements]] section
                             */
                            clearVisualContent(elements: UI.ElementSet): void;
                            /**
                             * Creates elements in the window to visualize configuration file
                             * @param elements target [[WindowContent.elements]] section
                             * @param prefs top left position of the first element. Default position 
                             * is (0, 0, 0)
                             */
                            createVisualContent(elements: UI.ElementSet, prefs?: Partial<Vector>): void;
                        }
                        export class ScriptableWatcher extends java.lang.Object {
                            static class: java.lang.Class<ScriptableWatcher>;
                            object: object;
                            constructor(obj: object);
                            isDirty(): boolean;
                            validate(): void;
                            invalidate(): void;
                            setTarget(obj: object): void;
                            refresh(): void;
                            toString(): string;
                        }
                    }
                }
                /**
                 * Class representing item extra data. Used to store additional information 
                 * about item other then just item id and data
                 */
                export class NativeItemInstanceExtra extends java.lang.Object {
                    static class: java.lang.Class<NativeItemInstanceExtra>;
                    static constructClone(pointer: number): number;
                    static initSaverId(): void;
                    isFinalizableInstance(): boolean;
                    /**
                     * Creates an [[NativeItemInstanceExtra]] Java object instance
                     * from given native item extra data object pointer,
                     * represented as 64-bit integer (long)
                     */
                    constructor(pointer: number);
                    /**
                     * Creates an empty [[NativeItemInstanceExtra]] instance
                     */
                    constructor();
                    /**
                     * Creates a new [[NativeItemInstanceExtra]] instance
                     * and copies all data from another extra object given
                     */
                    constructor(other: NativeItemInstanceExtra);

                    asJson(): org.json.JSONObject;
                    /**
                     * Creates a copy of current [[NativeItemInstanceExtra]] object
                     * @returns a created copy of the data
                     */
                    copy(): NativeItemInstanceExtra;
                    getValue(): number;
                    /**
                     * @returns true, if item extra exists and is not empty
                     */
                    isEmpty(): boolean;
                    applyTo(item: ItemInstance): void;
                    /**
                     * @returns true if the item is enchanted, false otherwise
                     */
                    isEnchanted(): boolean;
                    /**
                     * Adds a new enchantment to the item
                     * @param type enchantment id, one of the [[EEnchantment]] constants
                     * @param level enchantment level, generally between 1 and 5
                     */
                    addEnchant(type: number, level: number): void;
                    /**
                     * @param type enchantment id, one of the [[EEnchantment]] constants
                     * @returns level of the specified enchantment
                     */
                    getEnchantLevel(type: number): number;
                    /**
                     * Removes enchantments by its id
                     * @param id enchantment id, one of the [[EEnchantment]] constants
                     */
                    removeEnchant(type: number): void;
                    /**
                     * Removes all the enchantments of the item
                     */
                    removeAllEnchants(): void;
                    /**
                     * @returns amount of enchantments applied to the item
                     */
                    getEnchantCount(): number;
                    /**
                     * @param id enchantment id, one of the [[EEnchantment]] constants
                     * @param level enchantment level, generally between 1 and 5
                     * @returns enchantment name by its id and level
                     */
                    getEnchantName(id: number, level: number): string;
                    getRawEnchants(): number[][];
                    getEnchants(): {[id: number]: number};
                    /**
                     * @returns all enchantments names separated by line breaks
                     */
                    getAllEnchantNames(): string;
                    getAllCustomData(): string;
                    setAllCustomData(data: string): void;
                    /**
                     * @returns item's custom name
                     */
                    getCustomName(): string;
                    /**
                     * Sets item's custom name
                     */
                    setCustomName(name: string): void;
                    /**
                     * @returns compound tag for the specified item
                     * @deprecated temporarily disabled
                     */
                    getCompoundTag(): Nullable<NBT.CompoundTag>;
                    /**
                     * Sets compound tag for the specified item
                     * @deprecated temporarily disabled
                     */
                    setCompoundTag(ent: number, tag: NBT.CompoundTag): void;
                    putObject(name: string, value: java.lang.Object): NativeItemInstanceExtra;
                    /**
                     * Puts some custom string parameter to the extra data of the item
                     * @param name parameter name
                     * @param value parameter value
                     * @returns reference to itself to be used in sequential calls
                     */
                    putString(name: string, value: string): NativeItemInstanceExtra;
                    /**
                     * Puts some custom integer parameter to the extra data of the item
                     * @param name parameter name
                     * @param int parameter value
                     * @returns reference to itself to be used in sequential calls
                     */
                    putInt(name: string, int: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom long integer parameter to the extra data of the item
                     * @param name parameter name
                     * @param long parameter value
                     * @returns reference to itself to be used in sequential calls
                     */
                    putLong(name: string, long: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom floating point number parameter to the extra data of the item
                     * @param name parameter name
                     * @param float parameter value
                     * @returns reference to itself to be used in sequential calls
                     */
                    putFloat(name: string, float: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom boolean parameter to the extra data of the item
                     * @param name parameter name
                     * @param bool parameter value
                     * @returns reference to itself to be used in sequential calls
                     */
                    putBoolean(name: string, bool: boolean): NativeItemInstanceExtra;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't 
                     * contain a parameter with specified name
                     * @returns custom string parameter value if extra data of the item contains
                     * one, fallback value otherwise.
                     * If fallback was not specified, null is returned.
                     */
                    getString(name: string, fallback?: string): Nullable<string>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't 
                     * contain a parameter with specified name
                     * @returns custom integer parameter value if extra data of the item contains
                     * one, fallback value otherwise.
                     * If fallback was not specified, null is returned.
                     */
                    getInt(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't 
                     * contain a parameter with specified name
                     * @returns custom long integer parameter value if extra data of the item contains
                     * one, fallback value otherwise.
                     * If fallback was not specified, null is returned.
                     */
                    getLong(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't 
                     * contain a parameter with specified name
                     * @returns custom float parameter value if extra data of the item contains
                     * one, fallback value otherwise.
                     * If fallback was not specified, null is returned.
                     */
                    getFloat(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't 
                     * contain a parameter with specified name
                     * @returns custom boolean parameter value if extra data of the item contains
                     * one, fallback value otherwise.
                     * If fallback was not specified, null is returned.
                     */
                    getBoolean(name: string, fallback?: boolean): Nullable<boolean>;
                    putSerializable(name: string, serializableObject: any): NativeItemInstanceExtra;
                    getSerializable(name: string): any;
                    /**
                     * Removes all custom parameters from item extra data
                     */
                    removeCustomData(): void;
                    toString(): string;
                    static unwrapObject(extra: any): Nullable<NativeItemInstanceExtra>;
                    static unwrapValue(extra: any): number;
                    static getValueOrNullPtr(extra: NativeItemInstanceExtra): number;
                    static getExtraOrNull(extraPointer: number): Nullable<NativeItemInstanceExtra>;
                    static cloneExtra(extra: Nullable<NativeItemInstanceExtra>): Nullable<NativeItemInstanceExtra>;
                    static fromJson(json: org.json.JSONObject): Nullable<NativeItemInstanceExtra>;
                }
                export class NativeRenderer extends java.lang.Object {
                    static class: java.lang.Class<NativeRenderer>;
                    static createHumanoidRenderer(d: number): NativeRenderer.Renderer;
                    static createItemSpriteRenderer(id: number): NativeRenderer.Renderer;
                    static createRendererWithSkin(skin: string, d: number): NativeRenderer.Renderer;
                    static getRendererById(id: number): Nullable<NativeRenderer.Renderer>;
                }
                export module NativeRenderer {
                    export class FinalizeCallback extends java.lang.Object {
                        static class: java.lang.Class<FinalizeCallback>;
                        onFinalized(renderer: Renderer): void;
                    }
                    export type FinalizeCallbackJS = (renderer: Renderer) => void;
                    export class Model extends java.lang.Object {
                        static class: java.lang.Class<Model>;
                        /**
                         * Clears all parts of the model
                         */
                        clearAllParts(): void;
                        /**
                         * @param partName part name
                         * @returns part by its name or null if part doesn't exist
                         */
                        getPart(partName: string): Nullable<ModelPart>;
                        /**
                         * @param partName part name
                         * @returns true if part with specified name exists in the model, 
                         * false otherwise
                         */
                        hasPart(partName: string): boolean;
                        /**
                         * Resets the model
                         */
                        reset(): void;
                    }
                    export class ModelPart extends java.lang.Object {
                        static class: java.lang.Class<ModelPart>;
                        /**
                         * Adds a new box to the part on the specified coordinates (relative to 
                         * the part's coordinates) of the specified size (width, height, length)
                         */
                        addBox(x: number, y: number, z: number, w: number, h: number, l: number): void;
                        /**
                         * Adds a new box to the part on the specified coordinates (relative to 
                         * the part's coordinates) of the specified size (width, height, length)
                         * @param add additional size to be added from all the six sizes of the 
                         * box
                         */
                        addBox(x: number, y: number, z: number, w: number, h: number, l: number, add: number): void;
                        /**
                         * Creates a new part with specified name. If a part with specified name
                         * already exists, returns the existing part
                         * @param name name of the part to create or return
                         */
                        addPart(name: string): ModelPart;
                        /**
                         * Clears the contents of the part
                         */
                        clear(): void;
                        /**
                         * @returns [[NativeRenderMesh]] specified via [[setMesh]] call or null, if 
                         * this part doesn't contain mesh
                         */
                        getMesh(): Nullable<NativeRenderMesh>;
                        /**
                         * Specifies [[NativeRenderMesh]] to be used as a part
                         */
                        setMesh(mesh: Nullable<NativeRenderMesh>): void;
                        /**s
                         * Specifies part default offset
                         */
                        setOffset(offsetX: number, offsetY: number, offsetZ: number): void;
                        /**
                         * Specifies part rotation
                         */
                        setRotation(rotationX: number, rotationY: number, rotationZ: number): void;
                        /**
                         * Specifies texture uv offset
                         */
                        setTextureOffset(u: number, v: number): void;
                        /**
                         * Specifies texture uv offset
                         * @param placeholder deprecated boolean parameter
                         */
                        setTextureOffset(u: number, v: number, placeholder: boolean): void;
                        /**
                         * Specifies texture size size, use the real texture file size or change 
                         * it to stretch texture
                         */
                        setTextureSize(w: number, h: number): void;
                        /**
                         * Specifies texture size size, use the real texture file size or change 
                         * it to stretch texture
                         * @param placeholder deprecated boolean parameter
                         */
                        setTextureSize(w: number, h: number, placeholder: boolean): void;
                    }
                    export class RenderPool extends java.lang.Object {
                        static class: java.lang.Class<RenderPool>;
                        constructor();
                        constructor(factory: IFactory | IFactoryJS);
                        getRender(): Renderer;
                    }
                    export module RenderPool {
                        export type IFactory = NativeRenderer.IFactory
                    }
                    export class IFactory extends java.lang.Object {
                        static class: java.lang.Class<IFactory>;
                        newRender(): Renderer;
                        constructor();
                        constructor(impl: {
                            newRender: () => Renderer
                        });
                    }
                    export type IFactoryJS = () => Renderer;
                    export class Renderer extends java.lang.Object {
                        static class: java.lang.Class<Renderer>;
                        isHumanoid: boolean;
                        transform: Transform;
                        constructor(pointer: number);
                        addFinalizeCallback(callback: FinalizeCallback | FinalizeCallbackJS): void;
                        getModel(): Model;
                        getPointer(): number;
                        getRenderType(): number;
                        getScale(): number;
                        release(): void;
                        setFinalizeable(finalizeable: boolean): void;
                        setScale(scale: number): void;
                        setSkin(skin: string): void;
                    }
                    export module Renderer {
                        type Transform = NativeRenderer.Transform;
                    }
                    class Transform extends java.lang.Object {
                        static class: java.lang.Class<Transform>;
                        /**
                         * Clears all the transformations applied to the render
                         * @returns reference to itself to be used in sequential calls
                         */
                        clear(): Transform;
                        /**
                         * @returns reference to itself to be used in sequential calls
                         */
                        lock(): Transform;
                        /**
                         * Performs arbitrary matrix transformations on the render
                         * @returns reference to itself to be used in sequential calls
                         */
                        matrix(m00: number, m01: number, m02: number, m03: number,
                                m10: number, m11: number, m12: number, m13: number,
                                m20: number, m21: number, m22: number, m23: number,
                                m30: number, m31: number, m32: number, m33: number): Transform;
                        /**
                         * Rotates render along three axes
                         * @returns reference to itself to be used in sequential calls
                         */
                        rotate(rotX: number, rotY: number, rotZ: number): Transform;
                        /**
                         * Scales render along the three axes
                         * @returns reference to itself to be used in sequential calls
                         */
                        scale(scaleX: number, scaleY: number, scaleZ: number): Transform;
                        /**
                         * Translates render along three axes
                         * @returns reference to itself to be used in sequential calls
                         */
                        translate(x: number, y: number, z: number): Transform;
                        /**
                         * @returns reference to itself to be used in sequential calls
                         */
                        unlock(): Transform;
                    }
                    export class SpriteRenderer extends Renderer {
                        static class: java.lang.Class<SpriteRenderer>;
                    }
                }
                export class NativeRenderMesh extends java.lang.Object {
                    static class: java.lang.Class<NativeRenderMesh>;
                    /**
                     * Adds new mesh to the current one on the specified coordinates with specified scale
                     * @param mesh [[NativeRenderMesh]] object to be added to current mesh
                     */
                    addMesh(mesh: NativeRenderMesh): void;
                    addMesh(mesh: NativeRenderMesh, addX: number, addY: number, addZ: number): void;
                    addMesh(mesh: NativeRenderMesh, addX: number, addY: number, addZ: number, scaleX: number, scaleY: number, scaleZ: number): void;
                    /**
                     * Adds a new vertex on the specified coordinates
                     */
                    addVertex(x: number, y: number, z: number): void;
                    /**
                     * Adds a new vertex on the specified coordinates
                     * @param u x texture offset of the vertex
                     * @param v y texture offset of the vertex
                     */
                    addVertex(x: number, y: number, z: number, u: number, v: number): void;
                    /**
                     * Removes all vertices of the mesh
                     */
                    clear(): void;
                    /**
                     * Creates a copy of current [[NativeRenderMesh]]
                     */
                    clone(): NativeRenderMesh;
                    /**
                     * Scales the mesh to fit into the specified box
                     */
                    fitIn(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void;
                    /**
                     * Scales the mesh to fit into the specified box
                     * @param keepRatio if true, the ratio of the dimensions are preserved
                     */
                    fitIn(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, keepRatio: boolean): void;
                    /**
                     * @returns pointer to the native object instance of the
                     * following [[NativeRenderMesh]], represented as long number
                     */
                    getPtr(): number;
                    getReadOnlyVertexData(): NativeRenderMesh.ReadOnlyVertexData;
                    /**
                     * Imports mesh file using specified path
                     * @param path path to the mesh file. Path should be absolute path or
                     * be relative to the resources folder or to the "models/" folder
                     * @param type file type to read mesh from. The only currently supported mesh file 
                     * type is "obj"
                     * @param params additional import parameters or null, if not needed
                     */
                    importFromFile(path: string, type: "obj", importParams: Nullable<NativeRenderMesh.ImportParams>): void;
                    invalidate(): void;
                    newGuiRenderMesh(): mod.ui.GuiRenderMesh;
                    /**
                     * Forces Minecraft to rebuild specified [[NativeRenderMesh]] object
                     */
                    rebuild(): void;
                    /**
                     * Resets color applied to the mesh. Default is white
                     */
                    resetColor(): void;
                    /**
                     * Resets texture of the mesh
                     */
                    resetTexture(): void;
                    /**
                     * Rotates the mesh around the specified coordinates
                     * @param rotX rotation angle along X axis, in radians
                     * @param rotY rotation angle along Y axis, in radians
                     * @param rotZ rotation angle along Z axis, in radians
                     */
                    rotate(x: number, y: number, z: number, rotX: number, rotY: number, rotZ: number): void;
                    /**
                     * Rotates the mesh around the (0, 0, 0) coordinates
                     * @param rotX rotation angle along X axis, in radians
                     * @param rotY rotation angle along Y axis, in radians
                     * @param rotZ rotation angle along Z axis, in radians
                     */
                    rotate(rotX: number, rotY: number, rotZ: number): void;
                    /**
                     * Scales the whole mesh along the three axis
                     */
                    scale(x: number, y: number, z: number): void;
                    /**
                     * Specifies block texture to be used by mesh
                     */
                    setBlockTexture(textureName: string, textureMeta: number): void;
                    /**
                     * Specifies color to be applied to the next vertices. If the color is not white and 
                     * the texture is applied to mesh, texture's colors will be affected
                     */
                    setColor(r: number, g: number, b: number): void;
                    setColor(r: number, g: number, b: number, a: number): void;
                    /**
                     * Makes specified [[NativeRenderMesh]] foliage tinted
                     */
                    setFoliageTinted(): void;
                    setFoliageTinted(tintSource: number): void;
                    /**
                     * Makes specified [[NativeRenderMesh]] grass tinted
                     */
                    setGrassTinted(): void;
                    /**
                     * Sets following [[NativeRenderMesh]] light direction
                     */
                    setLightDir(x: number, y: number, z: number): void;
                    setLightIgnore(ignore: boolean, bool2: boolean): void;
                    setLightParams(float1: number, float2: number, float3: number): void;
                    /**
                     * Sets following [[NativeRenderMesh]] light position
                     */
                    setLightPos(x: number, y: number, z: number): void;
                    /**
                     * Removes any tint from specified [[NativeRenderMesh]]
                     */
                    setNoTint(): void;
                    /**
                     * Specifies the normal vector for the next vertices
                     */
                    setNormal(x: number, y: number, z: number): void;
                    /**
                     * Makes specified [[NativeRenderMesh]] water tinted
                     */
                    setWaterTinted(): void;
                    /**
                     * Translates the whole mesh along three axis
                     */
                    translate(x: number, y: number, z: number): void;
                }
                export module NativeRenderMesh {
                    export class ReadOnlyVertexData {
                        static class: java.lang.Class<ReadOnlyVertexData>;
                        readonly colors: native.Array<number>;
                        readonly dataSize: number;
                        readonly indices: native.Array<number>;
                        readonly uvs: native.Array<number>;
                        readonly vertices: native.Array<number>;
                        private constructor(dataSize: number);
                    }
                    /**
                     * Object used in [[NativeRenderMesh.importFromFile]] and one of [[NativeRenderMesh]] constructors.
                     * Here you can put some additional parameters, that will be applied to the mesh,
                     * when the file is being imported
                     */
                    export interface ImportParams {
                        /**
                         * If true, all existing vertices of the mesh are deleted
                         * before the file is imported
                         */
                        clear?: boolean,
                        /**
                         * If true, v of the texture is inverted
                         */
                        invertV: boolean,
                        /**
                         * Additional translation along x, y and z axis
                         */
                        translate?: [number, number, number],
                        /**
                         * Additional scale along x, y and z axis
                         */
                        scale?: [number, number, number],
                        /**
                         * If true, Minecraft won't be forced to rebuild the following [[NativeRenderMesh]]
                         * before the file is imported
                         */
                        noRebuild: boolean
                    }
                }
                export module unlimited {
                    export class BlockShape extends java.lang.Object {
                        static class: java.lang.Class<BlockShape>;
                        x1: number;
                        x2: number;
                        y1: number;
                        y2: number;
                        z1: number;
                        z2: number;
                        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
                        constructor();
                        set(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void;
                        setToBlock(id: number, data: number): void;
                    }
                    interface IBlockVariant extends Block.BlockVariation { isTech?: boolean }
                    export class BlockVariant extends java.lang.Object {
                        static class: java.lang.Class<BlockVariant>;
                        readonly data: number;
                        readonly inCreative: boolean;
                        isTechnical: boolean;
                        readonly name: string;
                        renderType: number;
                        shape: BlockShape;
                        readonly textureIds: number[];
                        readonly textures: string[];
                        readonly uid: number;
                        constructor(uid: number, data: number, name: string, textures: string[], textureIds: number[], inCreative: boolean);
                        constructor(uid: number, data: number, object: IBlockVariant);
                        getGuiBlockModel(): mod.ui.GuiBlockModel;
                        getSpriteTexturePath(): string;
                    }
                }
            }
            export module mod {
                export module build {
                    /**
                     * Json configuration file reading/writing utility
                     */
                    export class Config extends java.lang.Object {
                        static class: java.lang.Class<Config>;
                        /**
                         * Creates new [[Config]] instance using specified file
                         * @param file [[java.io.File]] instance of the file to use
                         */
                        constructor(file: java.io.File);
                        /**
                         * Creates new [[Config]] instance using specified file
                         * @param path path to configuration file
                         */
                        constructor(path: string);
                        /**
                         * Writes configuration JSON to the file
                         */
                        save(): void;
                        /**
                         * @returns [[java.util.ArrayList]] instance containing
                         * all the names in the current config file 
                         */
                        getNames(): java.util.ArrayList<string>;
                        /**
                         * Gets property from the config
                         * 
                         * Example: 
                         * ```ts
                         * config.get("generation.ore_copper.max_height");
                         * ```
                         * 
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns [[Config]] instance with current config as parent if the 
                         * property is object, [[org.json.JSONArray]] instance if the property is an 
                         * array, raw type if the property is of that raw type, null otherwise
                         */
                        get<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(name: string): T;
                        /**
                         * Same as [[Config.get]]
                         */
                        access<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(name: string): T;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns boolean config value specified in config or false if no value was
                         * specified
                         */
                        getBool(name: string): boolean;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns java number object instance, containing numeric value by given name
                         * from the config, or 0 if no value was specified
                         */
                        getNumber(name: string): java.lang.Number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns integer of value by given name from the config, or 0 if no value was specified
                         */
                        getInteger(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns floating point number of value by given name from the config, or 0.0 if no value was specified
                         */
                        getFloat(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns double number of value by given name from the config, or 0.0 if no value was specified
                         */
                        getDouble(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns string by given name from the config, or null if no value was specified
                         */
                        getString(name: string): Nullable<string>;
                        /**
                         * Sets config value. Do not use [[org.json.JSONObject]] instances to create 
                         * nested objects, consider using dot-separated names instead
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @param val value, may be [[org.json.JSONArray]] instance, 
                         * [[org.json.JSONObject]] instance or raw data type
                         */
                        set<T = org.json.JSONObject | org.json.JSONArray | boolean | number | string>(name: string, val: T): boolean;
                        /**
                         * @param name option name, supports multi-layer calls, separated by '.'
                         * @returns editable [[Config.ConfigValue]] instance that can be used to 
                         * manipulate this config option separately
                         */
                        getValue(path: string): Nullable<Config.ConfigValue>;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern
                         * @param jsonstr string representation of JSON object representing the data pattern
                         */
                        checkAndRestore(jsonstr: string): void;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern
                         * @param jsonobj javascript object representing the data pattern checkAndRestore
                         */
                        checkAndRestore(jsonobj: {[key: string]: any}): void;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern
                         * @param data [[org.json.JSONObject]] instance to be used as data pattern
                         */
                        checkAndRestore(json: org.json.JSONObject): void;
                    }
                    export module Config {
                        /**
                         * Class representing config value with its path withing Config object
                         */
                        export class ConfigValue extends java.lang.Object {
                            static class: java.lang.Class<ConfigValue>;
                            /**
                             * Sets config value and saves configuration file
                             * @param value value, may be [[org.json.JSONArray]] instance, 
                             * [[org.json.JSONObject]] instance or raw data type
                             */
                            set<T = org.json.JSONArray | org.json.JSONObject | boolean | number | string>(val: T): void;
                            /**
                             * @returns config value, result is the same as the result of 
                             * [[Config.get]] call
                             */
                            get<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(): T;
                            /**
                             * @returns readable config value name
                             * representation along with class name
                             */
                            toString(): string;
                        }
                    }
                }
                export module resource {
                    export module pack {
                        export class IResourcePack extends java.lang.Object {
                            static class: java.lang.Class<IResourcePack>;
                            getAbsolutePath(): string;
                            getPackName(): string;
                            constructor();
                            constructor(impl: {
                                getAbsolutePath: () => string;
                                getPackName: () => string;
                            });
                        }
                        export class ResourcePack extends java.lang.Object implements IResourcePack {
                            static class: java.lang.Class<ResourcePack>;
                            isLoaded: boolean;
                            resourceFiles: java.util.ArrayList<types.ResourceFile>;
                            constructor(dir: string);
                            getAbsolutePath(): string;
                            getPackName(): string;
                            readAllFiles(): void;
                        }
                    }
                    export class ResourcePackManager extends java.lang.Object {
                        static class: java.lang.Class<ResourcePackManager>;
                        static readonly LOGGER_TAG = "INNERCORE-RESOURCES";
                        static instance: ResourcePackManager;
                        resourcePackDefinition: string;
                        resourcePackList: string;
                        resourceStorage: ResourceStorage;
                        constructor();
                        static getBlockTextureName(texture: string, meta: number): Nullable<string>;
                        static getItemTextureName(texture: string, meta: number): Nullable<string>;
                        static getSourcePath(): string;
                        static isValidBlockTexture(texture: string, meta: number): boolean;
                        static isValidItemTexture(texture: string, meta: number): boolean;
                        initializeResources(): void;
                    }
                    export class ResourceStorage extends java.lang.Object implements pack.IResourcePack {
                        static class: java.lang.Class<ResourceStorage>;
                        static readonly VANILLA_RESOURCE = "resource_packs/vanilla/";
                        animationList: org.json.JSONArray;
                        blockTexttureDescriptor: types.TextureAtlasDescription;
                        itemTextureDescriptor: types.TextureAtlasDescription;
                        textureList: org.json.JSONArray;
                        static addTextureToLoad(path: string): void;
                        static loadAllTextures(): void;
                        static nativeAddTextureToLoad(path: string): void;
                        addResourceFile(textureType: types.enums.TextureType, resource: horizon.modloader.resource.directory.Resource): void;
                        build(): void;
                        getAbsolutePath(): string;
                        getId(): string;
                        getLinkedFilePath(link: string): string;
                        getPackName(): string;
                    }
                    export module types {
                        export module enums {
                            export class AnimationType extends java.lang.Object {
                                static class: java.lang.Class<AnimationType>;
                                static readonly TEXTURE: AnimationType;
                                static readonly DESCRIPTOR: AnimationType;
                            }
                            export class FileType extends java.lang.Object {
                                static class: java.lang.Class<FileType>;
                                static readonly RAW: FileType;
                                static readonly JSON: FileType;
                                static readonly EXECUTABLE: FileType;
                                static readonly MANIFEST: FileType;
                                static readonly TEXTURE: FileType;
                                static readonly ANIMATION: FileType;
                                static readonly INVALID: FileType;
                            }
                            export class ParseError extends java.lang.Object {
                                static class: java.lang.Class<ParseError>;
                                static readonly ANIMATION_INVALID_DELAY: ParseError;
                                static readonly ANIMATION_INVALID_FILE: ParseError;
                                static readonly ANIMATION_INVALID_JSON: ParseError;
                                static readonly ANIMATION_INVALID_NAME: ParseError;
                                static readonly ANIMATION_NAME_MISSING: ParseError;
                                static readonly ANIMATION_TILE_MISSING: ParseError;
                                static readonly NONE: ParseError;
                                toString(): string;
                            }
                            export class TextureType extends java.lang.Object {
                                static class: java.lang.Class<TextureType>;
                                static readonly BLOCK: TextureType;
                                static readonly DEFAULT: TextureType;
                                static readonly GUI: TextureType;
                                static readonly ITEM: TextureType;
                                static readonly PARTICLE: TextureType;
                            }
                        }
                        export class ResourceFile extends java.io.File {
                            static class: java.lang.Class<ResourceFile>;
                            constructor(rp: pack.IResourcePack, file: java.io.File);
                            constructor(path: NonNullable<string>);
                            getAnimationType(): enums.AnimationType;
                            getLocalDir(): string;
                            getLocalPath(): string;
                            getParseError(): enums.ParseError;
                            getResourcePack(): pack.IResourcePack;
                            getTextureType(): enums.TextureType;
                            getType(): enums.FileType;
                            setResourcePack(rp: pack.IResourcePack): void;
                        }
                        export class TextureAnimationFile extends ResourceFile {
                            static class: java.lang.Class<TextureAnimationFile>;
                            constructor(rfile: ResourceFile);
                            constructor(path: NonNullable<string>);
                            constructAnimation(): org.json.JSONObject;
                            isValid(): boolean;
                        }
                        export class TextureAtlasDescription extends java.lang.Object {
                            static class: java.lang.Class<TextureAtlasDescription>;
                            jsonObject: org.json.JSONObject;
                            textureData: org.json.JSONObject;
                            constructor(path: string);
                            constructor(json: org.json.JSONObject);
                            addTextureFile(file: java.io.File, name: string): void;
                            addTexturePath(path: string, meta: number, name: string): void;
                            getTextureCount(texture: string): number;
                            getTextureName(texture: string, meta: number): string;
                        }
                    }
                }
            }
        }
    }
}

/**
 * Json configuration file reading/writing utility
 */
 declare class Config extends com.zhekasmirnov.innercore.mod.build.Config {
    static class: java.lang.Class<Config>;
}

declare namespace Config {
    /**
     * Class representing config value with its path withing Config object
     */
    class ConfigValue extends com.zhekasmirnov.innercore.mod.build.Config.ConfigValue {
        static class: java.lang.Class<ConfigValue>;
    }
}

declare namespace Mod {
	/** 0 - RELEASE, 1 - DEVELOP */
	type BuildType = number;

	/** 0 - RESOURCE, 1 - GUI */
	type ResourceDirType = number;

	/** 0 - PRELOADER, 1 - LAUNCHER, 2 - MOD, 3 - CUSTOM, 4 - LIBRARY */
	type SourceType = number;

	interface BuildConfig {
		buildableDirs: java.util.ArrayList<BuildConfig.BuildableDir>;
		defaultConfig: BuildConfig.DefaultConfig;
		javaDirectories: java.util.ArrayList<BuildConfig.DeclaredDirectory>;
		nativeDirectories: java.util.ArrayList<BuildConfig.DeclaredDirectory>;
		resourceDirs: java.util.ArrayList<BuildConfig.ResourceDir>;
		sourcesToCompile: java.util.ArrayList<BuildConfig.Source>;
		save(file: java.io.File): void;
		save(): void;
		isValid(): boolean;
		validate(): void;
		read(): boolean;
		getBuildType(): BuildType;
		getDefaultAPI(): any;
		getName(): string;
		getAllSourcesToCompile(useApi: boolean): java.util.ArrayList<BuildConfig.Source>;
		findRelatedBuildableDir(source: BuildConfig.Source): BuildConfig.BuildableDir;
	}

	namespace BuildConfig {
		interface DeclaredDirectory {
			readonly path: string;
			readonly version: any;
			getFile(root: java.io.File): java.io.File;
		}
		interface DefaultConfig {
			apiInstance: any;
			behaviorPacksDir: Nullable<string>;
			buildType: BuildType;
			readonly gameVersion: any;
			json: org.json.JSONObject;
			libDir: Nullable<string>;
			optimizationLevel: number;
			resourcePacksDir: Nullable<string>;
			setupScriptDir: Nullable<string>;
			setAPI(api: any): void;
			setOptimizationLevel(level: number): void;
			setBuildType(type: BuildType): void;
			setLibDir(dir: string): void;
			setMinecraftResourcePacksDir(dir: string): void;
			setMinecraftBehaviorPacksDir(dir: string): void;
			setSetupScriptDir(dir: string): void;
		}
		interface BuildableDir {
			dir: string;
			json: org.json.JSONObject;
			targetSource: string;
			setDir(dir: string): void;
			setTargetSource(dir: string): void;
			isRelatedSource(source: Source): boolean;
		}
		interface ResourceDir {
			readonly gameVersion: any;
			json: org.json.JSONObject;
			resourceType: ResourceDirType;
			setPath(path: string): void;
			setResourceType(type: ResourceDirType): void;
		}
		interface Source {
			apiInstance: any;
			readonly gameVersion: any;
			json: org.json.JSONObject;
			optimizationLevel: number;
			path: string;
			sourceName: string;
			sourceType: SourceType;
			setPath(path: string): void;
			setSourceName(sourceName: string): void;
			setSourceType(type: SourceType): void;
			setOptimizationLevel(level: number): void;
			setAPI(api: any): void;
		}
	}

	interface CompiledSources {
		saveSourceList(): void;
		getCompiledSourceFilesFor(name: string): java.io.File[];
		addCompiledSource(name: string, file: java.io.File, className: string): void;
		getTargetCompilationFile(sourcePath: string): java.io.File;
		reset(): void;
	}

	interface ModJsAdapter {
		buildConfig: BuildConfig;
		config: Config;
		dir: string;
		isEnabled: boolean;
		isModRunning: boolean;
		setModPackAndLocation(pack: ModPack.ModPack, locationName: string): void;
		getModPack(): ModPack.ModPack;
		getModPackLocationName(): string;
		getConfig(): Config;
		createCompiledSources(): CompiledSources;
		onImport(): void;
		getBuildType(): BuildType;
		setBuildType(type: BuildType): void;
		setBuildType(type: "release" | "develop"): void;
		getGuiIcon(): string;
		getName(): string;
		getVersion(): string;
		isClientOnly(): boolean;
		isConfiguredForMultiplayer(): boolean;
		getMultiplayerName(): string;
		getMultiplayerVersion(): string;
		getFormattedAPIName(): string;
		getInfoProperty(name: string): java.lang.Object;
		RunPreloaderScripts(): void;
		RunLauncherScripts(): void;
		RunMod(additionalScope: any): void;
		configureMultiplayer(name: string, version: string, isClientOnly: boolean): void;
		runCustomSource(name: string, additionalScope: any): void;

		/**
		 * Other methods and properties
		 */
		[key: string]: any
	}
}

declare namespace ModPack {
	/**
	 * Crutch to replace ModPackManifest.DeclaredDirectoryType enum
	 * 0 - RESOURCE,
	 * 1 - USER_DATA,
	 * 2 - CONFIG,
	 * 3 - CACHE,
	 * 4 - INVALID 
	 */
	type ModPackDeclaredDirectoryType = number;

	/**
	 * Crutch to replace ModPackDirectory.DirectoryType enum
	 * 0 - MODS,
	 * 1 - MOD_ASSETS,
	 * 2 - ENGINE,
	 * 3 - CONFIG,
	 * 4 - CACHE,
	 * 5 - RESOURCE_PACKS,
	 * 6 - BEHAVIOR_PACKS,
	 * 7 - TEXTURE_PACKS,
	 * 8 - CUSTOM
	 */
	type ModPackDirectoryType = number;

	interface ModPack {
		addDirectory(directory: ModPackDirectory): ModPack;
		getRootDirectory(): java.io.File;
		getManifestFile(): java.io.File;
		getIconFile(): java.io.File;
		getManifest(): ModPackManifest;
		getPreferences(): ModPackPreferences;
		getJsAdapter(): ModPackJsAdapter;
		reloadAndValidateManifest(): boolean;
		getAllDirectories(): java.util.List<ModPackDirectory>;
		getDirectoriesOfType(type: ModPackDirectoryType): java.util.List<ModPackDirectory>;
		getDirectoryOfType(type: ModPackDirectoryType): ModPackDirectory;
		getRequestHandler(type: ModPackDirectoryType): DirectorySetRequestHandler;
	}

	interface ModPackManifest {
		loadJson(json: org.json.JSONObject): void;
		loadInputStream(stream: java.io.InputStream): void;
		loadFile(file: java.io.File): void;
		getPackName(): string;
		getDisplayedName(): string;
		getVersionName(): string;
		getVersionCode(): number;
		getDescription(): string;
		getAuthor(): string;
		getDeclaredDirectories(): java.util.List<ModPackDeclaredDirectory>;
		createDeclaredDirectoriesForModPack(pack: ModPack): java.util.List<ModPackDirectory>;
		setPackName(name: string): void;
		setDisplayedName(name: string): void;
		setVersionCode(code: number): void;
		setVersionName(name: string): void;
		setAuthor(author: string): void;
		setDescription(descr: string): void;
		edit(): ModPackManifestEditor;
	}

	interface ModPackManifestEditor {
		addIfMissing(key: string, value: any): ModPackManifestEditor;
		put(key: string, value: any): ModPackManifestEditor;
		commit(): void;
	}

	interface ModPackPreferences {
		getModPack(): ModPack;
		getFile(): java.io.File;
		reload(): ModPackPreferences;
		save(): ModPackPreferences;
		getString(key: string, fallback: string): string;
		getInt(key: string, fallback: number): number;
		getLong(key: string, fallback: number): number;
		getDouble(key: string, fallback: number): number;
		getBoolean(key: string, fallback: boolean): boolean;
		setString(key: string, value: string): ModPackPreferences;
		setInt(key: string, value: number): ModPackPreferences;
		setLong(key: string, value: number): ModPackPreferences;
		setDouble(key: string, value: number): ModPackPreferences;
		setBoolean(key: string, value: boolean): ModPackPreferences;
	}

	interface ModPackDirectory {
		assureDirectoryRoot(): boolean;
		assignToModPack(pack: ModPack): void;
		getType(): ModPackDirectoryType;
		getLocation(): java.io.File;
		getPathPattern(): string;
		getPathPatternRegex(): java.util.regex.Pattern;
		getLocalPathFromEntry(entryName: string): string;
		getRequestStrategy(): DirectoryRequestStrategy;
		getUpdateStrategy(): DirectoryUpdateStrategy;
		getExtractStrategy(): DirectoryExtractStrategy;
	}

	interface DirectorySetRequestHandler {
		getDirectories(): java.util.List<ModPackDirectory>;
		add(dir: ModPackDirectory): void;
		get(location: string, name: string): java.io.File;
		get(location: string): java.io.File;
		getAllAtLocation(location: string): java.util.List<java.io.File>;
		getAllLocations(): java.util.List<string>;
	}

	interface ModPackDeclaredDirectory {
		readonly path: string;
		readonly type: ModPackDeclaredDirectoryType;
		getPath(): string;
		getType(): ModPackDeclaredDirectoryType;
	}

	interface IDirectoryAssignable {
		assignToDirectory(dir: ModPackDirectory): void;
		getAssignedDirectory(): ModPackDeclaredDirectory;
	}

	interface DirectoryRequestStrategy extends IDirectoryAssignable {
		get(str: string): java.io.File;
		get(str: string, str2: string): java.io.File;
		getAll(str: string): java.util.List<java.io.File>;
		getAllLocations(): java.util.List<string>;
		assure(location: string, name: string): java.io.File;
		remove(location: string, name: string): boolean;
		getAllFiles(): java.util.List<java.io.File>;
	}

	interface DirectoryUpdateStrategy extends IDirectoryAssignable {
		beginUpdate(): void;
		finishUpdate(): void;
		updateFile(str: string, stream: java.io.InputStream): void;
	}

	interface DirectoryExtractStrategy extends IDirectoryAssignable {
		getEntryName(str: string, file: java.io.File): string;
		getFilesToExtract(): java.util.List<java.io.File>;
		getFullEntryName(file: java.io.File): string;
	}

	/**
	 * Interface representing ModPack
	 */
	interface ModPackJsAdapter {
		getModPack(): ModPack;
		getRootDirectory(): java.io.File;
		getRootDirectoryPath(): string;
		getModsDirectoryPath(): string;
		getManifest(): ModPackManifest;
		getPreferences(): ModPackPreferences;
		getRequestHandler(type: string): DirectorySetRequestHandler;
		getAllDirectories(): ModPackDirectory[];
		getDirectoriesOfType(type: string): ModPackDirectory[];
		getDirectoryOfType(type: string): ModPackDirectory;
	}
}

/**
 * Java object of the mod, contains some useful values and methods
 */
declare var __mod__: Mod.ModJsAdapter;

/**
 * Mod name
 */
declare var __name__: string;

/**
 * Full path to the mod's directory, ends with "/"
 */
declare var __dir__: string;

/**
 * Main mod configuration manager, settings are stored in config.json file. For
 * more information about config.json, see {@page Mod Configuration Files}
 */
declare var __config__: Config;

/**
 * Full path to current Horizon pack directory
 */
declare var __packdir__: string;

/**
 * Full path to current Inner Core modpack directory
 */
declare var __modpack__: ModPack.ModPackJsAdapter;

/**
 * Object representing the set of coordinates in the three-dimensional world
 */
interface Vector {
    x: number,
    y: number,
    z: number
}

/**
 * Object representing coordinate set with side data
 */
interface BlockPosition extends Vector {
    /**
     * Side of the block, one of the [[Native.BlockSide]] constants
     */
    side: number
}

/**
 * Class used to define block models that depend on surrounding blocks. Some 
 * examples of such blocks are wires, pipes, block structure parts, etc.
 */
declare namespace ICRender {
	/**
	 * Used to specify that the block should be present to satisfy condition
	 */
	const MODE_INCLUDE = 0;

	/**
	 * Used to specify that the block should be absent to satisfy condition
	 */
	const MODE_EXCLUDE = 1;

	/**
	 * @param name group name
	 * @returns block group by its name, if no group with specified name exist,
	 * this function creates a new one
	 */
	function getGroup(name: string): ICRender.Group;

	/**
	 * Creates a new group with a unique name
	 */
	function getUnnamedGroup(): ICRender.Group;

	/**
	 * Groups (of blocks) are used to determine some render conditions. E.g. 
	 * if a block exists on some relative coordinates, display some part of the 
	 * model
	 */
	interface Group {
		/**
		 * @returns group's name
		 */
		getName(): string,
		
		name: string;

		/**
		 * Adds a block to the group
		 * @param id block id
		 * @param data block data or -1 to use with all registered data values
		 */
		add(id: number, data: number): void
	}

	class Model {
		/**
		 * Constructs a base model that will be displayed 
		 * @param model optional model to be added without additional conditions
		 */
		constructor(model?: BlockRenderer.Model);

		/**
		 * Adds block model as an entry to the [[ICRender]]. You can then call 
		 * [[RenderEntry.asCondition]] to specify when to display the entry
		 * @returns created [[RenderEntry]] object
		 */
		addEntry(model?: BlockRenderer.Model): RenderEntry;

		/**
		 * Adds render mesh as an entry to the [[ICRender]]. You can then call 
		 * [[RenderEntry.asCondition]] to specify when to display the entry
		 * @returns created [[RenderEntry]] object
		 */
		addEntry(mesh?: RenderMesh): RenderEntry;
	}

	/**
	 * Object representing render entry with its displaying condition
	 */
	interface RenderEntry {
		/**
		 * @returns [[Model]] object this entry belongs to
		 */
		getParent(): Model;

		/**
		 * Sets [[BLOCK]] condition with specified parameters. Uses coordinates 
		 * that are relative to current block's ones
		 * @param group group name or object
		 * @param mode one of the [[MODE_INCLUDE]] and [[MODE_EXCLUDE]] constants
		 * @returns reference to itself to be used in sequential calls
		 */
		asCondition(x: number, y: number, z: number, group: Group | string, mode: number): RenderEntry;

		/**
		 * Sets [[BLOCK]] condition with specified parameters. Uses coordinates 
		 * that are relative to current block's ones. Creates a new anonymous
		 * group with single block
		 * @param id condition block id
		 * @param data condition block data
		 * @param mode one of the [[MODE_INCLUDE]] and [[MODE_EXCLUDE]] constants
		 * @returns reference to itself to be used in sequential calls
		 */
		asCondition(x: number, y: number, z: number, id: number, data: number, mode: number): RenderEntry;

		/**
		 * Sets condition to be used for current entry
		 * @returns reference to itself to be used in sequential calls
		 */
		setCondition(condition: CONDITION): RenderEntry;

		/**
		 * Sets block model used for the entry, specifying its coordinates
		 * @returns reference to itself to be used in sequential calls
		 */
		setModel(x: number, y: number, z: number, model: BlockRenderer.Model): RenderEntry;

		/**
		 * Sets block model used for the entry
		 * @returns reference to itself to be used in sequential calls
		 */
		setModel(model: BlockRenderer.Model): RenderEntry;

		/**
		 * Sets render mesh to be used for the entry
		 * @returns reference to itself to be used in sequential calls
		 */
		setMesh(mesh: RenderMesh): RenderEntry;
	}

	/**
	 * Class representing custom collision shapes used for block
	 */
	class CollisionShape {
		/**
		 * Adds new entry to the collision shape. You can then call 
		 * [[CollisionEntry.setCondition]] to specify when to display the entry
		 */
		addEntry(): CollisionEntry;
	}

	/**
	 * Object representing collision shape entry with its displaying condition
	 */
	interface CollisionEntry {
		/**
		 * Adds new collision box to collision entry
		 */
		addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): CollisionEntry;

		/**
		 * Sets condition, all the boxes of the entry work only if the condition is true
		 */
		setCondition(condition: CONDITION): CollisionEntry;
	}

	/**
	 * Common superclass for all condition classes
	 */
	abstract class CONDITION { }

	/**
	 * Condition depending on random value
	 */
	class RANDOM_CONDITION implements CONDITION {
		/**
		 * Forces engine to treat blocks along some axis in same way if enabled
		 * parameter value is false
		 * @param axis 0 fpr x, 1 for y, 2 for z axis
		 */
		setAxisEnabled(axis: number, enabled: boolean): RANDOM_CONDITION;
	}

	/**
	 * Constructs new [[RANDOM]] condition
	 * @param value value that a generated random integer number should be for the 
	 * condition to evaluate as true
	 * @param max maximum value for the generator
	 * @param seed seed to be used for random numbers generation
	 */
	function RANDOM(value: number, max: number, seed?: number): CONDITION;

	/**
	 * Constructs new [[RANDOM]] condition with default seed and 0 as 
	 * desired random value
	 * @param max maximum value for the generator
	 */
	function RANDOM(max: number): CONDITION;

	/**
	 * Constructs new [[BLOCK]] condition
	 * @param x is relative x coordinate
	 * @param y is relative y coordinate
	 * @param z is relative z coordinate
	 * @param group blocks group to check the condition for
	 * @param exclude if true, the blocks from the group make the condition 
	 * evaluate as false, as true otherwise
	 */
	function BLOCK(x: number, y: number, z: number, group: ICRender.Group, exclude: boolean): CONDITION;

	/**
	 * Constructs new [[NOT]] condition
	 * @param condition condition to be inverted
	 */
	function NOT(condition: CONDITION): CONDITION;

	/**
	 * Constructs new [[OR]] condition
	 */
	function OR(...conditions: CONDITION[]): CONDITION;

	/**
	 * Constructs new [[AND]] condition
	 */
	function AND(...conditions: CONDITION[]): CONDITION;
}

/**
 * Class representing a set of vertices with some other parameters required to
 * display them correctly. Used as block, entity and item models, in animations 
 * and actually anywhere you need some physical shape
 */
declare class RenderMesh extends com.zhekasmirnov.innercore.api.NativeRenderMesh {
    /**
     * Creates a new [[RenderMesh]] and initializes it from file. 
     * See [[importFromFile]] method description for parameters details
     */
    constructor(path: string, type: string, params: Nullable<RenderMesh.ImportParams>);
    /**
     * Creates a new empty [[RenderMesh]]
     */
    constructor();
}

declare namespace RenderMesh { type ImportParams = com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams }

/**
 * Interface providing access to native tile entities - chests, hoppers, furnaces,
 * smelters, etc. See full lists of supported native tile entities in the 
 * [[Native.TileEntityType]] enum
 */
declare interface NativeTileEntity {
    /**
     * @returns native tile entity type constant, one of the [[Native.TileEntityType]]
     * constants
     */
    getType(): number,

    /**
     * @returns slots count for the specified native tile entity
     */
    getSize(): number,

    /**
     * @param slot slot number
     * @returns item instance in the specified slot of item TE
     */
    getSlot(slot: number): ItemInstance,

    /**
     * Sets the contents of a native tile entity's slot
     * @param slot slot number
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra data
     */
    setSlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * Sets the contents of a native tile entity's slot
     * @param slot slot number
     * @param item item information
     */
    setSlot(slot: number, item: ItemInstance): void;

    /**
     * @returns compound tag associated with specified native tile entity
     */
    getCompoundTag(): NBT.CompoundTag;

    /**
     * Sets compound tag for the specified tile entity
     */
    setCompoundTag(tag: NBT.CompoundTag): void;
}

/**
 * NBT (Named Binary Tag) is a tag based binary format designed to carry large 
 * amounts of binary data with smaller amounts of additional data. You can get
 * or set nbt tags of [[Entity]] (entities), [[NativeTileEntity]] 
 * (native tile entities, such as chests or beacons) and [[ItemExtraData]] 
 * (items). To get more information about these data structures, 
 * see [this page](http://web.archive.org/web/20110723210920/http://www.minecraft.net/docs/NBT.txt)
 */
declare namespace NBT {
    /**
     * List tags represent NBT map-like data structure (key-value pairs). Its values may
     * be of any type, so check the type before calling the appropriate getter
     */
    class CompoundTag {
        /**
         * Creates a new compound tag
         */
        constructor();

        /**
         * Creates a copy of specified compound tag
         */
        constructor(tag: CompoundTag);

        /**
         * Converts compound tag to JavaScript object for easier reading
         * @returns valid JavaScript representation of compound tag
         */
        toScriptable(): { [key: string]: any };

        /**
         * @returns Java-array containing all the keys of the compound tag
         */
        getAllKeys(): native.Array<string>;

        /**
         * @returns true if specified key exists in compound tag
         */
        contains(key: string): boolean;

        /**
         * @param key key to verify for the type
         * @param type tag type to verify for, one of the [[Native.NbtDataType]] constants
         * @returns true if specified key exists in compound tag and its value is
         * of specified type
         */
        containsValueOfType(key: string, type: number): boolean;

        /**
         * @returns value type for the specified key. One of the [[Native.NbtDataType]] 
         * constants
         */
        getValueType(key: string): number;

        /**
         * @returns NBT tag of byte type by its key
         */
        getByte(key: string): number;

        /**
         * @returns NBT tag of short type by its key
         */
        getShort(key: string): number;

        /**
         * @returns NBT tag of 32-bit integer type by its key
         */
        getInt(key: string): number;

        /**
         * @returns NBT tag of 64-bit integer type by its key
         */
        getInt64(key: string): number;

        /**
         * @returns NBT tag of float type by its key
         */
        getFloat(key: string): number;

        /**
         * @returns NBT tag of double type by its key
         */
        getDouble(key: string): number;

        /**
         * @returns NBT tag of string type by its key
         */
        getString(key: string): string;

        /**
         * @returns NBT tag of compound type by its key. Note that a copy of 
         * existing compound tag is created so you cannot edit it directly. Use 
         * setCompoundTag method to apply changes or use 
         * [[CompoundTag.getCompoundTagNoClone]] to edit it directly
         */
        getCompoundTag(key: string): NBT.CompoundTag;

        /**
         * @returns directly editable NBT tag of byte type by its key. Don't save
         * reference for future usage since they get destroyed when the parent 
         * object is destroyed
         */
        getCompoundTagNoClone(key: string): NBT.CompoundTag;

        /**
         * @returns NBT tag of list type by its key. Note that a copy of 
         * existing list tag is created so you cannot edit it directly. Use 
         * setCompoundTag method to apply changes or use 
         * [[CompoundTag.getListTagNoClone]] to edit it directly
         */
        getListTag(key: string): NBT.ListTag;

        /**
         * @returns directly editable NBT tag of byte type by its key. Don't save
         * reference for future usage since they get destroyed when the parent 
         * object is destroyed
         */
        getListTagNoClone(key: string): NBT.ListTag;

        /**
         * Puts value of byte type into compound tag
         */
        putByte(key: string, value: number): void;

        /**
         * Puts value of short type into compound tag
         */
        putShort(key: string, value: number): void;

        /**
         * Puts value of 32-bit integer type into compound tag
         */
        putInt(key: string, value: number): void;

        /**
         * Puts value of 64-bit integer type into compound tag
         */
        putInt64(key: string, value: number): void;

        /**
         * Puts value of float type into compound tag
         */
        putFloat(key: string, value: number): void;

        /**
         * Puts value of double type into compound tag
         */
        putDouble(key: string, value: number): void;

        /**
         * Puts value of string type into compound tag
         */
        putString(key: string, value: string): void;

        /**
         * Puts value of compound type into compound tag
         */
        putCompoundTag(key: string, value: CompoundTag): void;

        /**
         * Puts value of list type into compound tag
         */
        putListTag(key: string, value: ListTag): void;

        /**
         * Removes tag by its key
         */
        remove(key: string): void;

        /**
         * Removes all the tags from the compound tags
         */
        clear(): void;
    }

    /**
     * List tags represent NBT array-like indexed data structure. Its values may
     * be of any type, so check the type before calling the appropriate getter
     */
    class ListTag {
        /**
         * Creates a new list tag
         */
        constructor();

        /**
         * Creates a copy of specified list tag
         */
        constructor(tag: CompoundTag);

        /**
         * Converts list tag to JavaScript object for easier reading
         * @returns valid JavaScript representation of list tag
         */
        toScriptable(): any[];

        /**
         * @returns count of the tags in the list tag
         */
        length(): number;

        /**
         * @returns value type for the specified index. One of the [[Native.NbtDataType]] 
         * constants
         */
        getValueType(index: number): number;

        /**
         * @returns NBT tag of byte type by its index
         */
        getByte(index: number): number;

        /**
         * @returns NBT tag of short type by its index
         */
        getShort(index: number): number;

        /**
         * @returns NBT tag of 32-bit integer type by its index
         */
        getInt(index: number): number;

        /**
         * @returns NBT tag of 64-bit integer type by its index
         */
        getInt64(index: number): number;

        /**
         * @returns NBT tag of float type by its index
         */
        getFloat(index: number): number;

        /**
         * @returns NBT tag of double type by its index
         */
        getDouble(index: number): number;

        /**
         * @returns NBT tag of string type by its index
         */
        getString(index: number): string;

        /**
         * @returns NBT tag of compound type by its index. Note that a copy of 
         * existing compound tag is created so you cannot edit it directly. Use 
         * setCompoundTag method to apply changes or use 
         * [[CompoundTag.getCompoundTagNoClone]] to edit it directly
         */
        getCompoundTag(index: number): NBT.CompoundTag;

        /**
         * @returns directly editable NBT tag of byte type by its index. Don't save
         * reference for future usage since they get destroyed when the parent 
         * object is destroyed
         */
        getCompoundTagNoClone(index: number): NBT.CompoundTag;

        /**
         * @returns NBT tag of list type by its index. Note that a copy of 
         * existing list tag is created so you cannot edit it directly. Use 
         * setCompoundTag method to apply changes or use 
         * [[CompoundTag.getListTagNoClone]] to edit it directly
         */
        getListTag(index: number): NBT.ListTag;

        /**
         * @returns directly editable NBT tag of byte type by its index. Don't save
         * reference for future usage since they get destroyed when the parent 
         * object is destroyed
         */
        getListTagNoClone(index: number): NBT.ListTag;

        /**
         * Puts value of byte type into list tag
         */
        putByte(index: number, value: number): void;

        /**
         * Puts value of short type into list tag
         */
        putShort(index: number, value: number): void;

        /**
         * Puts value of 32-bit integer type into list tag
         */
        putInt(index: number, value: number): void;

        /**
         * Puts value of 64-bit integer type into list tag
         */
        putInt64(index: number, value: number): void;

        /**
         * Puts value of float type into list tag
         */
        putFloat(index: number, value: number): void;

        /**
         * Puts value of double type into list tag
         */
        putDouble(index: number, value: number): void;

        /**
         * Puts value of string type into list tag
         */
        putString(index: number, value: string): void;

        /**
         * Puts value of compound type into list tag
         */
        putCompoundTag(index: number, value: CompoundTag): void;

        /**
         * Puts value of list type into list tag
         */
        putListTag(index: number, value: ListTag): void;

        /**
         * Removes all the tags from the compound tags
         */
        clear(): void;
    }
}
/**
 * New module to work with client and server packets in multiplayer.
 */
declare namespace Network {
    /**
     * @returns array containing connected clients
     */
    function getConnectedClients(): native.Array<NetworkClient>;

    /**
     * @returns array containing connected players uids
     */
    function getConnectedPlayers(): native.Array<number>;

    /**
     * @returns Client object for player by player's entity id
     */
    function getClientForPlayer(player: number): NetworkClient;

    /**
     * Event that is called when a client receives a packet with given name
     * @param name name of the packet
     */
    function addClientPacket<T extends object>(name: string, func: (packetData: T) => void): void;

    /**
     * Event that is called when server receives a packet with the specified name from client
     * @param name name of the packet
     */
    function addServerPacket<T extends object>(name: string, func: (client: NetworkClient, data: T) => void): void;

    /**
     * Sends packet object with specified name to all clients
     */
    function sendToAllClients(name: string, packetData: object): void;

    /**
     * Sends packet object with the specified name from client to server
     */
    function sendToServer(name: string, packetData: object): void;

    /**
     * Sends message to all players
     * @param message text of the message
     */
    function sendServerMessage(message: string): void;

    /**
     * Converts item or block id from server to local value
     */
    function serverToLocalId(id: string | number): number;

    /**
     * Converts item or block id from local to server value
     */
    function localToServerId(id: string | number): number;

    function inRemoteWorld(): boolean;
}

/**
 * Class that represents network client
 */
declare class NetworkClient {

    /**
     * Sends given packet to the following client
     * @param name name of the packet to send
     * @param packetData packet data object
     */
    send(name: string, packetData: object): void;

    /**
     * @returns unique numeric entity ID of the player
     */
    getPlayerUid(): number;

    getDisconnectCause(): java.io.IOException;

    getDisconnectPacket(): string;

    /**
     * Sends a packet to the client with a text like a system message
     */
    sendMessage(message: string): void;

    /**
     * Disconnects player from the server and sends a packet with given reason
     */
    disconnect(reason: string): void;

    /**
     * Disconnects player from the server with no further information
     */
    disconnect(): void;

}
/**
 * Class to work with definite couple of clients,
 * bound by certain conditions
 */
declare class NetworkConnectedClientList {
    /**
     * @param addToGlobalRefreshList if true, the object will be added to the
     * global list for updating periodically, default is true
     */
    constructor(addToGlobalRefreshList: boolean);
    constructor();

    /**
     * Condition to bound clients to the list.
     * All clients in a given dimension at a distance of no more than maxDistance from x, y, z
     * @param x X coord of the conditional centre point of the area where clients are located
     * @param y Y coord of the conditional centre point of the area where clients are located
     * @param z Z coord of the conditional centre point of the area where clients are located
     * @param dimensionID numeric id of the dimension where clients are located
     * @param maxDistance max distance from the client to the conditional centre, to bound the client to the list
     * @returns the client list itself
     */
    setupDistancePolicy(x: number, y: number, z: number, dimensionID: number, maxDistance: number): NetworkConnectedClientList;

    /**
     * Sends packet to all clients from the following list.
     * @param packetName name of the packet to send
     * @param packetData packet data object
     */
    send(packetName: string, packetData: object): void;

    /**
     * Adds given client to the list
     */
    add(client: NetworkClient): void;

    /**
     * Removes given client from the list
     */
    remove(client: NetworkClient): void;

    /**
     * @returns whether the list contains given client
     */
    contains(client: NetworkClient): boolean;

    /**
     * Sets up policy to add all players to the list
     * @returns the client list itself
     */
    setupAllPlayersPolicy(): NetworkConnectedClientList;

    /**
     * Sets up policy to add all players to the list
     * @param updateRate how many milliseconds will have to pass between list updates
     * @returns the client list itself
     */
    setupAllPlayersPolicy(updateRate: number): NetworkConnectedClientList;

    /**
     * Sets up policy to add players from the same given dimension to the list
     * @param dimensionID numeric id of the dimension where the clients have to be located to be included into the list
     * @param updateRate how many milliseconds will have to pass between list updates
     * @returns the client list itself
     */
    setupAllInDimensionPolicy(dimensionID: number, updateRate: number): NetworkConnectedClientList;

    /**
     * Sets up policy to add players from the same given dimension to the list
     * @param dimensionID numeric id of the dimension where the clients have to be located to be included into the list
     * @returns the client list itself
     */
    setupAllInDimensionPolicy(dimensionID: number): NetworkConnectedClientList;

    /**
     * @returns the iterator across clients' objects that the list consists of
     */
    iterator(): java.util.Iterator<NetworkClient>

}
/**
 * Class that represents network entity of the block, currently is not learned
 */
declare class NetworkEntity {
	constructor(type: NetworkEntityType, context: any);
	remove(): void;
	send(name: string, data: any): void;
	getClients(): NetworkConnectedClientList;
}
/**
 * Class that represents network entity type
 */
declare class NetworkEntityType {
	constructor(name: string);
	setClientListSetupListener(action: (list: NetworkConnectedClientList, target: object, entity) => void): this;
	setClientEntityAddedListener<T = any>(action: (entity: number, packet: any) => T): this;
	setClientEntityRemovedListener(action: (target: any, entity: number) => void): this;
	setClientAddPacketFactory(action: (target: any, entity: number, client: any) => any): this;
	addClientPacketListener(name: string, action: (target: any, entity: number, packetData: any) => void): this;
}

/**
 * Class to work with values, synchronized between server and all clients
 */
declare class SyncedNetworkData {
    /**
     * @returns value by key
     */
    getInt(key: any, fallback?: number): number;
    /**
     * @returns value by key
     */
    getLong(key: any, fallback?: number): number;
    /**
     * @returns value by key
     */
    getFloat(key: any, fallback?: number): number;
    /**
     * @returns value by key
     */
    getDouble(key: any, fallback?: number): number;
    /**
     * @returns value by key
     */
    getString(key: any, fallback?: string): string;
    /**
     * @returns value by key
     */
    getBoolean(key: any, fallback?: boolean): boolean;
    /**
     * Sets value by key
     */
    putInt(key: any, value: number): void;
    /**
     * Sets value by key
     */
    putLong(key: any, value: number): void;
    /**
     * Sets value by key
     */
    putFloat(key: any, value: number): void;
    /**
     * Sets value by key
     */
    putDouble(key: any, value: number): void;
    /**
     * Sets value by key
     */
    putString(key: any, value: string): void;
    /**
     * Sets value by key
     */
    putBoolean(key: any, value: boolean): void;

    /**
     * Sends changed data values
     */
    sendChanges(): void;

    /**
     * Event that catches changes of any data values.
     * @param networkData - SyncedNetworkData object where the changes had happened;
     * @param isExternalStorage - 
     * false, if change had happened by calling put from this object, 
     * true, if it came by network from other connected data object.
     */
    addOnDataChangedListener(func: (networkData: SyncedNetworkData, isExternalChange: boolean) => void): void;

    /**
     * Adds data validator to the object
     */
    addVerifier(key: any, func: (key: any, newValue: any) => void): void;
}

/**
 * Object representing item instance in the inventory
 */
interface ItemInstance {
    /**
     * Item id
     */
    id: number,

    /**
     * Amount of items of the specified id
     */
    count: number,

    /**
     * Item data value. Generally specifies some property of the item, e.g. 
     * color, material, etc. Defaults to 0, in many cases -1 means "any data 
     * value"
     */
    data: number,

    /**
     * Item extra data. Contains some additional item data such as enchants, 
     * custom item name or some additional properties
     */
    extra?: ItemExtraData
}

/**
 * Array of three or four elements representing item id, count, data and extra respectively. 
 * Uses in block drop functions
 */
type ItemInstanceArray = [number, number, number, ItemExtraData?];

/**
 * Object representing block in the world
 */
interface Tile {
    id: number,
    data: number
}

/**
 * TileEntity is a powerful mechanism that allows for creation of interactive blocks
 * such as chests, furnaces, etc.
 */
declare namespace TileEntity {
    /**
     * Registers block as a TileEntity
     * @param blockID numeric block id to be used as [[TileEntity]]
     * @param customPrototype a set of parameters defining the [[TileEntity]]'s
     * behavior
     */
    function registerPrototype(blockID: number, customPrototype: TileEntityPrototype): void;

    /**
     * @returns [[TileEntity]]'s prototype by its numeric block id
     */
    function getPrototype(blockID: number): TileEntityPrototype;

    /**
     * @param blockID numeric block id
     * @returns true if the specified numeric block id is a [[TileEntity]]
     * block id, false otherwise
     */
    function isTileEntityBlock(blockID: number): boolean;

    /**
     * @returns a [[TileEntity]] on the specified coordinates or null if the block on the
     * coordinates is not a [[TileEntity]]
     */
    function getTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;

    /**
     * If the block on the specified coordinates is a TileEntity block and is
     * not initialized, initializes it and returns created [[TileEntity]] object
     * @returns [[TileEntity]] if one was created, null otherwise
     */
    function addTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;

    /**
     * Destroys [[TileEntity]], dropping its container
     * @returns true if the [[TileEntity]] was destroyed successfully, false
     * otherwise
     */
    function destroyTileEntity(tileEntity: TileEntity): boolean;

    /**
     * If the block on the specified coordinates is a [[TileEntity]], destroys
     * it, dropping its container
     * @returns true if the [[TileEntity]] was destroyed successfully, false
     * otherwise
     */
    function destroyTileEntityAtCoords(x: number, y: number, z: number, region?: BlockSource): boolean;

    /**
     * Checks whether the [[TileEntity]] is in the loaded chunk or not
     * @param tileEntity to be verified
     * @returns true if the chunk with TileEntity and some of the surrounding
     * chunks are loaded, false otherwise. The following chunks are verified:
     *  + +
     *   #
     *  + +
     * Where "#"" is the chunk containing the current TileEntity and "+" are
     * the chunks that are also verified
     */
    function isTileEntityLoaded(tileEntity: TileEntity): boolean;

    /**
     * Interface passed to [[TileEntity.registerPrototype]] function
     */
    interface TileEntityPrototype {
		/**
         * Use ItemContainer that supports multiplayer
         */
        useNetworkItemContainer?: boolean;
        /**
         * Default data values, will be initially added to [[TileEntity.data]] field
         */
        defaultValues?: { [key: string]: any },

        /**
         * Called when a [[TileEntity]] is created
         */
		created?: () => void,

		/**
         * Client TileEntity prototype copy
         */
        client?: {
            /**
             * Called when the client copy is created
             */
            load?: () => void,

            /**
             * Called on destroying the client copy
             */
            unload?: () => void,

            /**
             * Called every tick on client thread
             */
            tick?: () => void,

            /**
             * Events that receive packets on the client side
             */
            events?: {
                /**
                 * Example of the client packet event function
                 */
                [packetName: string]: (packetData: any, packetExtra: any) => void;
            },

            /**
             * Events of the container's client copy
             */
            containerEvents?: {
                /**
                 * Example of the client container event function
                 */
                [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
            }
	
	    /**
              * Any other user-defined methods and properties
              */
            [key: string]: any
	    
        },

        /**
         * Events that receive packets on the server side
         */
        events?: {
            /**
             * Example of the server packet event function.
             * 'this.sendResponse' method is only available here.
             */
            [packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
        },

        /**
         * Events of the container on the server side
         */
        containerEvents?: {
            /**
             * Example of the server container event function
             */
            [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
        }

        /**
         * Called when a [[TileEntity]] is initialised in the world
         */
        init?: () => void,

        /**
         * Called every tick and should be used for all the updates of the [[TileEntity]]
         */
        tick?: () => void,

        /**
         * Called when player uses some item on a [[TileEntity]]
         * @returns true if the event is handled and should not be propagated to
         * the next handlers. E.g. return true if you don't want the user interface
         * to be opened
         */
        click?: (id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData) => boolean | void,

        /**
         * Occurs when a block of the [[TileEntity]] is being destroyed. See
         * [[Callback.DestroyBlockFunction]] for details
         */
        destroyBlock?: (coords: Callback.ItemUseCoordinates, player: number) => void,

        /**
         * Occurs when the [[TileEntity]] should handle redstone signal. See
         * [[Callback.RedstoneSignalFunction]] for details
         */
        redstone?: (params: { power: number, signal: number, onLoad: boolean }) => void,

        /**
         * Occurs when a projectile entity hits the [[TileEntity]]. See
         * [[Callback.ProjectileHitFunction]] for details
         */
        projectileHit?: (coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget) => void,

        /**
         * Occurs when the [[TileEntity]] is being destroyed
         * @returns true to prevent
         * [[TileEntity]] object from destroying (but if the block was destroyed, returning
         * true from this function doesn't replace the missing block with a new one)
         */
        destroy?: () => boolean | void;

        /**
         * Called to get the [[UI.IWindow]] object for the current [[TileEntity]]. The
         * window is then opened within [[TileEntity.container]] when the player clicks it
		 * @deprecated Don't use in multiplayer
         */
		getGuiScreen?: () => com.zhekasmirnov.innercore.api.mod.ui.window.IWindow;

		/**
         * Called on server side and returns UI name to open on click
         */
        getScreenName?: (player: number, coords: Vector) => string;

        /**
         * Called on client side, returns the window to open
         */
        getScreenByName?: (screenName?: string) => com.zhekasmirnov.innercore.api.mod.ui.window.IWindow;

        /**
         * Called when more liquid is required
         */
        requireMoreLiquid?: (liquid: string, amount: number) => void;

        /**
         * Any other user-defined methods and properties
         */
        [key: string]: any
    }
}

declare interface TileEntity extends TileEntity.TileEntityPrototype {
    /**
     * X coord of the TileEntity in its dimension
     */
    readonly x: number,
    /**
     * Y coord of the TileEntity in its dimension
     */
    readonly y: number,
    /**
     * Z coord of the TileEntity in its dimension
     */
    readonly z: number,
    /**
     * dimension where the TileEntity is located
     */
    readonly dimension: number,
    /**
     * block id of TileEntity
     */
    readonly blockID: number,
    /**
     * TileEntity data values object
     */
    data: {[key: string]: any},
    /**
     * TileEntity's item container
     */
    container: ItemContainer | UI.Container,
    /**
     * TileEntity's liquid storage
     */
    liquidStorage: LiquidRegistry.Storage,
    /**
     * True if TileEntity is loaded in the world
     */
    isLoaded: boolean;
    /**
     * True if TileEntity was destroyed
     */
    remove: boolean;
    /**
     * Destroys the TileEntity prototype
     */
    selfDestroy: () => void;
    /**
     * Sends the packet from server to all clients
     */
    sendPacket: (name: string, data: object) => void;
    /**
     * BlockSource object to manipulate TileEntity's position in world
     */
    blockSource: BlockSource;
    /**
     * SyncedNetworkData object of the TileEntity
     */
    networkData: SyncedNetworkData;
    /**
     * NetworkEntity object of the TileEntity
     */
    networkEntity: NetworkEntity;
    /**
     * Sends packet to specified client.
     * AVAILABLE ONLY IN SERVER EVENT FUNCTIONS!
     */
    sendResponse: (packetName: string, someData: object) => void;
}

declare namespace LiquidRegistry {
    var liquidStorageSaverId: number;
    var liquids: object;

    function registerLiquid(key: string, name: string, uiTextures: string[], modelTextures?: string[]): void;

    function getLiquidData(key: string): any;

    function isExists(key: string): boolean;

    function getLiquidName(key: string): string;

    function getLiquidUITexture(key: string, width: number, height: number): string;

    function getLiquidUIBitmap(key: string, width: number, height: number): android.graphics.Bitmap;
    var FullByEmpty: object;
    var EmptyByFull: object;

    function registerItem(liquid: string, empty: { id: number, data: number }, full: { id: number, data: number }): void;

    function getEmptyItem(id: number, data: number): { id: number, data: number, liquid: string };

    function getItemLiquid(id: number, data: number): string;

    function getFullItem(id: number, data: number, liquid: string): { id: number, data: number };

    class Storage {
        liquidAmounts: {[key: string]: number};
        liquidLimits: {[key: string]: number};
        tileEntity: TileEntity;

        constructor(tileEntity: TileEntity);

        setParent(tileEntity: TileEntity): void;
        getParent(): TileEntity;
        hasDataFor(liquid: string): boolean;
        setLimit(liquid: Nullable<string>, limit: number): void;
        getLimit(liquid: string): number;
        getAmount(liquid: string): number;
        getRelativeAmount(liquid: string): number;
        setAmount(liquid: string, amount: number): void;
        getLiquidStored(): Nullable<string>;
        isFull(liquid?: string): boolean;
        isEmpty(liquid?: string): boolean;
        addLiquid(liquid: string, amount: number, onlyFullAmount?: boolean): number;
        getLiquid(liquid: string, amount: number, onlyFullAmount?: boolean): number;
        updateUiScale(scale: string, liquid: string, container?: UI.Container): void;
        _setContainerScale(container: UI.Container, scale: string, liquid: string, val: number): void;
    }

    /**
     * @returns string id of a liquid for given block,
     * or null, if a block with given id is not a liquid
     */
    function getLiquidByBlock(id: number): Nullable<string>;

    /**
     * @returns numeric id of the liquid block by given [[LiquidRegistry]] string id.
     * If `isStatic` param is passed and it is true, the static liquid block id will be returned,
     * otherwise the dynamic block id will be returned.
     * This function will return 0 if no liquid with given string id exists
     */
    function getBlockByLiquid(liquidId: string, isStatic?: boolean): number;

}

/**
 * Module used to manipulate crafting recipes for vanilla and custom workbenches
 */
declare namespace Recipes {
    /**
     * Adds new shaped crafting recipe. For example:
     * 
     * Simple example:
     * 
     * ```ts
     * Recipes.addShaped({id: 264, count: 1, data: 0}, [
     *     "ax", 
     *     "xa", 
     *     "ax"
     * ], ['x', 265, 0, 'a', 266, 0]); 
     * ```
     * 
     * @param result recipe result item
     * @param mask recipe shape, up to three string corresponding to the three 
     * crafting field rows. Each character means one item in the field. 
     * E.g. the pickaxe recipe should look like this:
     * 
     * ```
     * "+++"
     * " | "
     * " | "
     * ```
     * 
     * Do not use empty lines or line endings, if the recipe can be placed 
     * within less then three rows or cols. E.g. to craft plates, you can use 
     * a shape like this: 
     * 
     * ```
     * "--"
     * ```
     * 
     * @param data an array explaining the meaning of each character within 
     * mask. The array should contain three values for each symbol: the symbol
     * itself, item id and item data. 
     * @param func function to be called when the craft is processed
     * @param prefix recipe prefix. Use a non-empty values to register recipes
     * for custom workbenches
     */
    function addShaped(result: ItemInstance, mask: string[], data: (string | number)[], func?: CraftingFunction, prefix?: string): WorkbenchShapedRecipe;

    /**
     * Same as [[Recipes.addShaped]], but you can specify result as three
     * separate values corresponding to id, count and data
     */
    function addShaped2(id: number, count: number, aux: number, mask: string[], data: (string | number)[], func?: CraftingFunction, prefix?: string): WorkbenchShapedRecipe;

    /**
     * Adds new shapeless crafting recipe. For example: 
     * 
     * ```ts
     * Recipes.addShapeless({id: 264, count: 1, data: 0}, 
     *     [{id: 265, data: 0}, {id: 265, data: 0}, {id: 265, data: 0}, 
     *     {id: 266, data: 0}, {id: 266, data: 0}, {id: 266, data: 0}]);
     * ```
     * 
     * @param result recipe result item
     * @param data crafting ingredients, an array of objects representing item
     * id and data
     * @param func function to be called when the craft is processed
     * @param prefix recipe prefix. Use a non-empty values to register recipes
     * for custom workbenches
     */
    function addShapeless(result: ItemInstance, data: { id: number, data: number }[], func?: CraftingFunction, prefix?: string): WorkbenchShapelessRecipe;

    /**
     * Deletes recipe by its result 
     * @param result recipe result
     */
    function deleteRecipe(result: ItemInstance): void;

    /**
     * Removes recipe by result id, count and data
     */
    function removeWorkbenchRecipe(id: number, count: number, data: number): void;

    /**
     * Gets all available recipes for the recipe result
     * @returns java.util.Collection object containing [[WorkbenchRecipe]]s
     */
    function getWorkbenchRecipesByResult(id: number, count: number, data: number): java.util.Collection<WorkbenchRecipe>;

    /**
     * Gets all available recipes containing an ingredient
     * @returns java.util.Collection object containing [[WorkbenchRecipe]]s
     */
    function getWorkbenchRecipesByIngredient(id: number, data: number): java.util.Collection<WorkbenchRecipe>;

    /**
     * Gets recipe by the field and prefix
     * @param field [[WorkbenchField]] object containing crafting field 
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     * @returns [[WorkbenchRecipe]] instance, containing useful methods and 
     * recipe information
     */
    function getRecipeByField(field: WorkbenchField, prefix?: string): Nullable<WorkbenchRecipe>;

    /**
     * Gets recipe result item by the field and recipe prefix
     * @param field [[WorkbenchField]] object containing crafting field 
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     */
    function getRecipeResult(field: WorkbenchField, prefix?: string): Nullable<ItemInstance>;

    /**
     * Performs crafting by the field contents and recipe prefix
     * @param field [[WorkbenchField]] object containing crafting field 
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     */
    function provideRecipe(field: WorkbenchField, prefix?: string): Nullable<ItemInstance>;

    /**
     * Adds new furnace recipe
     * @param sourceId source item id
     * @param sourceData source item data
     * @param resultId resulting item id
     * @param resultData resulting item data
     * @param prefix prefix, used to create recipes for non-vanilla furnaces
     */
    function addFurnace(sourceId: number, sourceData: number, resultId: number, resultData: number, prefix?: string): void;

    /**
     * Adds new furnace recipe with no need to manually specify input item data
     * (it defaults to -1)
     * @param sourceId source item id
     * @param resultId result item id
     * @param resultData resulting item data
     * @param prefix prefix, used to create recipes for non-vanilla furnaces. If
     * the prefix is not empty and some recipes for this source exist for 
     * vanilla furnace, they are removed
     */
    function addFurnace(sourceId: number, resultId: number, resultData: number, prefix?: string): void

    /**
     * Removes furnace recipes by source item
     * @param sourceId source item id
     * @param sourceData source item data
     */
    function removeFurnaceRecipe(sourceId: number, sourceData: number): void;

    /**
     * Adds fuel that can be used in the furnace
     * @param id fuel item id
     * @param data fuel item data
     * @param time burning time in ticks
     */
    function addFurnaceFuel(id: number, data: number, time: number): void;

    /**
     * Removes furnace fuel by fuel item id and data
     */
    function removeFurnaceFuel(id: number, data: number): void;

    /**
     * @param prefix recipe prefix used for non-vanilla furnaces
     * @returns furnace recipe resulting item
     */
    function getFurnaceRecipeResult(id: number, data: number, prefix?: string): ItemInstance;

    /**
     * @returns fuel burn duration by fuel item id and data
     */
    function getFuelBurnDuration(id: number, data: number): number;

    /**
     * Gets furnace recipes by result and custom prefix
     * @param resultId result item id
     * @param resultData result item data
     * @param prefix recipe prefix used for non-vanilla furnaces
     * @returns [[java.util.Collection]] object with all furnace recipes found by given params
     */
    function getFurnaceRecipesByResult(resultId: number, resultData: number, prefix: string): java.util.Collection<FurnaceRecipe>;

    /**
     * @returns [[java.util.Collection]] object with all registered workbench recipes
     */
    function getAllWorkbenchRecipes(): java.util.Collection<WorkbenchRecipe>;

    /**
     * @returns [[java.util.Collection]] object with all registered furnace recipes
     */
    function getAllFurnaceRecipes(): java.util.Collection<FurnaceRecipe>;

    /**
     * Class used to simplify creation of custom workbenches
     */
    class WorkbenchUIHandler {

        /**
         * Constructs a new Workbench UI handler
         * @param target target [[WindowContent.elements]] section
         * @param targetCon target container
         * @param field workbench field
         */
        constructor(target: UI.ElementSet, targetCon: UI.Container, field: WorkbenchField);

        /**
         * Sets custom workbench prefix
         * @param prefix custom workbench prefix
         */
        setPrefix(prefix: string): void;

        /**
         * Refreshes all the recipes in the workbench
         * @returns amount of recipes displayed
         */
        refresh(): number;

        /**
         * Runs recipes refresh in the ticking thread delaying refresh process 
         * for a tick. To get recipes count use 
         * [[WorkbenchUIHandler.setOnRefreshListener]]
         */
        refreshAsync(): void;

        /**
         * Registers listener to be notified when some recipe is selected
         * @param listener recipe selection listener
         */
        setOnSelectionListener(listener: { onRecipeSelected: (recipe: WorkbenchRecipe) => void }): void;

        /**
         * Registers listener to be notified when the workbench starts and 
         * completes refreshing
         * @param listener workbench refresh listener
         */
        setOnRefreshListener(listener: { onRefreshCompleted: (count: number) => void, onRefreshStarted: () => void }): void;

        /**
         * Deselects current recipe (asynchronously)
         */
        deselectCurrentRecipe(): void;

        /**
         * Sets workbench recipes displaying limit. By default it is 250
         * @param count count of the recipes to show
         */
        setMaximumRecipesToShow(count: number): void;
    }

    /**
     * Object representing workbench recipe
     */
    interface WorkbenchRecipe extends java.lang.Object {
        /**
         * @returns true, if the recipe is valid, false otherwise
         */
        isValid(): boolean;

        /**
         * @param c recipe entry character
         * @returns recipe entry by entry character
         */
        getEntry(c: string): RecipeEntry;

        /**
         * @returns resulting item instance
         */
        getResult(): ItemInstance;

        /**
         * @returns true if specified item is recipe's result, false otherwise
         */
        isMatchingResult(id: number, count: number, data: number): boolean;

        /**
         * @returns recipe unique mask identifier
         */
        getRecipeMask(): string;

        /**
         * @param field workbench field to compare with
         * @returns true if the field contains this recipe, false otherwise
         */
        isMatchingField(field: WorkbenchField): boolean;

        /**
         * @returns all recipe's entries in a java array
         */
        getSortedEntries(): native.Array<RecipeEntry>;

        /**
         * Tries to fill workbench field with current recipe
         * @param field workbench field to fill
         */
        putIntoTheField(field: WorkbenchField): void;

        /**
         * @returns recipe prefix. Defaults to empty string
         */
        getPrefix(): string;

        /**
         * Sets prefix value for the recipe
         * @param prefix new prefix value
         */
        setPrefix(prefix: string): void;

        /**
         * Compares current recipe's prefix with given one
         * @param prefix prefix value to compare with
         * @returns true, if current recipe's prefix is the same as given one,
         * false otherwise
         */
        isMatchingPrefix(prefix: string): boolean;

        /**
         * Sets craft function for the recipe
         * @param callback function to be called on item craft
         */
        setCallback(callback: CraftingFunction): void;

        /**
         * @returns current crafting function or null if no one was specified
         */
        getCallback(): Nullable<CraftingFunction>;

        addToVanillaWorkbench(): void;

        getEntryCodes(): java.util.ArrayList<java.lang.Long>;

        getEntryCollection(): java.util.Collection<RecipeEntry>;

        getRecipeUid(): number;

        isPossibleForInventory(inv: java.util.HashMap<java.lang.Long, java.lang.Integer>): boolean;

        isVanilla(): boolean;

        provideRecipe(field: WorkbenchField): Nullable<ItemInstance>;

        provideRecipeForPlayer(field: WorkbenchField, player: number): Nullable<ItemInstance>;

        putIntoTheField(field: WorkbenchField, player: number): void;

        setEntries(entries: java.util.HashMap<java.lang.Character, RecipeEntry>): void;

        /**
         * @returns reference to itself to be used in sequential calls
         */
        setVanilla(isVanilla: boolean): WorkbenchRecipe;

    }

    /**
     * Object representing workbench shaped recipe
     */
    interface WorkbenchShapedRecipe extends WorkbenchRecipe {

        addVariants(variants: java.util.ArrayList<WorkbenchRecipe>): void;

        setPattern(pattern: string[]): void;

        setPattern(pattern: RecipeEntry[][]): void;

    }

    /**
     * Object representing workbench shapeless recipe
     */
    interface WorkbenchShapelessRecipe extends WorkbenchRecipe {

        addVariants(variants: java.util.ArrayList<WorkbenchRecipe>): void;

    }

    /**
     * Object representing furnace recipe
     */
    interface FurnaceRecipe extends java.lang.Object {

        readonly inData: number;
        readonly inId: number;
        readonly resData: number;
        readonly resId: number;

        /**
         * @returns true, if the recipe is valid, false otherwise
         */
        isValid(): boolean;

        /**
         * @returns resulting item instance
         */
        getResult(): ItemInstance;

        /**
         * @returns recipe prefix. Defaults to empty string
         */
        getPrefix(): string;

        /**
         * Sets prefix value for the recipe
         * @param prefix new prefix value
         */
        setPrefix(prefix: string): void;

        /**
         * Compares current recipe's prefix with given one
         * @param prefix prefix value to compare with
         * @returns true, if current recipe's prefix is the same as given one,
         * false otherwise
         */
        isMatchingPrefix(prefix: string): boolean;

        getInputKey(): number;

    }

    /**
     * Function called when the craft is in progress
     * @param api object used to perform simple recipe manipulations and to prevent 
     * crafting
     * @param field array containing all slots of the crafting field
     * @param result recipe result item instance
     */
    interface CraftingFunction {
        (api: WorkbenchFieldAPI, field: com.zhekasmirnov.innercore.api.mod.ui.container.Slot[], result: ItemInstance, player: number): void
    }

    /**
     * Object representing workbench field
     */
    interface WorkbenchField {
        /**
         * @param slot slot index
         * @returns workbench slot instance by slot index
         */
        getFieldSlot(slot: number): com.zhekasmirnov.innercore.api.mod.ui.container.Slot,

        /**
         * @returns js array of all slots
         */
        asScriptableField(): com.zhekasmirnov.innercore.api.mod.ui.container.Slot[]
    }

    /**
     * Object used to work with workbench field in the craft function
     */
    interface WorkbenchFieldAPI {

        /**
         * @param slot slot index
         * @returns workbench slot instance by slot index
         */
        getFieldSlot(slot: number): com.zhekasmirnov.innercore.api.mod.ui.container.Slot;

        /**
         * Decreases item count in the specified slot, if possible
         * @param slot slot index
         */
        decreaseFieldSlot(slot: number): void;

        /**
         * Prevents crafting event
         */
        prevent(): void;

        /**
         * @returns true, if crafting event was prevented, false otherwise
         */
        isPrevented(): boolean;
    }

    /**
     * Crafting recipe entry
     */
    interface RecipeEntry extends java.lang.Object {

        /**
         * @param slot slot to compare with
         * @returns true if recipe entry matches the slot
         */
        isMatching(slot: com.zhekasmirnov.innercore.api.mod.ui.container.Slot): boolean;

        /**
         * @param entry entry to compare with
         * @returns true if recipe entry matches another entry
         */
        isMatching(entry: RecipeEntry): boolean;
    }

}

declare module UI {

    type ElementName = string | number | symbol;

	export type WindowContent = com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent;
	export type StandardWindowContent = com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowContent;
	export type FontDescription = com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription;

    export type FontParams = com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription;
    export type WindowLocationParams = com.zhekasmirnov.innercore.api.mod.ui.window.WindowLocationDescription;
	export type BindingsSet = com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet;
	export type Style = com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle;
	export type UIClickEvent = com.zhekasmirnov.innercore.api.mod.ui.elements.UIClickEvent;

    export type ColorDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.ColorDrawingDescription;
    export type CustomDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.CustomDrawingDescription;
    export type FrameDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.FrameDrawingDescription;
    export type ImageDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.ImageDrawingDescription;
    export type LineDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.LineDrawingDescription;
    export type TextDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.TextDrawingDescription;

    export type UIElement = com.zhekasmirnov.innercore.api.mod.ui.elements.BasicElementDescription;
    export type UICustomElement = com.zhekasmirnov.innercore.api.mod.ui.elements.CustomElementDescription;
    export type UIButtonElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription;
    export type UICloseButtonElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription;
    export type UIFrameElement = com.zhekasmirnov.innercore.api.mod.ui.elements.FrameElementDescription;
    export type UIImageElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ImageElementDescription;
    export type UIScaleElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ScaleElementDescription;
    export type UIScrollElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ScrollElementDescription;
    export type UISlotElement = com.zhekasmirnov.innercore.api.mod.ui.elements.SlotElementDescription;
    export type UISwitchElement = com.zhekasmirnov.innercore.api.mod.ui.elements.SwitchElementDescription;
    export type UITabElement = com.zhekasmirnov.innercore.api.mod.ui.elements.TabElementDescription;
    export type UITextElement = com.zhekasmirnov.innercore.api.mod.ui.elements.TextElementDescription;
    export type UIFPSTextElement = com.zhekasmirnov.innercore.api.mod.ui.elements.FPSTextElementDescription;
    export type UIInvSlotElement = com.zhekasmirnov.innercore.api.mod.ui.elements.InvSlotElementDescription;

	export interface IWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.IWindow {}
	export interface Slot extends com.zhekasmirnov.innercore.api.mod.ui.container.Slot {}

	export type Element = UIElement;

    /**
	 * Object containing ui elements with key as the name and value as the 
	 * [[UIElement]] instance to be used
	 */
	export type Elements = (
		UICustomElement
		| UIButtonElement
		| UICloseButtonElement
		| UIFrameElement
		| UIImageElement
		| UIScaleElement
		| UIScrollElement
		| UISlotElement
		| UISwitchElement
		| UITabElement
		| UITextElement
		| UIFPSTextElement
		| UIInvSlotElement
	);

	export type DrawingElements = (
		ColorDrawing
		| CustomDrawing
		| FrameDrawing
		| ImageDrawing
		| LineDrawing
		| TextDrawing
	);
	
    export interface ElementSet {
		[key: string]: Elements;
	}

	export type DrawingSet = DrawingElements[];

    /**
	 * Object used to handle windows opening and closing events
	 */
	export interface WindowEventListener {
		/**
		 * Called when the window is opened
		 * @param window current [[Window]] object
		 */
		onOpen: (window: Window) => void,
		/**
		 * Called when the window is closed
		 * @param window current [[Window]] object
		 */
		onClose: (window: Window) => void
	}

    /**
	 * Class representing several windows opened at the same. For example, 
	 * [[StandardWindow]] is a window group that consists of several separate
	 * windows
	 */
    export class WindowGroup extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowGroup {
        static class: java.lang.Class<WindowGroup>;
        /**
		 * Constructs new [[WindowGroup]] instance
		 */
        constructor();
    }

    /**
	 * Containers are used to properly manipulate windows and save slots 
	 * contents and windows state between window opens. Every [[TileEntity]] has 
	 * a built-in container that can be accessed as [[TileEntity.container]]
	 * @deprecated
	 */
    export class Container extends com.zhekasmirnov.innercore.api.mod.ui.container.Container {
        static class: java.lang.Class<Container>;
        /**
		 * Creates a new instance of [[Container]]
		 */
        constructor();
        /**
		 * Creates a new instance of [[Container]] and initializes its parent. 
		 * See [[Container.setParent]] for details
		 */
        constructor(parent: Nullable<TileEntity> | any);
    }

    /**
	 * Represents window of required size that can be opened in container to 
	 * provide any required UI facilities
	 */
    export class Window extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindow {
        static class: java.lang.Class<Window>;
        /**
		 * Constructs new [[Window]] object with specified bounds
		 * @param location object containing window's bounds. Note that the 
		 * bounds change the width of the window, but the full width of the 
		 * window becomes 1000 units.
		 */
        constructor(loc: com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation);
        /**
		 * Constructs new [[Window]] object with specified content
		 * @param content window's content
		 */
        constructor(content: WindowContent);
        /**
         * Constructs new empty [[Window]] object
         */
        constructor();
    }

    /** @deprecated use [[StandardWindow]] instead */
    export class StandartWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowStandard {
        static class: java.lang.Class<StandartWindow>;
        constructor(content: StandardWindowContent);
        constructor();
    }

    /**
	 * Class used to create standard ui for the mod's machines. 
	 * [[StandardWindow]] is a [[WindowGroup]] that has three windows with names
	 * *"main"*, *"inventory"* and *"header"*. They represent custom window 
	 * contents, player's inventory and window's header respectively
	 */
    export class StandardWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowStandard {
        static class: java.lang.Class<StandardWindow>;
        /**
		 * Constructs new [[StandardWindow]] with specified content. 
		 * Content is applied to the main window, header and inventory remain
		 * the same
		 * @param content object containing window description
		 */
        constructor(content: StandardWindowContent);
        /**
         * Constructs new empty [[StandardWindow]] object
         */
        constructor();
    }

    export class AdaptiveWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIAdaptiveWindow {
        static class: java.lang.Class<AdaptiveWindow>;
        /**
	     * Constructs new [[AdaptiveWindow]] with specified content
	     * @param content object containing window description
	     */
        constructor(content: WindowContent);
        /**
	     * Constructs a new empty [[AdaptiveWindow]]
	     */
        constructor();
    }

    /**
	 * Class used to create windows with multiple tabs
	 */
    export class TabbedWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UITabbedWindow {
        static class: java.lang.Class<TabbedWindow>;
        /**
		 * Constructs new [[TabbedWindow]] with specified location
		 * @param loc location to be used for the tabbed window
		 */
        constructor(loc: com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation);
        /**
		 * Constructs new [[TabbedWindow]] with specified content
		 * @param content object containing window description
		 */
        constructor(content: WindowContent);
        /**
         * Constructs new empty [[TabbedWindow]] object
         */
        constructor();
    }

    /**
	 * Class representing window's location. All coordinates are defined in 
	 * units (given screen's width is 1000 units)
	 */
    export class WindowLocation extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation {
        static class: java.lang.Class<WindowLocation>;
        /**
		 * Constructs new [[WindowLocation]] instance with default position and 
		 * size (fullscreen window)
		 */
        constructor();
        /**
		 * Constructs new [[WindowLocation]] instance with specified parameters
		 * @param params 
		 */
        constructor(desc: com.zhekasmirnov.innercore.api.mod.ui.window.WindowLocationDescription);
    }

    /**
	 * Class representing static or animated texture
	 */
    export class Texture extends com.zhekasmirnov.innercore.api.mod.ui.types.Texture { static class: java.lang.Class<Texture> }

    /**
	 * Class representing font used in the UI
	 */
    export class Font extends com.zhekasmirnov.innercore.api.mod.ui.types.Font {
        static class: java.lang.Class<Font>;
        constructor(color: number, size: number, shadow: number);
        constructor(desc: FontDescription);
    }

	/**
	 * Class used to visualize configuration file contents in a simple way
	 */
    export class ConfigVisualizer extends com.zhekasmirnov.innercore.api.mod.util.ConfigVisualizer {
        static class: java.lang.Class<ConfigVisualizer>;
		/**
		 * Constructs new [[ConfigVisualizer]] instance with specified elements 
		 * names prefix
		 * @param config configuration file to be loaded
		 * @param prefix elements names prefix used for this visualizer
		 */
        constructor(config: com.zhekasmirnov.innercore.mod.build.Config, prefix: string);
		/**
		 * Constructs new [[ConfigVisualizer]] instance with default elements 
		 * names prefix (*config_vis*)
		 * @param config configuration file to be loaded
		 */
        constructor(config: com.zhekasmirnov.innercore.mod.build.Config);
    }

    /**
	 * Namespace containing method to get [[FrameTexture]] instances
	 */
    export class FrameTextureSource extends java.lang.Object {
        static class: java.lang.Class<FrameTextureSource>;
        /**
		 * @param name gui texture name of the frame
		 */
        static get(name: string): com.zhekasmirnov.innercore.api.mod.ui.types.FrameTexture;
    }

    /**
	 * Namespace containing methods used to get and add gui textures
	 */
    export class TextureSource extends java.lang.Object {
        static class: java.lang.Class<TextureSource>;
        /**
		 * @param name gui texture name
		 * @returns [[android.graphics.Bitmap]] instance with the ui texture, if it 
		 * was loaded, with "*missing_texture*" texture otherwise
		 */
        static get(name: string): android.graphics.Bitmap;
        /**
		 * 
		 * @param name gui texture name
		 * @returns [[android.graphics.Bitmap]] instance with the ui texture, if it 
		 * was loaded, null otherwise
		 */
        static getNullable(name: string): Nullable<android.graphics.Bitmap>;
        /**
		 * Adds any bitmap as a gui texture with specified name
		 * @param name gui texture name
		 * @param bitmap [[android.graphics.Bitmap]] instance to be used as
		 * gui texture
		 */
        static put(name: string, bitmap: android.graphics.Bitmap): void;
    }

    /**
	 * Same as [[UI.getScreenHeight]]
	 */
    export function getScreenRelativeHeight(): number;

    /**
	 * @returns screen height in units
	 */
    export function getScreenHeight(): number;
    
    /**
	 * @returns current [[android.app.Activity]] instance that can be used as 
	 * [[android.content.Context]] wherever required
	 */
    export function getContext(): android.app.Activity;

}

/**
 * New class to work with world instead of some methods from [[World]] module.
 */
declare class BlockSource {
	/**
	 * @returns the dimension id to which the following object belongs
	 */
	getDimension(): number;

	/**
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @returns [[BlockState]] object of the block on given coords
	 * or [[Tile]] object in Legacy pack
	 */
	getBlock(x: number, y: number, z: number): BlockState;

	/**
	 * @returns block's id at coords
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 */
	getBlockId(x: number, y: number, z: number): number;

	/**
	 * @returns block's data at coords
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 */
	getBlockData(x: number, y: number, z: number): number;

	/**
	 * Sets block on coords
	 * @param id id of the block to set
	 * @param data data of the block to set
	 */
	setBlock(x: number, y: number, z: number, id: number, data: number): void;

	/**
	 * Sets block by given [[BlockState]] on coords
	 */
	setBlock(x: number, y: number, z: number, state: BlockState): void;

	/**
	 * Sets extra block (for example, water inside another blocks), on given coords by given id and data
	 */
	setExtraBlock(x: number, y: number, z: number, id: number, data: number): void;

	/**
	 * Sets extra block (for example, water inside another blocks), on given coords by given [[BlockState]]
	 */
	setExtraBlock(x: number, y: number, z: number, state: BlockState): void;

	/**
	 * @returns [[BlockState]] object of the extra block on given coords
	 */
	getExtraBlock(x: number, y: number, z: number): BlockState;

	 /**
	  * Creates an explosion on coords
	  * @param power defines how many blocks can the explosion destroy and what
	  * blocks can or cannot be destroyed
	  * @param fire if true, puts the crater on fire
	  */
	explode(x: number, y: number, z: number, power: number, fire: boolean): void;

	/**
	 * Destroys block on coords producing appropriate drop
	 * and particles. Do not use for massive tasks due to particles being 
	 * produced
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @param drop whether to provide drop for the block or not
	 */
	destroyBlock(x: number, y: number, z: number, drop?: boolean): void;

	/**
	 * Destroys block on coords by entity using specified item.
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @param allowDrop whether to provide drop for the block or not
	 * @param entity Entity id or -1 id if entity is not specified
	 * @param item Tool which broke block
	 */
	breakBlock(x: number, y: number, z: number, allowDrop: boolean, entity: number, item: ItemInstance): void;

	/**
	 * Same as breakBlock, but returns object containing drop and experince.
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @param entity Entity id or -1 id if entity is not specified
	 * @param item Tool which broke block
	 */
	breakBlockForJsResult(x: number, y: number, z: number, player: number, item: ItemInstance): {items: ItemInstance[], experience: number};

	/**
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @returns interface to the vanilla TileEntity (chest, furnace, etc.) 
	 * on the coords, and null if it's not found
	 */
	getBlockEntity(x: number, y: number, z: number): Nullable<NativeTileEntity>;

	/**
	 * @param x X coord of the block
	 * @param z Z coord of the block
	 * @returns biome id
	 */
	getBiome(x: number, z: number): number;

	/**
	 * Sets biome id by coords
	 * @param id - id of the biome to set
	 */
	setBiome(x: number, z: number, biomeID: number): void;

	/**
	 * @returns temperature of the biome on coords
	 */
	getBiomeTemperatureAt(x: number, y: number, z: number): number;

	/**
	 * @returns downfall of the biome on coords
	 */
	getBiomeDownfallAt(x: number, y: number, z: number): number;

	/**
	* @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns true if chunk is loaded, false otherwise
	 */
	isChunkLoaded(chunkX: number, chunkZ: number): boolean;

	/**
	* @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns true if chunk on the position is loaded, false otherwise
	 */
	isChunkLoadedAt(x: number, z: number): boolean;

	/**
	* @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns the loading state of the chunk by chunk coords
	 */
	getChunkState(chunkX: number, chunkZ: number): number;

	/**
	* @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns the loading state of the chunk by coords
	 */
	getChunkStateAt(x: number, z: number): number;

	/**
     * @returns light level on the specified coordinates, from 0 to 15
     */
	getLightLevel(x: number, y: number, z: number): number;

	/**
	 * @returns whether the sky can be seen from coords
	 */
	canSeeSky(x: number, y: number, z: number): boolean;

	/**
	 * @returns grass color on coords
	 */
	getGrassColor(x: number, y: number, z: number): number;

	/**
	 * Creates dropped item and returns entity id
	 * @param x X coord of the place where item will be dropped
	 * @param y Y coord of the place where item will be dropped
	 * @param z Z coord of the place where item will be dropped
	 * @param id id of the item to drop
	 * @param count count of the item to drop
	 * @param data data of the item to drop
	 * @param extra extra of the item to drop
	 * @returns drop entity id
	 */
	spawnDroppedItem(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;

	/**
	  * Spawns entity of given numeric type on coords
	  */
	spawnEntity(x: number, y: number, z: number, type: number | string): number;

	spawnEntity(x: number, y: number, z: number, namespace: string, type: string, init_data: string): number;

	/**
	  * Spawns experience orbs on coords
	  * @param amount experience amount
	  */
	spawnExpOrbs(x: number, y: number, z: number, amount: number): void;

	/**
	 * @returns the list of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is false,
	 * and all except the entities of the given type, if blacklist value is true
	 */
	fetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist: boolean): number[];

	/**
	 * @returns the list of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is false,
	 * and all except the entities of the given type, if blacklist value is true
	 */
	listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist: boolean): number[];
	
	setDestroyParticlesEnabled(destroyParticlesEnabled: boolean): void;

	/**
	 * @returns interface to given dimension by default 
	 * (null if given dimension is not loaded and this interface 
	 * was not created yet)
	 */
	static getDefaultForDimension(dimension: number): Nullable<BlockSource>;

	/**
	 * @returns interface to the dimension where the given entity is 
	 * (null if given entity does not exist or the dimension is not loaded 
	 * and interface was not created)
	 */
	static getDefaultForActor(entityUid: number): Nullable<BlockSource>;

	/**
	 * @returns BlockSource for world generation
	 */
	static getCurrentWorldGenRegion(): Nullable<BlockSource>;

	/**
	 * @returns BlockSource for the current client
	 */
	static getCurrentClientRegion(): Nullable<BlockSource>;

}

/**
 * Class to work with vanilla blocks parameters
 */
declare class BlockState implements Tile {

    /**Data of the block */
    readonly data: number;

    /**Numeric ID of the block */
    readonly id: number;

    /**
     * Constructs new BlockState object
     * from given id and data
     */
    constructor(id: number, data: number);

    /**
     * Constructs new BlockState object
     * from given id and states object
     */
    constructor(id: number, scriptable: {[key: number]: number});

    /**
     * @returns id of the block
     */
    getId(): number;

    /**
     * @returns data of the block
     */
    getData(): number;

    /**
     * @returns id of the blockstate in runtime
     */
    getRuntimeId(): number;

    /**
     * @returns whether the state is valid
     */
    isValidState(): boolean;

    /**
     * @returns state of the given number
     * if it's present in the following object
     */
    getState(state: number): number;

    /**
     * @returns whether the state by given number
     * is present in the following object
     */
    hasState(state: number): boolean;

    /**
     * Adds state to the following object
     * @returns BlockState object itself
     */
    addState(state: number, value: number): BlockState;

    /**
     * Adds states to the following object
     * from given java.util.Map instance
     * @returns BlockState object itself
     */
    addStates(states: java.util.Map<unknown, number>): BlockState;

    /**
     * Adds states to the following object
     * from given JS object instance
     * @returns BlockState object itself
     */
    addStates(states: object): BlockState;

    /**
     * @returns all states from following object
     * in java.util.Map instance
     */
    getStates(): java.util.Map<number, number>;

    /**
     * @returns all NAMED states from following object
     * in java.util.Map instance
     */
    getNamedStates(): java.util.Map<string, number>;

    /**
     * @returns all states from following object
     * in JS object instance
     */
    getStatesScriptable(): {[key: string]: number};

    /**
     * @returns all NAMED states from following object
     * in JS object instance
     */
    getNamedStatesScriptable(): {[key: string]: number};

    /**
     * @returns string representation of the following object
     */
    toString(): string;

    /**
     * @returns whether the following object is equal to given,
     * according to different parameters
     */
    equals(object: any): boolean;

}

/**
 * Module used to create and manipulate blocks. The difference between terms 
 * "block" and "tile" is in its usage: blocks are used in the inventory, 
 * tiles are placed in the world and have different ids for some vanilla blocks. 
 * Use [[Block.convertBlockToItemId]] and [[Block.convertItemToBlockId]]
 */
declare namespace Block {
	/**
	 * @param id string id of the block
	 * @returns block numeric id by its string id or just returns its numeric id 
	 * if input was a numeric id
	 */
	function getNumericId(id: string | number): number;

	/**
	 * Creates new block using specified params
	 * @param nameID string id of the block. You should register it via 
	 * [[IDRegistry.genBlockID]] call first
	 * @param defineData array containing all variations of the block. Each 
	 * variation corresponds to block data value, data values are assigned 
	 * according to variations order
	 * @param blockType [[SpecialType]] object, either java-object returned by
	 * [[Block.createSpecialType]] or js-object with the required properties, 
	 * you can also pass special type name, if the type was previously 
	 * registered
	 */
	function createBlock(nameID: string, defineData: BlockVariation[], blockType?: SpecialType | string): void;

	/**
	 * Creates new block using specified params, creating four variations for 
	 * each of the specified variations to be able to place it facing flayer 
	 * with the front side and defines the appropriate behavior. Useful for 
	 * different machines and mechanisms
	 * @param nameID string id of the block. You should register it via 
	 * [[IDRegistry.genBlockID]] call first
	 * @param defineData array containing all variations of the block. Each 
	 * variation corresponds to four block data values, data values are assigned 
	 * according to variations order
	 * @param blockType [[SpecialType]] object, either java-object returned by
	 * [[Block.createSpecialType]] or js-object with the required properties, 
	 * you can also pass special type name, if the type was previously 
	 * registered
	 */
	function createBlockWithRotation(nameID: string, defineData: BlockVariation[], blockType?: SpecialType | string): void;

	/**
	 * Creates new liquid block using specified params
	 * @param nameID string id of the block. You should register it via
	 * [[IDRegistry.genBlockID]] call first
	 * @param defineData object containing all needed params to describe your custom liquid block.
	 * There you can specify custom name IDs for static and dynamic liquid blocks separately,
	 * and if you do this, you have to register those name IDs
	 * via [[IDRegistry.genBlockID]] before using them
	 * @param blockType [[SpecialType]] object, either java-object returned by
	 * [[Block.createSpecialType]] or js-object with the required properties,
	 * you can also pass special type name, if the type was previously registered
	 */
	function createLiquidBlock(nameID: string, defineData: LiquidDescriptor, blockType?: SpecialType | string): void;

	/**
	 * @param id numeric block id
	 * @returns true, if the specified block id is a vanilla block
	 */
	function isNativeTile(id: number): boolean;

	/**
	 * Converts tile id to the block id
	 * @param id numeric tile id
	 * @returns numeric block id corresponding to the given tile id
	 */
	function convertBlockToItemId(id: number): number;

	/**
	 * Converts block id to the tile id
	 * @param id numeric tile id
	 * @returns numeric tile id corresponding to the given block id
	 */
	function convertItemToBlockId(id: number): number;

	/**
	 * Same as [[Block.registerPopResourcesFunction]] but accepts only numeric 
	 * tile id as the first param
	 */
	function registerPopResourcesFunctionForID(numericID: number, func: PopResourcesFunction): boolean;

	/**
	 * Registered function used by Core Engine to determine block drop for the
	 * specified block id
	 * @param nameID tile string or numeric id
	 * @param func function to be called when a block in the world is broken by
	 * environment (explosions, pistons, etc.)
	 * @returns true, if specified string or numeric id exists and the function
	 * was registered correctly, false otherwise
	 */
	function registerPopResourcesFunction(nameID: string | number, func: PopResourcesFunction): boolean;

	/**
	 * Same as [[Block.setDestroyLevel]] but accepts only numeric 
	 * tile id as the first param
	 */
	function setDestroyLevelForID(id: number, level: number, resetData?: boolean): void;

	/**
	 * Registers a default destroy function for the specified block, considering
	 * its digging level
	 * @param nameID tile string id
	 * @param level digging level of the block
	 * @param resetData if true, the block is dropped with data equals to 0
	 */
	function setDestroyLevel(nameID: string | number, level: number, resetData?: boolean): void;

	/**
	 * Sets destroy time for the block with specified id
	 * @param nameID string or numeric block id
	 * @param time destroy time for the block, in ticks
	 */
	function setDestroyTime(nameID: string | number, time: number): void;

	/**
	 * @param numericID numeric block id
	 * @returns true, if block is solid, false otherwise
	 */
	function isSolid(numericID: number): boolean;

	/**
	 * @param numericID numeric block id
	 * @returns destroy time of the block, in ticks
	 */
	function getDestroyTime(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns explosion resistance of the block
	 */
	function getExplosionResistance(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns friction of the block
	 */
	function getFriction(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns translucency of the block
	 */
	function getTranslucency(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns light level, emitted by block, from 0 to 15
	 */
	function getLightLevel(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns light opacity of the block, from 0 to 15
	 */
	function getLightOpacity(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns render layer of the block
	 */
	function getRenderLayer(numericID: number): number;

	/**
	 * @param numericID numeric block id
	 * @returns render type of the block
	 */
	function getRenderType(numericID: number): number;

	/**
	 * Temporarily sets destroy time for block, saving the old value for the 
	 * further usage
	 * @param numericID numeric block id
	 * @param time new destroy time in ticks
	 */
	function setTempDestroyTime(numericID: number, time: number): void;

	/**
	 * Registers material and digging level for the specified block
	 * @param nameID block numeric or string id
	 * @param material material name
	 * @param level block's digging level
	 * @returns true if specified string or numeric id exists, false otherwise
	 */
	function setBlockMaterial(nameID: string | number, material: string, level: number): boolean;

	/**
	 * Makes block accept redstone signal
	 * @deprecated use [[Block.setupAsRedstoneReceiver]] and 
	 * [[Block.setupAsRedstoneEmitter]] instead
	 * @param nameID block numeric or string id
	 * @param data block data, currently not used
	 * @param isRedstone if true, the redstone changes at the block will notify
	 * the "RedstoneSignal" callback
	 */
	function setRedstoneTile(nameID: string | number, data: number, isRedstone: boolean): void;

	/**
	 * Gets drop for the specified block. Used mostly by Core Engine's 
	 * [[ToolAPI]], though, can be useful in the mods, too
	 * @param block block info
	 * @param item item that was (or is going to be) used to break the block
	 * @param coords coordinates where the block was (or is going to be) broken 
	 * @returns block drop, the array of arrays, each containing three values: 
	 * id, count and data respectively
	 */
	function getBlockDropViaItem(block: Tile, item: ItemInstance, coords: Vector, region: BlockSource): ItemInstanceArray[];

	/**
	 * Same as [[Block.registerPlaceFunction]] but accepts only numeric 
	 * tile id as the first param
	 */
	function registerPlaceFunctionForID(block: number, func: PlaceFunction): void;

	/**
	 * Registers function to be called when the block is placed in the world
	 * @param nameID block numeric or string id
	 * @param func function to be called when the block is placed in the world
	 */
	function registerPlaceFunction(nameID: string | number, func: PlaceFunction): void;

	/**
	 * Sets block box shape
	 * @param id block numeric id
	 * @param pos1 block lower corner position, in voxels (1/16 of the block)
	 * @param pos2 block upper conner position, in voxels (1/16 of the block)
	 * @param data block data
	 */
	function setBlockShape(id: number, pos1: Vector, pos2: Vector, data?: number): void;

	/**
	 * Same as [[Block.setBlockShape]], but accepts coordinates as scalar 
	 * params, not objects
	 * @param id block numeric id
	 * @param data  block data
	 */
	function setShape(id: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): void;

	/**
	 * Creates a new special type using specified params and registers it by 
	 * name
	 * @param description special type properties
	 * @param nameKey string name to register the special type
	 * @returns special type name
	 */
	function createSpecialType(description: SpecialType, nameKey?: string): string;

	/**
	 * @deprecated No longer supported
	 */
	function setPrototype(nameID: string | number, Prototype: any): number;

	/**
	 * @param id numeric block id
	 * @returns the color specified block is displayed on the vanilla maps
	 */
	function getMapColor(id: number): number;

	/**
	 * Makes block invoke callback randomly depending on game speed
	 * @param id block id to register for random ticks
	 * @param callback function to be called on random block tick
	 */
	function setRandomTickCallback(id: number, callback: RandomTickFunction): void;

	/**
	 * Makes block invoke callback randomly depending on game speed. Occurs more 
	 * often then [[Block.setRandomTickCallback]] and only if the block is not
	 * far away from player
	 * @param id block id to register
	 * @param callback function to be called 
	 */
	function setAnimateTickCallback(id: number, callback: AnimateTickFunction): void;

	/**
	 * Makes block receive redstone signals via "RedstoneSignal" callback
	 * @param id block numeric or string id
	 * @param connectToRedstone if true, redstone wires will connect to the block
	 */
	function setupAsRedstoneReceiver(id: number | string, connectToRedstone: boolean): void;

	/**
	 * Makes block emit redstone signal
	 * @param id block numeric or string id
	 * @param connectToRedstone if true, redstone wires will connect to the block
	 */
	function setupAsRedstoneEmitter(id: number | string, connectToRedstone: boolean): void;

	/**
	 * Removes all the redstone functionality from the block
	 * @param id block numeric or string id
	 */
	function setupAsNonRedstoneTile(id: number | string): void;

	/**
	 * Registers function on neighbour blocks updates
	 * @param numericID tile string or numeric id
	 * @param func function to be called when neighbour block updates
	 * @returns true, if the function was registered correctly, false otherwise
	 */
	function registerNeighbourChangeFunction(name: string | number, func: NeighbourChangeFunction): boolean;

	/**
	 * Same as [[Block.registerNeighbourChangeFunction]] but accepts only numeric
	 * tile id as the first param
	 */
	function registerNeighbourChangeFunctionForID(id: number, func: NeighbourChangeFunction): boolean;

	/**
	 * Registers function on entity being inside the block. Can be used to create portals.
	 * @param numericID tile string or numeric id
	 * @param func function to be called when entity is inside the block
	 * @returns true, if the function was registered correctly, false otherwise
	 */
	function registerEntityInsideFunction(nameID: string | number, func: EntityInsideFunction): boolean

	/**
	 * Same as [[Block.registerEntityInsideFunction]] but accepts only numeric
	 * tile id as the first param
	 */
	function registerEntityInsideFunctionForID(numericID: number, func: EntityInsideFunction): boolean

	/**
	 * Registers function on entity step on the block.
	 * @param numericID tile string or numeric id
	 * @param func function to be called when entity step on the block
	 * @returns true, if the function was registered correctly, false otherwise
	 */
	function registerEntityStepOnFunction(id: string | number, func: EntityStepOnFunction): boolean;

	/**
	 * Same as [[Block.registerEntityStepOnFunction]] but accepts only numeric
	 * tile id as the first param
	 */
	function registerEntityStepOnFunctionForID(id: number, func: EntityStepOnFunction): boolean;

	/**
	 * Defines custom behavior when the player clicks on the block with definite id
	 * @param nameId block's numeric or string id
	 * @param func function that will be called when the player clicks the block with given id
	 */
	function registerClickFunction(nameId: string | number, func: ClickFunction): void;

	/**
	 * Same as [[Block.registerClickFunction]], but only numeric block id can be passed
	 */
	function registerClickFunctionForID(id: number, func: ClickFunction): void;

	/**
	 * @returns whether the block of given id can contain liquid inside
	 */
	function canContainLiquid(id: number): boolean;

	/**
	 * @returns whether the block of given id can be an extra block 
	 * (it's the block that can be set inside of another blocks, for ex. water and other liquids)
	 */
	function canBeExtraBlock(id: number): boolean;

	type ColorSource = "grass" | "leaves" | "water";

	type Sound = "normal"
		| "gravel"
		| "wood"
		| "grass"
		| "metal"
		| "stone"
		| "cloth"
		| "glass"
		| "sand"
		| "snow"
		| "ladder"
		| "anvil"
		| "slime"
		| "silent"
		| "itemframe"
		| "turtle_egg"
		| "bamboo"
		| "bamboo_sapling"
		| "lantern"
		| "scaffolding"
		| "sweet_berry_bush"
		| "default";

	/**
	 * Special types are used to set properties to the block. Unlike items, 
	 * blocks properties are defined using special types, due to old Inner 
	 * Core's block ids limitations 
	 */
	interface SpecialType {
		/**
		 * Unique string identifier of the SpecialType
		 */
		name?: string,

		/**
		 * Vanilla block ID to inherit some of the properties. Default is 0
		 */
		base?: number,

		/**
		 * Block material constant. Default is 3
		 */
		material?: number,

		/**
		 * If true, the block is not transparent. Default is false
		 */
		solid?: boolean,

		/**
		 * If true, all block faces are rendered, otherwise back faces are not
		 * rendered (for optimization purposes). Default is false
		 */
		renderallfaces?: boolean,

		/**
		 * Sets render type of the block. Default is 0 (full block), use other 
		 * values to change block's shape
		 */
		rendertype?: number,

		/**
		 * Specifies the layer that is used to render the block. Default is 4
		 */
		renderlayer?: number,

		/**
		 * If non-zero value is used, the block emits light of that value. 
		 * Default is 0, use values from 1 to 15 to set light level
		 */
		lightlevel?: number,

		/**
		 * Specifies how opaque the block is. Default is 0 (transparent), use values 
		 * from 1 to 15 to make the block opaque
		 */
		lightopacity?: number,

		/**
		 * Specifies how block resists to the explosions. Default value is 3
		 */
		explosionres?: number,

		/**
		 * Specifies how player walks on this block. The higher the friction is,
		 * the more difficult it is to change speed and direction. Default value
		 * is 0.6000000238418579
		 */
		friction?: number,

		/**
		 * Specifies the time required to destroy the block, in ticks
		 */
		destroytime?: number,

		/**
		 * If non-zero value is used, the shadows will be rendered on the block.
		 * Default is 0, allows float values from 0 to 1
		 */
		translucency?: number,

		/**
		 * Block color when displayed on the vanilla maps
		 */
		mapcolor?: number,

		/**
		 * Makes block use biome color source when displayed on the vanilla maps
		 */
		color_source?: ColorSource,

		/**
		 * Specifies sounds of the block
		 */
		sound?: Sound
	}

	/**
	 * Object used to represent single block variation
	 */
	interface BlockVariation {
		/**
		 * Variation name, displayed as item name everywhere. Default value is
		 * *"Unknown Block"*
		 */
		name?: string,

		/**
		 * Variation textures, array containing pairs of texture name and data.
		 * Texture file should be located in items-opaque folder and its name
		 * should be in the format: *name_data*, e.g. if the file name is 
		 * *ingot_copper_0*, you should specify an array
		 * ```js 
		 * ["ingot_copper", 0]
		 * ```
		 * There should be from one to six texture 
		 * pairs in the array, if less then six variations are specified, the 
		 * last texture is used for missing textures. The sides go in the 
		 * following order:
		 * ```js 
		 * texture: [
		 *   ["название1", индекс1], // bottom (Y: -1)
		 *   ["название2", индекс2], // top (Y: +1)
		 *   ["название3", индекс3], // back (X: -1)
		 *   ["название4", индекс4], // front (X: +1)
		 *   ["название5", индекс5], // left (Z: -1)
		 *   ["название6", индекс6]  // right (Z: +1)
		 * ]
		 * ```
		 */
		texture: [string, number][]

		/**
		 * If true, block variation will be added to creative inventory
		 */
		inCreative?: boolean,
	}

	/**
	 * Object to specify needed params for custom liquid block
	 */
	interface LiquidDescriptor {
		/**
		 * Name of the block to be displayed 
		 */
		name: string,
		/**
		 * Delay between liquid spreading steps in ticks.
		 * This is optional, default value is 10
		 */
		tickDelay?: number,
		/**
		 * True if the liquid will be renewable, as water,
		 * this parameter is false by default
		 */
		isRenewable?: boolean,
		/**
		 * Object to describe static liquid block
		 * texture, and name id additionally
		 */
		still: {
			/**
			 * Optional, name id for static liquid block,
			 * by default it is `nameId_still`
			 */
			id?: string,
			/**
			 * For static liquid block,
			 * textures must be of standard block texture format
			 */
			texture: [string, number]
		},
		/**
		 * Object to describe dynamic liquid block
		 * texture, and name id additionally
		 */
		flowing: {
			/**
			 * Optional, name id for dynamic liquid block,
			 * by default it is `nameId`
			 */
			id?: string,
			/**
			 * Unlike static liquid blocks,
			 * for dynamic ones, texture must look like
			 * `texture.liquid.png` (with no index)
			 */
			texture: [string, number]
		},
		/**
		 * Optional section, if added, this will create fully
		 * functional (including dispensers) bucket items
		 */
		bucket?: {
			/**
			 * Optional, name id for bucket item,
			 * by default it is `nameId_bucket`
			 */
			id?: string,
			texture: { name: string, meta?: number }
		},
		/**
		 * Whether to add liquid block to creative inventory,
		 * default is false
		 */
		inCreative?: boolean,
		uiTextures?: string,
		modelTextures?: string
	}

	interface EntityInsideFunction {
		(blockCoords: Vector, block: Tile, entity: number): void
	}

	interface EntityStepOnFunction {
		(coords: Vector, block: Tile, entity: number): void
	}

	/**
	 * Function used to determine when block is broken by
	 * environment (explosions, pistons, etc.)
	 * @param blockCoords coordinates where the block is destroyed and side from
	 * where it is destroyed
	 * @param block information about block that is broken
	 * @param region BlockSource object
	 * @param i unknown parameter, supposed to always be zero
	 */
	interface PopResourcesFunction {
		(blockCoords: Vector, block: Tile, region: BlockSource, explosionRadius: number, i: number): void
	}

	/**
	 * Function used to determine when block is placed in the world
	 * @param coords set of all coordinate values that can be useful to write 
	 * custom use logics
	 * @param item item that was in the player's hand when he touched the block
	 * @param block block that was touched
	 * @param player Player unique id
	 * @param region BlockSource object
	 * @returns coordinates where to actually place the block, or void for 
	 * default placement
	 */
	interface PlaceFunction {
		(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource): Vector | void
	}

	/**
	 * Function used to track random block ticks
	 * @param x x coordinate of the block that ticked
	 * @param y y coordinate of the block that ticked
	 * @param z z coordinate of the block that ticked
	 * @param id block id
	 * @param data block data
	 * @param region BlockSource object
	 */
	interface RandomTickFunction {
		(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void
	}

	/**
	 * Function used to track random block animation ticks
	 * @param x x coordinate of the block that should be updated
	 * @param y y coordinate of the block that should be updated
	 * @param z z coordinate of the block that should be updated
	 * @param id block id
	 * @param data block data
	 */
	interface AnimateTickFunction {
		(x: number, y: number, z: number, id: number, data: number): void
	}

	/**
	 * Function used to check block's neighbours changes
	 * @param coords coords vector of the block
	 * @param block Tile object of the block
	 * @param changedCoords coords vector of the neighbour block that was changed
	 * @param region BlockSource object
	 */
	interface NeighbourChangeFunction {
		(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void
	}

	/**
	 * Function used to define how the block will behave when the player clicks on it
	 * @param coords set of all coordinate values that can be useful to write 
	 * custom logics on click
	 * @param item item that was in the player's hand when he touched the block
	 * @param block block that was touched
	 * @param player unique id of the player entity
	 */
	interface ClickFunction {
		(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
	}

	/**
	 * @returns place function of the block with given numeric id,
	 * or undefined if it was not specified
	 */
	function getPlaceFunc(id: number): Block.PlaceFunction;

	/**
	 * @returns given block's material numeric id
	 */
	function getMaterial(id: number): number;

	function setBlockChangeCallbackEnabled(id: number, enabled: boolean): void;

	function setEntityInsideCallbackEnabled(id: number, enabled: boolean): void;

	function setEntityStepOnCallbackEnabled(id: number, enabled: boolean): void;

	function setNeighbourChangeCallbackEnabled(id: number, enabled: boolean): void;

	function setRedstoneConnector(id: number, data: number, redstone: boolean): void;

	function setRedstoneEmitter(id: number, data: number, redstone: boolean): void;

	interface BlockAtlasTextureCoords {
		u1: number, v1: number, u2: number, v2: number;
	}

	function getBlockAtlasTextureCoords(str: string, int: number): BlockAtlasTextureCoords;
}

/**
 * Module used to create blocks with any custom model
 */
declare namespace BlockRenderer {
    /**
     * Class representing model used by [[BlockRenderer]]
     */
    class Model {
        /**
         * Creates a new empty model
         */
        constructor();

        /**
         * Constructs new model using specified [[RenderMesh]]
         */
        constructor(mesh: RenderMesh);

        /**
         * 
         * @param descr 
         */
        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, descr: ModelTextureSet);

        constructor(descr: ModelTextureSet);

        /**
         * Constructs new block model with single box inside specified block shape. 
         * The width of the full block is 1x1x1 units.
         * @param texName block texture name to be used with the model
         * @param texId block texture meta to be used with the model
         */
        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, texName: string, texId: number);

        /**
         * Constructs new block model with single box of the normal block size.
         * @param texName block texture name to be used with the model
         * @param texId block texture meta to be used with the model
         */
        constructor(texName: string, texId: number);

        /**
         * Constructs new block model with single box inside specified block shape. 
         * The width of the full block is 1x1x1 units. Uses block id and data to
         * determine texture
         * @param id sample block id
         * @param data sample block data
         */
        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number);

        /**
         * Constructs new block model with single box of the normal block size.
         * The width of the full block is 1x1x1 units. Uses block id and data to
         * determine texture
         * @param id 
         * @param data 
         */
        constructor(id: number, data: number);

        /**
         * Adds new box to the model using specified block's textures
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;

        /**
         * Adds new box to the model using specified textures for the six sides
         * of the box
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, descr: ModelTextureSet): void;

        /**
         * Adds new box to the model using specified block texture name and id
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, texName: string, texId: number): void;

        /**
         * Adds new block with specified block's textures
         */
        addBox(id: number, data?: number): void;

        /**
         * Adds new [[RenderMesh]] to the model
         */
        addMesh(mesh: RenderMesh): void;
    }

    /**
     * Type used to describe a new model for [[BlockRenderer]]
     */
    type ModelTextureSet =
        [string, number][];

    /**
     * Creates a new empty block model
     * @returns empty block model
     */
    function createModel(): BlockRenderer.Model;

    /**
     * Constructs new block model of specified simple block shape with specified 
     * textures
     * @param descr texture set used for the box
     */
    function createTexturedBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, descr: ModelTextureSet): BlockRenderer.Model;

    /**
     * Constructs new block model of specified simple block of the normal block
     * size shape with specified textures
     * @param descr texture set used for the box
     */
    function createTexturedBlock(descr: ModelTextureSet): BlockRenderer.Model;

    /**
     * Adds "CustomBlockTessellation" callback function for specified block id 
     * @param id block id
     * @param callback function to be called when the event occurs
     */
    function addRenderCallback(id: number, callback: Callback.CustomBlockTessellationFunction): void;

    /**
     * Forces block renders to be rebuilt immediately
     * @param mode if 0 is passed, only the specified block gets rebuilt, if 
     * 1 is passed, all the blocks along y axes are rebuilt
     */
    function forceRenderRebuild(x: number, y: number, z: number, mode: number): void;

    /**
     * Specifies custom collision shape for the block
     * @param id block id
     * @param data block data
     * @param shape [[ICRender.CollisionShape]] object to be used as 
     * default collision shape for the specified block
     */
    function setCustomCollisionShape(id: number, data: number, shape: ICRender.CollisionShape): void;

    /**
     * Specifies custom raycast shape for the block
     * @param id block id
     * @param data block data or -1 to map all the data values
     * @param shape [[ICRender.CollisionShape]] object to be used as
     * default raycast shape for the specified block
     */
    function setCustomRaycastShape(id: number, data: number, shape: ICRender.CollisionShape): void;

    /**
     * Specifies custom collision and raycast shape for the block
     * @param id block id
     * @param data block data or -1 to map all the data values
     * @param shape [[ICRender.CollisionShape]] object to be used as
     * default collision and raycast shape for the specified block
     */
    function setCustomCollisionAndRaycastShape(id: number, data: number, shape: ICRender.CollisionShape): void;

    /**
     * Enables custom rendering for the specified block
     * @param id block id
     * @param data block data or -1 to map all the data values
     */
    function enableCustomRender(id: number, data: number): void;

    /**
     * Disables custom rendering for the specified block
     * @param id block id
     * @param data block data or -1 to map all the data values
     */
    function disableCustomRender(id: number, data: number): void;

    /**
     * Sets static ICRender model as block render shape
     * @param id block id
     * @param data block data or -1 to map all the data values
     * @param icRender [[ICRender.Model]] object to be used as static block shape
     */
    function setStaticICRender(id: number, data: number, icRender: ICRender.Model): void;

    /**
     * Enables block mapping for the specified block
     * @param id block id
     * @param data block data or -1 to map all the data values
     * @param icRender default model for the block
     */
    function enableCoordMapping(id: number, data: number, icRender: ICRender.Model): void;

    /**
     * Changes shape of the block on the specified coordinates
     * @param icRender [[ICRender.Model]] object to be displayed at the coordinates
     * @param preventRebuild if false or not specified, rebuild is performed immediately 
     */
    function mapAtCoords(x: number, y: number, z: number, icRender: ICRender.Model, preventRebuild?: boolean): void;

    /**
     * Resets shape of the block to default on the specified coordinates
     * @param preventRebuild if false or not specified, rebuild is performed immediately 
     */
    function unmapAtCoords(x: number, y: number, z: number, preventRebuild?: boolean): void;

    /**
     * Changes collision shape of the block on given coords in given dimension
     * @param shape [[ICRender.CollisionShape]] object to be used as new collision shape
     */
    function mapCollisionModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;

    /**
     * Changes raycast shape of the block on given coords in given dimension
     * @param shape [[ICRender.CollisionShape]] object to be used as new raycast shape
     */
    function mapRaycastModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;

    /**
     * Changes both collision and raycast shape of the block on given coords in given dimension
     * @param shape [[ICRender.CollisionShape]] object to be used as new collision and raycast shape
     */
    function mapCollisionAndRaycastModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;

    /**
     * Resets collision shape of the block to default on given coords in given dimension
     */
    function unmapCollisionModelAtCoords(dimension: number, x: number, y: number, z: number): void;

    /**
     * Resets raycast shape of the block to default on given coords in given dimension
     */
    function unmapRaycastModelAtCoords(dimension: number, x: number, y: number, z: number): void;

    /**
     * Resets both collision and raycast shape of the block to default on given coords in given dimension
     */
    function unmapCollisionAndRaycastModelAtCoords(dimension: number, x: number, y: number, z: number): void;

    /**
     * Object used to manipulate rendered block during 
     * [[Callback.CustomBlockTessellationFunction]] calls
     */
    interface RenderAPI {
        /**
         * @returns pointer to native object instance of the following object,
         * to be used in custom native code etc.
         */
        getAddr(): number;
        /**
         * Renders box at the specified coordinates of the specified size
         * @param id id of the block to be used as texture source
         * @param data data of the block to be used as texture source
         */
        renderBoxId(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;

        /**
         * Renders box at current block coordinates of the specified size
         * @param id id of the block to be used as texture source
         * @param data data of the block to be used as texture source
         */
        renderBoxIdHere(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;

        /**
         * Renders box at the specified coordinates of the specified size
         * @param texName block texture name
         * @param texId block texture id
         */
        renderBoxTexture(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, texName: string, texId: number): void;

        /**
         * Renders box at current block coordinates of the specified size
         * @param texName block texture name
         * @param texId block texture id
         */
        renderBoxTextureHere(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;

        /**
         * Renders full block at specified coordinates
         * @param blockId id of the block to be used as texture source
         * @param blockData data of the block to be used as texture source
         */
        renderBlock(x: number, y: number, z: number, blockId: number, blockData: number): void;

        /**
         * Renders full block at current block coordinates
         * @param blockId id of the block to be used as texture source
         * @param blockData data of the block to be used as texture source
         */
        renderBlockHere(blockId: number, blockData: number): void;

        /**
         * Renders block model at the specified coordinates
         * @param model block model to be rendered at the specified coordinates
         */
        renderModel(x: number, y: number, z: number, model: BlockRenderer.Model): void;

        /**
         * Renders block model at current block coordinates
         * @param model block model to be rendered at current block coordinates
         */
        renderModelHere(model: BlockRenderer.Model): void;
    }
}

/**
 * String types of armor to be specified when calling [[Item.createArmorItem]]
 */
 declare type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";

/**
 * Module used to define items and their properties
 */
declare namespace Item {
    /**
     * @param id string id of the item
     * @returns item numeric id by its string id or just returns its numeric id 
     * if input was a numeric id
     */
    function getNumericId(id: string | number): number;

    /**
     * Gets NativeItem instance that can be used to apply some properties to the
     * item
     * @param id string id of the item
     * @returns NativeItem instance associated with this item
     */
    function getItemById(id: string): NativeItem;

    /**
     * Creates new item using specified parameters
     * @param nameID string id of the item. You should register it via 
     * [[IDRegistry.genItemID]] call first
     * @param name item name in English. Add translations to the name using
     * [[Translation]] module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     * @param params.stack maximum item stack size. Default value is 64
     * @param params.isTech if true, the item will not be added to creative. 
     * Default value is false
     */
    function createItem(nameID: string, name: string, texture: TextureData, params?: { stack?: number, isTech?: boolean }): NativeItem;

    /**
     * Creates eatable item using specified parameters
     * @param nameID string id of the item. You should register it via 
     * [[IDRegistry.genItemID]] call first
     * @param name item name in English. Add translations to the name using
     * [[Translation]] module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     * @param params.stack maximum item stack size. Default value is 64
     * @param params.isTech if true, the item will not be added to creative. 
     * Default value is false 
     * @param params.food amount of hunger restored by this food. Default value
     * is 1
     */
    function createFoodItem(nameID: string, name: string, texture: TextureData, params?: { stack?: number, isTech?: boolean, food?: number }): NativeItem;

    /**
     * @deprecated Use [[Item.createItem]] and [[Recipes.addFurnaceFuel]]
     * instead
     */
    function createFuelItem(nameID: string, name: string, texture: TextureData, params: object): void;

    /**
     * Object used in [[Item.createArmorItem]] method
     * to specify general armor item parameters
     */
    interface ArmorParams {
        /**
         * If true, the item will not be added to creative.
         * Default value is false.
         */
        isTech?: boolean,
        /**
         * Armor durability, the more it is, the more hits the armor will resist.
         * Default value is 1.
         */
        durability?: number,
        /**
         * Armor proptection. Default value is 0.
         */
        armor?: number,
        /**
         * Relative path to the armor model texture from the mod assets directory.
         * Default value is `textures/logo.png`
         */
        texture?: string,
        /**
         * Armor type, should be one of the `helmet`, `chestplate`, `leggings` or `boots`
         */
        type: ArmorType,
        /**
         * Knockback resistance, that the player will have when wearing the following armor.
         * It must be value from 0 (no knockback resistance) to 1 (full knockback resistance).
         * Default value is 0.
         */
        knockbackResist?: number;
    }

    /**
     * Creates armor item using specified parameters
     * @param nameID string id of the item. You should register it via 
     * [[IDRegistry.genItemID]] call first
     * @param name item name in English. Add translations to the name using
     * [[Translation]] module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params general armor item parameters object, the armor type there is required
     */
    function createArmorItem(nameID: string, name: string, texture: TextureData, params: ArmorParams): NativeItem;

    /**
     * Creates throwable item using specified parameters
     * @param nameID string id of the item. You should register it via 
     * [[IDRegistry.genItemID]] call first
     * @param name item name in English. Add translations to the name using
     * [[Translation]] module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     * @param params.stack maximum item stack size. Default value is 64
     * @param params.isTech if true, the item will not be added to creative. 
     * Default value is false 
     */
    function createThrowableItem(nameID: string, name: string, texture: TextureData, params: any): NativeItem;

    /**
     * @param id numeric item id
     * @returns true if given item is vanilla item, false otherwise
     */
    function isNativeItem(id: number): boolean;

    /**
     * @param id numeric item id
     * @returns maximum damage value for the specified item
     */
    function getMaxDamage(id: number): number;

    /**
     * @param id numeric item id
     * @returns maximum stack size for the specified item
     */
    function getMaxStack(id: number): number;

    /**
     * @param id numeric item id
     * @param data item data
     * @param encode no longer supported, do not use this parameter
     * @returns current item name
     */
    function getName(id: number, data: number, encode?: any): string;

    /**
     * @param id numeric item id
     * @param data no longer supported, do not use this parameter
     * @returns true, if an item with such id exists, false otherwise
     */
    function isValid(id: number, data?: number): boolean;

    /**
     * Adds item to creative inventory
     * @param id string or numeric item id
     * @param count amount of the item to be added, generally should be 1
     * @param data item data
     */
    function addToCreative(id: number | string, count: number, data: number, extra?: ItemExtraData): void;

    /**
     * Applies several properties via one method call
     * @deprecated Consider using appropriate setters instead
     * @param numericID numeric item id
     * @param description 
     */
    function describeItem(numericID: number, description: {
        category?
    }): void;

    /**
     * Sets item creative category
     * @param id string or numeric item id
     * @param category item category, should be one of the 
     * [[Native.ItemCategory]] values
     */
    function setCategory(id: number | string, category: number): void;

    /**
     * Specifies how the item can be enchanted
     * @param id string or numeric item id
     * @param enchant enchant type defining when enchants can or cannot be
     * applied to this item, one of the [[Native.EnchantType]]
     * @param value quality of the enchants that are applied, the higher this 
     * value is, the better enchants you get with the same level
     */
    function setEnchantType(id: number | string, enchant: number, value: number): void;

    /**
     * Specifies what items can be used to repair this item in the anvil
     * @param id string or numeric item id
     * @param items array of numeric item ids to be used as repair items
     */
    function addRepairItemIds(id: number | string, items: number[]): void;

    /**
     * Specifies how the player should hold the item
     * @param id string or numeric item id
     * @param enabled if true, player holds the item as a tool, not as a simple
     * item
     */
    function setToolRender(id: number | string, enabled: boolean): void;

    /**
     * Sets item maximum data value
     * @param id string or numeric item id
     * @param maxdamage maximum data value for the item
     */
    function setMaxDamage(id: number | string, maxdamage: number): void;

    /**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param id string or numeric item id
     * @param enabled if true, the item will be displayed as glint item
     */
    function setGlint(id: number | string, enabled: boolean): void;

    /**
     * Allows to click with item on liquid blocks
     * @param id string or numeric item id
     * @param enabled if true, liquid blocks can be selected on click
     */
    function setLiquidClip(id: number | string, enabled: boolean): void;

    /** 
     * @deprecated No longer supported
     */
    function setStackedByData(id: number | string, enabled: boolean): void;

    /**
     * Allows item to be put in offhand slot
     * @param id string or numeric item id
     * @param allowed
     */
    function setAllowedInOffhand(id: number | string, allowed: boolean): void;

    /**
     * Sets additional properties for the item, uses Minecraft mechanisms to
     * set them. Full list of properties is currently unavailable 
     * @param id string or numeric item id
     * @param props JSON string containing some of the properties
     */
    function setProperties(id: number | string, props: string): void;

    /**
     * Sets animation type for the item
     * @param id string or numeric item id
     * @param animType use animation type, one of the [[Native.ItemAnimation]] 
     * values
     */
    function setUseAnimation(id: number | string, animType: number): void;

    /**
     * Limits maximum use duration. This is useful to create such items as bows
     * @param id string or numeric item id
     * @param duration maximum use duration in ticks
     */
    function setMaxUseDuration(id: number | string, duration: number): void;

    /**
     * Same as [[Item.registerUseFunction]], but supports numeric ids only
     */
    function registerUseFunctionForID(numericID: number, useFunc: Callback.ItemUseLocalFunction): void;

    /**
     * Registers function that is called when user touches some block in the 
     * world with specified item
     * @param nameID string or numeric id of the item
     * @param useFunc function that is called when such an event occurs
     */
    function registerUseFunction(nameID: string | number, useFunc: Callback.ItemUseLocalFunction): void;

    /**
     * Same as [[Item.registerThrowableFunction]], but supports numeric ids only
     */
    function registerThrowableFunctionForID(numericID: number, useFunc: Callback.ProjectileHitFunction): void;

    /**
     * Registers function that is called when throwable item with specified id
     * hits block or entity
     * @param nameID string or numeric id of the item
     * @param useFunc function that is called when such an event occurs
     */
    function registerThrowableFunction(nameID: string | number, useFunc: Callback.ProjectileHitFunction): void;

    /**
     * Registers item id as requiring item icon override and registers function 
     * to perform such an override
     * @param nameID string or numeric id of the item
     * @param func function that is called to override item icon. Should return 
     * [[Item.TextureData]] object to be used for the item. See 
     * [[Callback.ItemIconOverrideFunction]] documentation for details
     */
    function registerIconOverrideFunction(nameID: string | number, func: Callback.ItemIconOverrideFunction): void;

    /**
     * Registers function to perform item name override
     * @param nameID string or numeric id of the item
     * @param func function that is called to override item name. Should return 
     * string to be used as new item name
     */
    function registerNameOverrideFunction(nameID: string | number, func: Callback.ItemNameOverrideFunction): void;

    /**
     * Registers function to be called when player uses item in the air (not on
     * the block)
     * @param nameID string or numeric id of the item
     * @param func function that is called when such an event occurs
     */
    function registerNoTargetUseFunction(nameID: string | number, func: Callback.ItemUseNoTargetFunction): void;

    /**
     * Registers function to be called when player doesn't complete using item 
     * that has maximum use time set with [[Item.setMaxUseDuration]] function.
     * Vanilla bow uses this function with max use duration of 72000 ticks
     * @param nameID string or numeric id of the item
     * @param func function that is called when such an event occurs
     */
    function registerUsingReleasedFunction(nameID: string | number, func: Callback.ItemUsingReleasedFunction): void;

    /**
     * Registers function to be called when player completes using item 
     * that has maximum use time set with [[Item.setMaxUseDuration]] function
     * @param nameID string or numeric id of the item
     * @param func function that is called when such an event occurs
     */
    function registerUsingCompleteFunction(nameID: string | number, func: Callback.ItemUsingCompleteFunction): void;

    /**
     * Registers function to be called when item is dispensed from dispenser. 
     * @param nameID string or numeric id of the item
     * @param func function that is called when such an event occurs
     */
    function registerDispenseFunction(nameID: string | number, func: Callback.ItemDispensedFunction): void;

    /**
     * Creates group of creative items.
     * @param name name of group
     * @param displayedName name of group in game
     * @param ids array of items in group
     */
    function addCreativeGroup(name: string, displayedName: string, ids: number[]): void

    /**
     * Invoke click on the block in world
     * @param coords Coords of click on the block
     * @param item item which used on the block
     * @param noModCallback if true, mod ItemUse callback will be not executed
     * @param entity Player who clicked on the block
     */
    function invokeItemUseOn(coords: Callback.ItemUseCoordinates, item: ItemInstance, noModCallback: boolean, entity: number): void

    /**
     * @deprecated Should not be used in new mods, consider using [[Item]] 
     * properties setters instead
     */
    function setPrototype(nameID: any, Prototype: any): void;

    /**
     * Class representing item used to set its properties
     */
    interface NativeItem {

        addRepairItem(id: number): void;

        addRepairItems(id: number[]): void;

        setAllowedInOffhand(allowed: boolean): void;

        setArmorDamageable(damageable: boolean): void;

        setCreativeCategory(category: number): void;

        setEnchantType(type: number): void;

        setEnchantType(enchant: number, value: number): void;

        setEnchantability(enchant: number, value: number): void;

        setGlint(glint: boolean): void;

        setHandEquipped(equipped: boolean): void;

        setLiquidClip(clip: boolean): void;

        setMaxDamage(maxDamage: number): void;

        setMaxStackSize(maxStack: number): void;

        setMaxUseDuration(duration: number): void;

        /**@deprecated */
        setProperties(props: string): void;

        setStackedByData(stacked: boolean): void;

        setUseAnimation(animation: number): void;

    }

    /**
     * Represents item texture data. For example, if 'items-opaque' folder 
     * contains file *nugget_iron_0.png*, you should pass *nugget_iron* as 
     * texture name and 0 as texture index. _N suffix can be omitted, but it is
     * generally not recommended
     */
    interface TextureData {
        /**
         * Texture name, name of the file stored in the 'items-opaque' asset
         * folder without extension and _N suffixes
         */
        name: string,

        /**
         * Texture index defined by _N texture suffix. Default value id 0
         */
        data?: number,

        /**
         * @deprecated same as data, so data is preferred in all cases
         */
        meta?: number
    }
    
    /**
     * All items name override functions object for internal use
     */
    var nameOverrideFunctions: {[key: number]: Callback.ItemNameOverrideFunction};

    /**
     * All items icon override functions object for internal use
     */
    var iconOverrideFunctions: {[key: number]: Callback.ItemIconOverrideFunction};

}

// Backward compatibility
declare type TransferPolicy = com.zhekasmirnov.apparatus.api.container.ItemContainerFuncs.TransferPolicy;

/**
 * New type of TileEntity container that supports multiplayer
 */
declare class ItemContainer extends com.zhekasmirnov.apparatus.api.container.ItemContainer {
	static class: java.lang.Class<ItemContainer>;
	/**
	 * Constructs a new [[ItemContainer]] object
	 */
	constructor();
	/**
	 * Constructs a new [[ItemContainer]] object from given deprecated [[UI.Container]] object
	 */
	constructor(legacyContainer: UI.Container);
}

declare class ItemContainerSlot extends com.zhekasmirnov.apparatus.api.container.ItemContainerSlot {}
/**
 * Class representing item extra data. Used to store additional information 
 * about item other then just item id and data
 */
declare class ItemExtraData extends com.zhekasmirnov.innercore.api.NativeItemInstanceExtra {
	static class: java.lang.Class<ItemExtraData>;
	/**
	 * Creates an empty [[ItemExtraData]] instance
	 */
	constructor();
	/**
	 * Creates a copy of current [[ItemExtraData]] instance with the same contents
	 */
	constructor(extraData?: ItemExtraData);
}

/**
 * Module used to handle callbacks. See {@page Callbacks} for details about the 
 * callback mechanism and the list of pre-defined callbacks
 */
declare namespace Callback {

    /**
     * Adds callback function for the specified callback name. Most of native 
     * events can be prevented using [[Game.prevent]] call.
     * @param name callback name, should be one of the pre-defined or a custom
     * name if invoked via [[Callback.invokeCallback]]
     * @param func function to be called when an event occurs
     * @param priority the more this value is, the earlier your callback handler will be called when an event occurs
     */
    function addCallback(name: string, func: Function, priority?: number): void;

    function addCallback(name: "CraftRecipePreProvided", func: CraftRecipePreProvidedFunction, priority?: number): void;

    function addCallback(name: "CraftRecipeProvidedFunction", func: CraftRecipeProvidedFunction, priority?: number): void;

    function addCallback(name: "VanillaWorkbenchCraft", func: VanillaWorkbenchCraftFunction, priority?: number): void;

    function addCallback(name: "VanillaWorkbenchPostCraft", func: VanillaWorkbenchCraftFunction, priority?: number): void;

    function addCallback(name: "VanillaWorkbenchRecipeSelected", func: VanillaWorkbenchRecipeSelectedFunction, priority?: number): void;

    function addCallback(name: "ContainerClosed", func: ContainerClosedFunction, priority?: number): void;

    function addCallback(name: "ContainerOpened", func: ContainerOpenedFunction, priority?: number): void;

    function addCallback(name: "CustomWindowOpened", func: CustomWindowOpenedFunction, priority?: number): void;

    function addCallback(name: "CustomWindowClosed", func: CustomWindowClosedFunction, priority?: number): void;

    function addCallback(name: "CoreConfigured", func: CoreConfiguredFunction, priority?: number): void;

    function addCallback(name: "LevelSelected", func: LevelSelectedFunction, priority?: number): void;

    function addCallback(name: "DimensionLoaded", func: DimensionLoadedFunction, priority?: number): void;

    function addCallback(name: "DestroyBlock", func: DestroyBlockFunction, priority?: number): void;

    function addCallback(name: "DestroyBlockStart", func: DestroyBlockFunction, priority?: number): void;

    function addCallback(name: "DestroyBlockContinue", func: DestroyBlockContinueFunction, priority?: number): void;

    function addCallback(name: "BuildBlock", func: BuildBlockFunction, priority?: number): void;

    function addCallback(name: "BlockChanged", func: BlockChangedFunction, priority?: number): void;

    function addCallback(name: "ItemUse", func: ItemUseFunction, priority?: number): void;

    function addCallback(name: "ItemUseLocalServer", func: ItemUseFunction, priority?: number): void;

    function addCallback(name: "Explosion", func: ExplosionFunction, priority?: number): void;

    function addCallback(name: "FoodEaten", func: FoodEatenFunction, priority?: number): void;

    function addCallback(name: "ExpAdd", func: ExpAddFunction, priority?: number): void;

    function addCallback(name: "ExpLevelAdd", func: ExpLevelAddFunction, priority?: number): void;

    function addCallback(name: "NativeCommand", func: NativeCommandFunction, priority?: number): void;

    function addCallback(name: "PlayerAttack", func: PlayerAttackFunction, priority?: number): void;

    function addCallback(name: "EntityAdded", func: EntityAddedFunction, priority?: number): void;

    function addCallback(name: "EntityRemoved", func: EntityRemovedFunction, priority?: number): void;

    function addCallback(name: "EntityDeath", func: EntityDeathFunction, priority?: number): void;

    function addCallback(name: "EntityHurt", func: EntityHurtFunction, priority?: number): void;

    function addCallback(name: "EntityInteract", func: EntityInteractFunction, priority?: number): void;

    function addCallback(name: "ProjectileHit", func: ProjectileHitFunction, priority?: number): void;

    function addCallback(name: "RedstoneSignal", func: RedstoneSignalFunction, priority?: number): void;

    function addCallback(name: "PopBlockResources", func: PopBlockResourcesFunction, priority?: number): void;

    function addCallback(name: "ItemIconOverride", func: ItemIconOverrideFunction, priority?: number): void;

    function addCallback(name: "ItemNameOverride", func: ItemNameOverrideFunction, priority?: number): void;

    function addCallback(name: "ItemUseNoTarget", func: ItemUseNoTargetFunction, priority?: number): void;

    function addCallback(name: "ItemUsingReleased", func: ItemUsingReleasedFunction, priority?: number): void;

    function addCallback(name: "ItemUsingComplete", func: ItemUsingCompleteFunction, priority?: number): void;

    function addCallback(name: "ItemDispensed", func: ItemDispensedFunction, priority?: number): void;

    function addCallback(name: "NativeGuiChanged", func: NativeGuiChangedFunction, priority?: number): void;

    function addCallback(name: "GenerateChunk", func: GenerateChunkFunction, priority?: number): void;

    /**
     * @deprecated
     */
    function addCallback(name: "GenerateChunkUnderground", func: GenerateChunkFunction, priority?: number): void;

    function addCallback(name: "GenerateNetherChunk", func: GenerateChunkFunction, priority?: number): void;

    function addCallback(name: "GenerateEndChunk", func: GenerateChunkFunction, priority?: number): void;

    function addCallback(name: "GenerateChunkUniversal", func: GenerateChunkFunction, priority?: number): void;

    function addCallback(name: "GenerateBiomeMap", func: GenerateChunkFunction, priority?: number): void;

    function addCallback(name: "ReadSaves", func: SavesFunction, priority?: number): void;

    function addCallback(name: "WriteSaves", func: SavesFunction, priority?: number): void;

    function addCallback(name: "CustomBlockTessellation", func: CustomBlockTessellationFunction, priority?: number): void;

    function addCallback(name: "ServerPlayerTick", func: ServerPlayerTickFunction, priority?: number): void;

    function addCallback(name: "CustomDimensionTransfer", func: CustomDimensionTransferFunction, priority?: number): void;

    function addCallback(name: "BlockEventEntityInside", func: Block.EntityInsideFunction, priority?: number): void;

    function addCallback(name: "BlockEventEntityStepOn", func: Block.EntityStepOnFunction, priority?: number): void;

    function addCallback(name: "BlockEventNeighbourChange", func: Block.NeighbourChangeFunction, priority?: number): void;

    function addCallback(name: "PopBlockResources", func: PopBlockResourcesFunction, priority?: number): void;

    function addCallback(name: "ConnectingToHost", func: ConnectingToHostFunction, priority?: number): void;

    function addCallback(name: "DimensionUnloaded", func: DimensionUnloadedFunction, priority?: number): void;

    function addCallback(name: "LevelPreLeft", func: {(): void}, priority?: number): void;

    function addCallback(name: "LevelLeft", func: {(): void}, priority?: number): void;

    function addCallback(name: "ItemUseLocal", func: ItemUseLocalFunction, priority?: number): void;

    function addCallback(name: "SystemKeyEventDispatched", func: SystemKeyEventDispatchedFunction, priority?: number): void;

    function addCallback(name: "NavigationBackPressed", func: {(): void}, priority?: number): void;

    function addCallback(name: "LevelCreated", func: {(): void}, priority?: number): void;

    function addCallback(name: "LevelDisplayed", func: {(): void}, priority?: number): void;

    function addCallback(name: "LevelPreLoaded", func: LevelLoadedFunction, priority?: number): void;

    function addCallback(name: "LevelLoaded", func: LevelLoadedFunction, priority?: number): void;

    function addCallback(name: "LocalLevelLoaded", func: {(): void}, priority?: number): void;

    function addCallback(name: "LocalTick", func: {(): void}, priority?: number): void;

    function addCallback(name: "AppSuspended", func: {(): void}, priority?: number): void;

    function addCallback(name: "EntityPickUpDrop", func: EntityPickUpDropFunction, priority?: number): void;

    function addCallback(name: "ServerPlayerLoaded", func: PlayerFunction, priority?: number): void;
    
    function addCallback(name: "ServerPlayerLeft", func: PlayerFunction, priority?: number): void;

    function addCallback(name: "GenerateCustomDimensionChunk", func: GenerateCustomDimensionChunkFunction, priority?: number): void;

    /**
     * Invokes callback with any name and up to 10 additional parameters. You
     * should not generally call pre-defined callbacks until you really need to 
     * do so. If you want to trigger some event in your mod, use your own 
     * callback names
     * @param name callback name
     */
    function invokeCallback(name: string, o1?: any, o2?: any, o3?: any, o4?: any, o5?: any, o6?: any, o7?: any, o8?: any, o9?: any, o10?: any): void;

    /**
     * Function used in "CraftRecipePreProvided" callback
     * @param recipe object containing recipe information
     * @param field object containing crafting field information
     */
    interface CraftRecipePreProvidedFunction {
        (recipe: Recipes.WorkbenchRecipe, field: Recipes.WorkbenchField): void
    }

    /**
     * Function used in "CraftRecipeProvided" callback
     * @param recipe object containing recipe information
     * @param field object containing crafting field information
     * @param isPrevented if true, recipe was prevented by craft function
     */
    interface CraftRecipeProvidedFunction {
        (recipe: Recipes.WorkbenchRecipe, field: Recipes.WorkbenchField, isPrevented: boolean): void
    }

    /**
     * Function used in "VanillaWorkbenchCraft" and "VanillaWorkbenchPostCraft" 
     * callbacks
     * @param result recipe result item
     * @param workbenchContainer workbench container instance
     */
    interface VanillaWorkbenchCraftFunction {
        (result: ItemInstance, workbenchContainer: UI.Container, player: number): void
    }

    /**
     * Function used in "VanillaWorkbenchRecipeSelected" callback
     * @param recipe object containing recipe information
     * @param result recipe result item
     * @param workbenchContainer workbench container instance
     */
    interface VanillaWorkbenchRecipeSelectedFunction {
        (recipe: Recipes.WorkbenchRecipe, result: ItemInstance, workbenchContainer: UI.Container)
    }

    /**
     * Function used in "ContainerClosed" callback
     * @param container container that was closed
     * @param window window that was loaded in the container
     * @param byUser if true, container was closed by user, from the code 
     * otherwise
     */
    interface ContainerClosedFunction {
        (container: UI.Container, window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow, byUser: boolean): void
    }

    /**
     * Function used in "ContainerOpened" callback
     * @param container container that was opened
     * @param window window that was loaded in the container
     */
    interface ContainerOpenedFunction {
        (container: UI.Container, window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow | UI.WindowGroup): void
    }

    /**
     * Function used in "CustomWindowOpened" callback
     * @param window window that was opened
     */
    interface CustomWindowOpenedFunction {
        (window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow): void;
    }

    /**
     * Function used in "CustomWindowClosed" callback
     * @param window window that was closed
     */
    interface CustomWindowClosedFunction {
        (window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow): void;
    }

    /**
     * Function used in "CoreConfigured" callback
     * @param config Inner Core default config instance
     */
    interface CoreConfiguredFunction {
        (config: Config): void;
    }

    /**
     * Function used in "LevelSelected" callback
     * @param worldName name of the selected world
     * @param worldDir name of the directory where the world is stored. Worlds
     * directories are located at games/horizon/minecraftWorlds/
     */
    interface LevelSelectedFunction {
        (worldName: string, worldDir: string): void
    }

    /**
     * Function used in "DimensionLoaded" callback
     * @param dimension vanilla dimension id, one of the [[Native.Dimension]]
     * values, or custom dimension id
     */
    interface DimensionLoadedFunction {
        (dimension: number): void
    }

    /**
     * Function used in "DestroyBlock" and "DestroyBlockStart" callbacks
     * @param coords coordinates where the block is destroyed and side from
     * where it is destroyed
     * @param block block that is destroyed
     * @param player player entity unique numeric id
     */
    interface DestroyBlockFunction {
        (coords: ItemUseCoordinates, block: Tile, player: number): void
    }

    /**
     * Function used in "DestroyBlockContinue" callback 
     * @param coords coordinates where the block is destroyed and side from
     * where it is destroyed
     * @param block block that is destroyed
     * @param progress current fraction of breaking progress
     */
    interface DestroyBlockContinueFunction {
        (coords: ItemUseCoordinates, block: Tile, progress: number): void
    }

    /**
     * Function used in "BuildBlock" callback
     * @param coords coordinates where the block is placed and side from
     * where it is placed
     * @param block block that is placed
     * @param player player entity unique numeric id
     */
    interface BuildBlockFunction {
        (coords: ItemUseCoordinates, block: Tile, player: number): void
    }

    /**
     * Function used in "BlockChanged" callback
     * @param coords coordinates where block change occurred
     * @param oldBlock the block that is being replaced 
     * @param newBlock replacement block
     * @param region BlockSource object
     */
    interface BlockChangedFunction {
        (coords: Vector, oldBlock: Tile, newBlock: Tile, region: BlockSource): void
    }

    /**
     * Function used in "ItemUse" and "ItemUseLocalServer" callbacks
     * @param coords set of all coordinate values that can be useful to write 
     * custom use logics
     * @param item item that was in the player's hand when he touched the block
     * @param block block that was touched
     * @param isExternal
     * @param player player entity uID
     */
    interface ItemUseFunction {
        (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number): void
    }

    /**
     * Function used in "ItemUseLocal" callback,
     * and also in [[Item.registerUseFunction]] and [[Item.registerUseFunctionForID]] methods
     * @param coords set of all coordinate values that can be useful to write 
     * custom use logics
     * @param item item that was in the player's hand when he touched the block
     * @param block block that was touched
     * @param player player entity uID
     */
    interface ItemUseLocalFunction {
        (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void
    }

    /**
     * Function used in "Explosion" callback
     * @param coords coordinates of the explosion
     * @param params additional explosion data
     * @param params.power explosion power
     * @param params.entity if explosion is produced by an entity, entity unique
     * id, -1 otherwise
     * @param onFire if true, explosion produced the fire
     * @param someBool some boolean value
     * @param someFloat some floating point value
     */
    interface ExplosionFunction {
        (coords: Vector, params: { power: number, entity: number, onFire: boolean, someBool: boolean, someFloat: number }): void
    }

    /**
     * Function used in the "FoodEaten" callback. You can use 
     * [[Entity.getCarriedItem]] to get info about food item
     * @param food food amount produced by eaten food
     * @param ratio saturation ratio produced by food
     * @param player player entity uID
     */
    interface FoodEatenFunction {
        (food: number, ratio: number, player: number): void
    }

    /**
     * Function used in "ExpAdd" callback
     * @param exp amount of experience to be added
     * @param player player's uID
     */
    interface ExpAddFunction {
        (exp: number, player: number): void
    }

    /**
     * Function used in "ExpLevelAdd" callback
     * @param level amount of levels to be added 
     * @param player player's uID
     */
    interface ExpLevelAddFunction {
        (level: number, player: number): void
    }

    /**
     * Function used in "NativeCommand" callback
     * @param command command that was entered or null if no command was 
     * provided
     */
    interface NativeCommandFunction {
        (command: Nullable<string>): void
    }

    /**
     * Function used in "PlayerAttack" callback
     * @param attacker player entity unique id
     * @param victim attacked entity unique id
     */
    interface PlayerAttackFunction {
        (attacker: number, victim: number): void
    }

    /**
     * Function used in "EntityAdded" callback
     * @param entity entity unique id
     */
    interface EntityAddedFunction {
        (entity: number): void
    }

    /**
     * Function used in "EntityRemoved" callback
     * @param entity entity unique id
     */
    interface EntityRemovedFunction {
        (entity: number): void
    }

    /**
     * Function used in "EntityDeath" callback
     * @param entity entity that is dead
     * @param attacker if the entity was killed by another entity, attacker's 
     * entity unique id, -1 otherwise
     * @param damageType damage source id
     */
    interface EntityDeathFunction {
        (entity: number, attacker: number, damageType: number): void
    }

    /**
     * Function used in "EntityHurt" callback
     * @param attacker if an entity was hurt by another entity, attacker's 
     * unique id, -1 otherwise
     * @param entity entity that is hurt
     * @param damageValue amount of damage produced to entity
     * @param damageType damage source id
     * @param someBool1 some boolean value
     * @param someBool2 some boolean value
     */
    interface EntityHurtFunction {
        (attacker: number, entity: number, damageValue: number, damageType: number, someBool1: boolean, someBool2: boolean): void
    }

    /**
     * Function used in "EntityInteract" callback
     * @param entity entity unique id
     * @param player player entity unique id
     */
    interface EntityInteractFunction {
        (entity: number, player: number, coords: Vector): void
    }

    /**
     * Function used in "ProjectileHit" callback
     * @param projectile projectile entity unique ID
     * @param item projectile item
     * @param target object containing hit coordinates and information about 
     * hit entity/block
     */
    interface ProjectileHitFunction {
        (projectile: number, item: ItemInstance, target: ProjectileHitTarget): void
    }

    /**
     * Function used in "RedstoneSignal" callback
     * @param coords coordinates where redstone signal changed
     * @param params information about redstone signal
     * @param params.power redstone signal power
     * @param params.signal same as params.power
     * @param params.onLoad always true
     * @param block information about the block on the specified coordinates
     */
    interface RedstoneSignalFunction {
        (coords: Vector, params: { power: number, signal: number, onLoad: boolean }, block: Tile, world?: BlockSource): void
    }

    /**
     * Function used in "PopBlockResources" callback
     * @param coords coordinates of the block that was broken
     * @param block information about the block that was broken
     * @param i unknown parameter, supposed to always be zero
     */
    interface PopBlockResourcesFunction {
        (coords: Vector, block: Tile, explosionRadius: number, i: number, region: BlockSource): void
    }

    /**
     * Function used in "ItemIconOverride" callback
     * @param item information about item that is used in override function
     * @param isModUi whether icon override is working in mod ui or in vanilla one
     * @returns void if used in callback, [[Item.TextureData]] if used in item 
     * override function to return texture that will be used for the item
     */
    interface ItemIconOverrideFunction {
        (item: ItemInstance, isModUi: boolean): void | Item.TextureData
    }

    /**
     * Function used in "ItemNameOverride" callback
     * @param item information about item that is used in override function
     * @param translation translated item name
     * @param name original item name
     * @returns void if used in callback, string if used in item override 
     * function to return new name that will be displayed
     */
    interface ItemNameOverrideFunction {
        (item: ItemInstance, translation: string, name: string): void | string;
    }

    /**
     * Function used in "ItemUseNoTarget" callback
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks player kept touching screen
     */
    interface ItemUseNoTargetFunction {
        (item: ItemInstance, player: number): void
    }

    /**
     * Function used in "ItemUsingReleased" callback
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks left to the specified max use duration value
     */
    interface ItemUsingReleasedFunction {
        (item: ItemInstance, ticks: number, player: number): void
    }

    /**
     * Function used in "ItemUsingComplete" callback
     * @param item item that was in the player's hand when the event occurred
     */
    interface ItemUsingCompleteFunction {
        (item: ItemInstance, player: number): void
    }

    /**
     * Function used in "ItemDispensed" callback
     * @param coords full coords object, where the main coords are the position of the dispenser block,
     * `relative` ones are the position of the block to which the dispenser is pointed,
     * and `vec` are the coords for the item to be dropped at
     * @param item item that was dispensed
     * @param region BlockSource object
     * @param slot numeric id of the slot from which the item was dispensed
     */
    interface ItemDispensedFunction {
        (coords: Callback.ItemUseCoordinates, item: ItemInstance, region: BlockSource, slot: number): void
    }

    /**
     * Function used in "NativeGuiChanged" callback
     * @param screenName current screen name
     * @param lastScreenName previous screen name
     * @param isPushEvent if true, the new screen was pushed on the Minecraft 
     * screens stack, popped from the stack otherwise
     */
    interface NativeGuiChangedFunction {
        (screenName: string, lastScreenName: string, isPushEvent: boolean): void
    }

    /**
     * Function used in all generation callbacks
     * @param chunkX chunk X coordinate. Multiply by 16 to receive corner block 
     * coordinates
     * @param chunkY chunk Y coordinate. Multiply by 16 to receive corner block 
     * coordinates
     * @param random java.util.Random object that should be used for generation
     * process. Already seeded by appropriate values
     * @param dimensionId current dimension's numeric id
     * @param chunkSeed chunk-specific seed to use in chunk random generation
     * @param chunkSeed world-specific seed to use in chunk generation
     * @param dimensionSeed dimension-specific seed to use in chunk generation
     */
    interface GenerateChunkFunction {
        (chunkX: number, chunkZ: number, random: java.util.Random,
            dimensionId: number, chunkSeed: number, worldSeed: number, dimensionSeed: number): void
    }

    /**
     * Function used in "ReadSaves" and "WriteSaves" callbacks
     * Avoid modifying values directly, consider using [[Saver]] instead
     */
    interface SavesFunction {
        (globalScope: object): void
    }

    /**
     * Function used in "CustomBlockTessellation" callback
     * @param api object used to manipulate block rendering process
     * @param coords rendering block coordinates
     * @param block block information
     * @param b unused Boolean parameter
     */
    interface CustomBlockTessellationFunction {
        (api: BlockRenderer.RenderAPI, coords: Vector, block: Tile, b: boolean): void
    }

	/**
     * Function used in "ServerPlayerTick" callback
     * @param playerUid player entity unique id
     * @param isPlayerDead is following player dead
     */
    interface ServerPlayerTickFunction {
        (playerUid: number, isPlayerDead?: boolean): void
    }

    /**
     * Function used in "CustomDimensionTransfer" callback
     * @param entity entity that was transferred between dimensions
     * @param from id of the dimension the entity was transferred from
     * @param to id of the dimension the entity was transferred to
     */
    interface CustomDimensionTransferFunction {
    	(entity: number, from: number, to: number): void
    }

    /**
     * Function used in "ConnectingToHost" callback
     */
    interface ConnectingToHostFunction {
        (host: string, someInt: number, port: number): void
    }

    /**
     * Function used in "DimensionUnloaded" callback
     */
    interface DimensionUnloadedFunction {
        (dimensionId: number): void
    }

    /**
     * Function used in "SystemKeyEventDispatched" callback
     * @todo understand the meaning of the params
     */
    interface SystemKeyEventDispatchedFunction {
        (someInt: number, someInt2: number): void
    }

    /**
     * Function used in "LevelLoaded" and "LevelPreLoaded" callbacks
     * @todo understand param's meaning
     */
    interface LevelLoadedFunction {
        (someBool: boolean): void
    }

    /**
     * Function used in "EntityPickUpDrop" callback
     * @param entity entity that picked up the item
     * (this callback is currently called only for players)
     * @param dropEntity dropped item's entity
     * @param dropStack ItemInstance of the drop entity
     * @param count what count?
     */
    interface EntityPickUpDropFunction {
        (entity: number, dropEntity: number, dropStack: ItemInstance, count: number)
    }

    /**
     * Function used in "ServerPlayerLoaded" and "ServerPlayerLeft" callback
     * @param player unique id of the player entity, that has been connected to server
     */
    interface PlayerFunction {
        (player: number): void
    }

    /**
     * Function used in "GenerateCustomDimensionChunk" callback
     */
    interface GenerateCustomDimensionChunkFunction {
        (chunkX: number, chunkZ: number, random: java.util.Random, dimensionId: number): void
    }

    /**
     * Object containing hit coordinates and information about hit entity/block
     */
    interface ProjectileHitTarget {
        /**
         * Exact hit position x 
         */
        x: number,
        /**
         * Exact hit position y
         */
        y: number,
        /**
         * Exact hit position z
         */
        z: number,
        /**
         * If an entity was hit, entity unique id, -1 otherwise
         */
        entity: number,
        /**
         * Coordinates and side of the hit block or null if an entity was hit
         */
        coords: Nullable<ItemUseCoordinates>
    }

    /**
     * Object used in some callbacks for coordinate set with side information 
     * and relative coordinates set
     */
    interface ItemUseCoordinates extends BlockPosition {
        /**
         * Relative coordinates, coordinates of the block to the specified side 
         * of current block
         */
        relative: Vector,
        /**
         * Exact touch point, absolute point coordinates. Used only in "ItemUse"
         * callback
         */
        vec?: Vector
    }

}
