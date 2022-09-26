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
