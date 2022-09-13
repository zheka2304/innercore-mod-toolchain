/// <reference path="./android.d.ts"/>

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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module apparatus {
            export module api {
                export module container {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module apparatus {
            export module api {
                export module container {
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
    }
}
declare module com {
    export module zhekasmirnov {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module java {
                    export class JavaLibrary extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<JavaLibrary>;
                        constructor(dir: JavaDirectory, dexFile: globalThis.java.io.File);
                        constructor(dir: JavaDirectory, dexFiles: globalThis.java.util.List<globalThis.java.io.File>);
                        getDirectory(): JavaDirectory;
                        getDexFiles(): globalThis.java.util.List<globalThis.java.io.File>;
                        isInitialized(): boolean;
                        initialize(): void;
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module java {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export class LaunchSequence extends globalThis.java.lang.Object {
                    static class: globalThis.java.lang.Class<LaunchSequence>;
                    constructor(dir: ExecutionDirectory, libraries: globalThis.java.util.List<library.LibraryDirectory>, javaLibraries: globalThis.java.util.List<java.JavaLibrary>);
                    buildSequence(logger: runtime.logger.EventLogger): void;
                    loadAll(logger: runtime.logger.EventLogger): void;
                    getAllLibraries(): globalThis.java.util.List<library.LibraryDirectory>;
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module library {
                    export class Library extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<Library>;
                        static load(path: string): Library;
                        getResult(): number;
                        refreshModuleList(): void;
                        getModules(): globalThis.java.util.List<mod.Module>;
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module library {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module library {
                    export class LibraryMakeFile extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<LibraryMakeFile>;
                        constructor(file: globalThis.java.io.File);
                        getCppFlags(): string;
                        getFiles(): globalThis.java.util.List<string>;
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module library {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module mod {
                    export class ModGraphics extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ModGraphics>;
                        constructor();
                        constructor(dir: globalThis.java.io.File);
                        getNamedGroup(name: string): globalThis.java.util.HashMap<string, android.graphics.Bitmap>;
                        getGroup(name: string): globalThis.java.util.Collection<android.graphics.Bitmap>;
                        getAllBitmaps(): globalThis.java.util.List<android.graphics.Bitmap>;
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module mod {
                    export class ModInstance extends globalThis.java.lang.Object {
                        static class: globalThis.java.lang.Class<ModInstance>;
                        constructor(module: Module);
                        getModule(): Module;
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module mod {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module mod {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module repo {
                    export module storage {
                        export class TemporaryStorage extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<TemporaryStorage>;
                            constructor(dir: globalThis.java.io.File);
                            allocate(key: string): globalThis.java.io.File;
                            recycle(key: string): boolean;
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
                    export module directory {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
                    export module directory {
                        export class ResourceMeta extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<ResourceMeta>;
                            readonly file: globalThis.java.io.File;
                            constructor(file: globalThis.java.io.File);
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
                    export module runtime {
                        export class RuntimeResource extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<RuntimeResource>;
                            constructor(directory: RuntimeResourceDirectory, override: ResourceOverride, name: string);
                            getOverride(): ResourceOverride;
                            getDirectory(): RuntimeResourceDirectory;
                            getName(): string;
                            getFile(): globalThis.java.io.File;
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
                    export module runtime {
                        export class RuntimeResourceDirectory extends globalThis.java.lang.Object {
                            static class: globalThis.java.lang.Class<RuntimeResourceDirectory>;
                            readonly resourceManager: ResourceManager;
                            readonly directory: globalThis.java.io.File;
                            constructor(manager: ResourceManager, dir: globalThis.java.io.File);
                            clear(): void;
                            addHandler(handler: RuntimeResourceHandler): void;
                            handleAll(): void;
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
            export module modloader {
                export module resource {
                    export module runtime {
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
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module horizon {
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
    }
}
declare module com {
    export module zhekasmirnov {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module recipes {
                        export module workbench {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module recipes {
                        export module workbench {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module recipes {
                        export module workbench {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
                            export interface CustomDrawingDescription {
                                type: "custom",
                                onDraw?: (canvas: android.graphics.Canvas, scale: number) => void;
                            }
                            export class DrawCustom extends java.lang.Object implements IDrawing {
                                static class: java.lang.Class<DrawCustom>;
                                onDraw(canvas: android.graphics.Canvas, scale: number): void;
                                onSetup(scriptable: CustomDrawingDescription, style: types.UIStyle): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module background {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module container {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module container {
                            export class ScriptableUiVisualSlotImpl extends java.lang.Object implements UiVisualSlotImpl {
                                static class: java.lang.Class<ScriptableUiVisualSlotImpl>;
                                constructor(scriptable: ItemInstance);
                                getId(): number;
                                getCount(): number;
                                getData(): number;
                                getExtra(): Nullable<NativeItemInstanceExtra>;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module container {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module container {
                            export class UiAbstractContainer extends java.lang.Object {
                                static class: java.lang.Class<UiAbstractContainer>;
                                constructor();
                                constructor(impl: {
                                    addElementInstance(element: elements.UIElement, name: string): void;
                                    close(): void;
                                    getBinding<T=any>(element: string, bindingName: string): elements.UIElement | android.graphics.Rect | T;
                                    getElement(elementName: string): elements.UIElement;
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
                                getBinding<T=any>(element: string, bindingName: string): elements.UIElement | android.graphics.Rect | T;
                                getElement(elementName: string): elements.UIElement;
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module container {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
                            export class UICloseButtonElement extends UIButtonElement {
                                static class: java.lang.Class<UICloseButtonElement>;
                                constructor(window: window.UIWindow, desc: ButtonElementDescription);
                                onTouchEvent(event: types.TouchEvent): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module elements {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module icon {
                            export class ItemIconLoader extends java.lang.Object {
                                static class: java.lang.Class<ItemIconLoader>;
                                static load(): void;
                                static init(): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module icon {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module icon {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export class ItemModelCacheManager extends java.lang.Object {
                            static class: java.lang.Class<ItemModelCacheManager>;
                            static getSingleton(): ItemModelCacheManager;
                            getCacheGroupDirectory(group: string): java.io.File;
                            getCachePath(group: string, name: string): java.io.File;
                            getCurrentCacheGroup(): string;
                            setCurrentCacheGroup(groupName: string, lock: string): void;
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module memory {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module memory {
                            export class RandomBitmapWrap extends BitmapWrap {
                                static class: java.lang.Class<RandomBitmapWrap>;
                                constructor(bitmap: android.graphics.Bitmap);
                                store(): boolean;
                                restore(): boolean;
                                resize(width: number, height: number): BitmapWrap;
                                recycle(): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module memory {
                            export class SourceBitmapWrap extends BitmapWrap {
                                static class: java.lang.Class<SourceBitmapWrap>;
                                constructor(name: string, width: number, height: number);
                                store(): boolean;
                                restore(): boolean;
                                resize(width: number, height: number): BitmapWrap;
                                recycle(): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
                            export interface Sides { up?: boolean, down?: boolean, left?: boolean, right?: boolean }
                            export class FrameTextureSource extends java.lang.Object {
                                static class: java.lang.Class<FrameTextureSource>;
                                static getFrameTexture(name: string, style: UIStyle): FrameTexture;
                                static scriptableAsSides(obj: Sides): [boolean, boolean, boolean, boolean];
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
                            export interface ITouchEventListenerJS {
                                (touchEvent: TouchEvent): void;
                            }
                            export class ITouchEventListener extends java.lang.Object {
                                static class: java.lang.Class<ITouchEventListener>;
                                constructor();
                                constructor(impl: { onTouchEvent: (event: TouchEvent) => void });
                                onTouchEvent(event: TouchEvent): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
                            export class TouchEventType extends java.lang.Object {
                                static class: java.lang.Class<TouchEventType>;
                                static readonly DOWN: TouchEventType;
                                static readonly UP: TouchEventType;
                                static readonly MOVE: TouchEventType;
                                static readonly CLICK: TouchEventType;
                                static readonly LONG_CLICK: TouchEventType;
                                static readonly CANCEL: TouchEventType;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module types {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
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
                                    getContent(): WindowContent;
                                    getElements(): java.util.HashMap<string, elements.UIElement>;
                                    getStyle(): types.UIStyle;
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
                                getContent(): WindowContent;
                                /**
                                 * Gets all the elements in the window
                                 * @returns java.util.HashMap containing string element name as keys and
                                 * element instances as values
                                 */
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                /**
                                 * @returns object containing current style of the window
                                 */
                                getStyle(): types.UIStyle;
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
                            export class IWindowEventListener extends java.lang.Object {
                                static class: java.lang.Class<IWindowEventListener>;
                                constructor(implementation: { 
                                    onClose(win: UIWindow): void;
                                    onOpen(win: UIWindow): void;
                                });
                                onClose(win: UIWindow): void;
                                onOpen(win: UIWindow): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
                            export abstract class UIWindowStandard extends UIWindowGroup {
                                static class: java.lang.Class<UIWindowStandard>;
                                constructor(content: StandardWindowContent);
                                getContent(): StandardWindowContent;
                                getStyleSafe(): types.UIStyle;
                                setContent(content: StandardWindowContent): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
                            export class WindowParent extends java.lang.Object {
                                static class: java.lang.Class<WindowParent>;
                                static openWindow(window: UIWindow): void;
                                static closeWindow(window: UIWindow): void;
                                static applyWindowInsets(window: UIWindow, insets: android.view.WindowInsets): void;
                                static releaseWindowLayout(layout: android.view.View): void;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module ui {
                        export module window {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module mod {
                    export module util {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module api {
                export module unlimited {
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
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
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
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module pack {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
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
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
                        export module enums {
                            export class AnimationType extends java.lang.Object {
                                static class: java.lang.Class<AnimationType>;
                                static readonly TEXTURE: AnimationType;
                                static readonly DESCRIPTOR: AnimationType;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
                        export module enums {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
                        export module enums {
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
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
                        export module enums {
                            export class TextureType extends java.lang.Object {
                                static class: java.lang.Class<TextureType>;
                                static readonly BLOCK: TextureType;
                                static readonly DEFAULT: TextureType;
                                static readonly GUI: TextureType;
                                static readonly ITEM: TextureType;
                                static readonly PARTICLE: TextureType;
                            }
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
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
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
                        export class TextureAnimationFile extends ResourceFile {
                            static class: java.lang.Class<TextureAnimationFile>;
                            constructor(rfile: ResourceFile);
                            constructor(path: NonNullable<string>);
                            constructAnimation(): org.json.JSONObject;
                            isValid(): boolean;
                        }
                    }
                }
            }
        }
    }
}
declare module com {
    export module zhekasmirnov {
        export module innercore {
            export module mod {
                export module resource {
                    export module types {
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
	 * @returns drop function of the block with given numeric id
	 */
	function getDropFunction(id: number): Block.DropFunction;

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
declare class BlockState
implements Tile {

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
 * String types of armor to be specified when calling [[Item.createArmorItem]]
 */
declare type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";

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
 * Type used to mark Java bytes
 */
type jbyte = number;

type Nullable<T> = T | null;

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