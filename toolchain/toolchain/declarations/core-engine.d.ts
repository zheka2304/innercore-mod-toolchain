/**
* @packageDocumentation
* Core Engine is the most fashion Minecraft: Bedrock Edition
* engine determined to make game modded with minimum tons of code.
*/
/// <reference path='./android.d.ts' />
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
                export module build {
                    /**
                     * Json configuration file reading/writing utility.
                     */
                    export class Config extends java.lang.Object {
                        static class: java.lang.Class<Config>;
                        /**
                         * Creates new {@link com.zhekasmirnov.innercore.mod.build.Config Config} instance using specified file.
                         * @param file {@link java.io.File} instance of the file to use
                         */
                        constructor(file: java.io.File);
                        /**
                         * Creates new {@link com.zhekasmirnov.innercore.mod.build.Config Config} instance using specified file.
                         * @param path path to configuration file
                         */
                        constructor(path: string);
                        /**
                         * Writes configuration JSON to the file.
                         */
                        save(): void;
                        /**
                         * @returns Read-only ArrayList instance containing
                         * all the names in the current config file.
                         */
                        getNames(): java.util.ArrayList<string>;
                        /**
                         * Gets property from the config.
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Config instance with current config as parent if the
                         * property is object, {@link org.json.JSONArray} instance if the property is an
                         * array, raw type if the property is of that raw type, `null` otherwise.
                         * @example
                         * ```ts
                         * config.get("generation.ore_copper.max_height");
                         * ```
                         */
                        get<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(name: string): T;
                        /**
                         * Same as {@link com.zhekasmirnov.innercore.mod.build.Config.get Config.get}.
                         */
                        access<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(name: string): T;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Boolean config value specified in config or false if no value was
                         * specified.
                         */
                        getBool(name: string): boolean;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Number object instance, containing numeric value by given name
                         * from the config, or `0` if no value was specified.
                         */
                        getNumber(name: string): java.lang.Number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Integer of value by given name from the config, or `0` if no value was specified.
                         */
                        getInteger(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Floating-point number of value by given name from the config, or `0.0` if no value was specified.
                         */
                        getFloat(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns Double number of value by given name from the config, or `0.0` if no value was specified.
                         */
                        getDouble(name: string): number;
                        /**
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @returns String by given name from the config, or `null` if no value was specified.
                         */
                        getString(name: string): Nullable<string>;
                        /**
                         * Sets config value. Do not use {@link org.json.JSONObject} instances to create
                         * nested objects, consider using dot-separated names instead.
                         * @param name option name, supports multi-layer calls, separated by **'.'**
                         * @param val value, may be {@link org.json.JSONArray} instance,
                         * {@link org.json.JSONObject} instance or raw data type
                         */
                        set<T = org.json.JSONObject | org.json.JSONArray | boolean | number | string>(name: string, val: T): boolean;
                        /**
                         * @param path option name, supports multi-layer calls, separated by **'.'**
                         * @returns Editable {@link com.zhekasmirnov.innercore.mod.build.Config.ConfigValue Config.ConfigValue}
                         * instance that can be used to manipulate this config option separately.
                         */
                        getValue(path: string): Nullable<Config.ConfigValue>;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern.
                         * @param jsonstr string representation of JSON object representing the data pattern
                         */
                        checkAndRestore(jsonstr: string): void;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern.
                         * @param jsonobj javascript object representing the data pattern checkAndRestore
                         */
                        checkAndRestore(jsonobj: Scriptable): void;
                        /**
                         * Ensures that config has all the properties the data pattern contains, if
                         * not, puts default values to match the pattern.
                         * @param json {@link org.json.JSONObject} instance to be used as data pattern
                         */
                        checkAndRestore(json: org.json.JSONObject): void;
                    }
                    export module Config {
                        /**
                         * Class representing config value with it's path withing
                         * {@link com.zhekasmirnov.innercore.mod.build.Config Config} object.
                         */
                        export class ConfigValue extends java.lang.Object {
                            static class: java.lang.Class<ConfigValue>;
                            /**
                             * Sets config value and saves configuration file.
                             * @param value value, may be {@link org.json.JSONArray} instance,
                             * {@link org.json.JSONObject} instance or raw data type.
                             */
                            set<T = org.json.JSONArray | org.json.JSONObject | boolean | number | string>(value: T): void;
                            /**
                             * @returns Config value, result is the same as the result of
                             * {@link com.zhekasmirnov.innercore.mod.build.Config.get Config.get} call.
                             */
                            get<T=Nullable<Config | org.json.JSONArray | boolean | number | string>>(): T;
                            /**
                             * @returns Readable config value name
                             * representation along with class name.
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
            export module api {
                export class NativeRenderMesh extends java.lang.Object {
                    static class: java.lang.Class<NativeRenderMesh>;
                    /**
                     * Adds new mesh to the current one on the specified coordinates.
                     * @param mesh {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} object to be added to current mesh
                     * @since 2.0.2b23
                     */
                    addMesh(mesh: NativeRenderMesh): void;
                    /**
                     * Adds new mesh to the current one on the specified coordinates
                     * with specified offset.
                     * @param mesh {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} object to be added to current mesh
                     * @since 2.0.2b23
                     */
                    addMesh(mesh: NativeRenderMesh, addX: number, addY: number, addZ: number): void;
                    /**
                     * Adds new mesh to the current one on the specified coordinates
                     * with specified offset and scale.
                     * @param mesh {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} object to be added to current mesh
                     * @since 2.0.2b23
                     */
                    addMesh(mesh: NativeRenderMesh, addX: number, addY: number, addZ: number, scaleX: number, scaleY: number, scaleZ: number): void;
                    /**
                     * Adds a new vertex on the specified coordinates.
                     */
                    addVertex(x: number, y: number, z: number): void;
                    /**
                     * Adds a new vertex on the specified coordinates.
                     * @param u x texture offset of the vertex
                     * @param v y texture offset of the vertex
                     */
                    addVertex(x: number, y: number, z: number, u: number, v: number): void;
                    /**
                     * Removes all vertices of the mesh.
                     */
                    clear(): void;
                    /**
                     * Creates a copy of current {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh}.
                     * @since 2.0.2b26
                     */
                    clone(): NativeRenderMesh;
                    /**
                     * Scales the mesh to fit into the specified box.
                     * @since 2.0.2b26
                     */
                    fitIn(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void;
                    /**
                     * Scales the mesh to fit into the specified box.
                     * @param keepRatio if `true`, the ratio of the dimensions are preserved
                     * @since 2.0.2b26
                     */
                    fitIn(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, keepRatio: boolean): void;
                    /**
                     * @returns Pointer to the native object instance of the
                     * following {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh}, represented as long number.
                     */
                    getPtr(): number;
                    getReadOnlyVertexData(): NativeRenderMesh.ReadOnlyVertexData;
                    /**
                     * Imports mesh file using specified path.
                     * @param path path to the mesh file. Path should be absolute path or
                     * be relative to the resources folder or to the "models/" folder
                     * @param type file type to read mesh from. The only currently supported mesh file
                     * type is "obj"
                     * @param importParams additional import parameters or null, if not needed
                     */
                    importFromFile(path: string, type: "obj", importParams: Nullable<NativeRenderMesh.ImportParams>): void;
                    invalidate(): void;
                    newGuiRenderMesh(): mod.ui.GuiRenderMesh;
                    /**
                     * Forces Minecraft to rebuild specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} object.
                     */
                    rebuild(): void;
                    /**
                     * Resets color applied to the mesh.
                     * @default 0xfff // white
                     */
                    resetColor(): void;
                    /**
                     * Resets texture of the mesh.
                     */
                    resetTexture(): void;
                    /**
                     * Rotates the mesh around the specified coordinates.
                     * @param rotX rotation angle along X axis, in radians
                     * @param rotY rotation angle along Y axis, in radians
                     * @param rotZ rotation angle along Z axis, in radians
                     * @since 2.0.2b26
                     */
                    rotate(x: number, y: number, z: number, rotX: number, rotY: number, rotZ: number): void;
                    /**
                     * Rotates the mesh around the (0, 0, 0) coordinates.
                     * @param rotX rotation angle along X axis, in radians
                     * @param rotY rotation angle along Y axis, in radians
                     * @param rotZ rotation angle along Z axis, in radians
                     */
                    rotate(rotX: number, rotY: number, rotZ: number): void;
                    /**
                     * Scales the whole mesh along the three axis.
                     */
                    scale(x: number, y: number, z: number): void;
                    /**
                     * Specifies block texture to be used by mesh.
                     */
                    setBlockTexture(textureName: string, textureMeta: number): void;
                    /**
                     * Specifies color to be applied to the next vertices. If the color is not white and
                     * the texture is applied to mesh, texture's colors will be affected.
                     */
                    setColor(r: number, g: number, b: number): void;
                    /**
                     * Specifies color to be applied to the next vertices. If the color is not white and
                     * the texture is applied to mesh, texture's colors will be affected.
                     */
                    setColor(r: number, g: number, b: number, a: number): void;
                    /**
                     * Makes specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} foliage tinted.
                     * @since 2.0.2b24
                     */
                    setFoliageTinted(): void;
                    /**
                     * Makes specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} foliage tinted.
                     * @since 2.0.2b25
                     */
                    setFoliageTinted(leavesType: number): void;
                    /**
                     * Makes specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} grass tinted.
                     * @since 2.0.2b24
                     */
                    setGrassTinted(): void;
                    /**
                     * Sets following {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} light direction.
                     */
                    setLightDir(x: number, y: number, z: number): void;
                    setLightIgnore(ignore: boolean, bool2: boolean): void;
                    setLightParams(float1: number, float2: number, float3: number): void;
                    /**
                     * Sets following {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} light position.
                     * @since 2.0.2b25
                     */
                    setLightPos(x: number, y: number, z: number): void;
                    /**
                     * Removes any tint from specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh}.
                     * @since 2.0.2b24
                     */
                    setNoTint(): void;
                    /**
                     * Specifies the normal vector for the next vertices.
                     */
                    setNormal(x: number, y: number, z: number): void;
                    /**
                     * Makes specified {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} water tinted.
                     * @since 2.0.2b24
                     */
                    setWaterTinted(): void;
                    /**
                     * Translates the whole mesh along three axis.
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
                     * Object used in {@link com.zhekasmirnov.innercore.api.NativeRenderMesh.importFromFile NativeRenderMesh.importFromFile} and
                     * one of {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} constructors. Here you can put
                     * some additional parameters, that will be applied to the mesh,
                     * when the file is being imported.
                     */
                    export interface ImportParams {
                        /**
                         * If `true`, all existing vertices of the mesh are deleted
                         * before the file is imported.
                         */
                        clear?: boolean,
                        /**
                         * If `true`, vertex of the texture is inverted.
                         */
                        invertV: boolean,
                        /**
                         * Additional translation along x, y and z axis.
                         */
                        translate?: [number, number, number],
                        /**
                         * Additional scale along x, y and z axis.
                         */
                        scale?: [number, number, number],
                        /**
                         * If `true`, Minecraft won't be forced to rebuild the following
                         * {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh}
                         * before the file is imported.
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
                         * Clears all parts of the model.
                         */
                        clearAllParts(): void;
                        /**
                         * @param partName part name
                         * @returns Part by it's name or null if part doesn't exist.
                         */
                        getPart(partName: string): Nullable<ModelPart>;
                        /**
                         * @param partName part name
                         * @returns `true` if part with specified name exists in the model,
                         * `false` otherwise.
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
                         * the part's coordinates) of the specified size (width, height, length).
                         */
                        addBox(x: number, y: number, z: number, w: number, h: number, l: number): void;
                        /**
                         * Adds a new box to the part on the specified coordinates (relative to
                         * the part's coordinates) of the specified size (width, height, length).
                         * @param add additional size to be added from all the six sizes of the
                         * box
                         */
                        addBox(x: number, y: number, z: number, w: number, h: number, l: number, add: number): void;
                        /**
                         * Creates a new part with specified name. If a part with specified name
                         * already exists, returns the existing part.
                         * @param name name of the part to create or return
                         */
                        addPart(name: string): ModelPart;
                        /**
                         * Clears the contents of the part.
                         */
                        clear(): void;
                        /**
                         * @returns Mesh specified via {@link com.zhekasmirnov.innercore.api.NativeRenderer.ModelPart.setMesh setMesh} call or `null`, if
                         * this part doesn't contain mesh.
                         */
                        getMesh(): Nullable<NativeRenderMesh>;
                        /**
                         * Specifies {@link com.zhekasmirnov.innercore.api.NativeRenderMesh NativeRenderMesh} to be used as a part.
                         */
                        setMesh(mesh: Nullable<NativeRenderMesh>): void;
                        /**
                         * Specifies part default offset.
                         */
                        setOffset(offsetX: number, offsetY: number, offsetZ: number): void;
                        /**
                         * Specifies part rotation.
                         */
                        setRotation(rotationX: number, rotationY: number, rotationZ: number): void;
                        /**
                         * Specifies texture UV offset.
                         */
                        setTextureOffset(u: number, v: number): void;
                        /**
                         * Specifies texture UV offset.
                         */
                        setTextureOffset(u: number, v: number): void;
                        /**
                         * Specifies texture UV offset.
                         * @param placeholder deprecated boolean parameter
                         * @deprecated Use same method without last parameter.
                         */
                        setTextureOffset(u: number, v: number, placeholder: boolean): void;
                        /**
                         * Specifies texture size size, use the real texture file size or change
                         * it to stretch texture.
                         */
                        setTextureSize(w: number, h: number): void;
                        /**
                         * Specifies texture size size, use the real texture file size or change
                         * it to stretch texture.
                         */
                        setTextureSize(w: number, h: number): void;
                        /**
                         * Specifies texture size size, use the real texture file size or change
                         * it to stretch texture.
                         * @param placeholder deprecated boolean parameter
                         * @deprecated Use same method without last parameter.
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
                         * Clears all the transformations applied to the render.
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        clear(): Transform;
                        /**
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        lock(): Transform;
                        /**
                         * Performs arbitrary matrix transformations on the render.
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        matrix(m00: number, m01: number, m02: number, m03: number,
                                m10: number, m11: number, m12: number, m13: number,
                                m20: number, m21: number, m22: number, m23: number,
                                m30: number, m31: number, m32: number, m33: number): Transform;
                        /**
                         * Rotates render along three axes.
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        rotate(rotX: number, rotY: number, rotZ: number): Transform;
                        /**
                         * Scales render along the three axes.
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        scale(scaleX: number, scaleY: number, scaleZ: number): Transform;
                        /**
                         * Translates render along three axes.
                         * @returns Reference to itself to be used in sequential calls.
                         */
                        translate(x: number, y: number, z: number): Transform;
                        /**
                         * @returns Reference to itself to be used in sequential calls.
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
                /**
                 * Class representing item extra data. Used to store additional information
                 * about item other then just item ID and data.
                 */
                export class NativeItemInstanceExtra extends java.lang.Object {
                    static class: java.lang.Class<NativeItemInstanceExtra>;
                    static constructClone(pointer: number): number;
                    static initSaverId(): void;
                    isFinalizableInstance(): boolean;
                    /**
                     * Creates an {@link com.zhekasmirnov.innercore.api.NativeItemInstanceExtra NativeItemInstanceExtra} Java object instance
                     * from given native item extra data object pointer,
                     * represented as 64-bit integer (long).
                     */
                    constructor(pointer: number);
                    /**
                     * Creates an empty {@link com.zhekasmirnov.innercore.api.NativeItemInstanceExtra NativeItemInstanceExtra} instance.
                     */
                    constructor();
                    /**
                     * Creates a new {@link com.zhekasmirnov.innercore.api.NativeItemInstanceExtra NativeItemInstanceExtra} instance
                     * and copies all data from another extra object given.
                     */
                    constructor(other: NativeItemInstanceExtra);
                    asJson(): org.json.JSONObject;
                    /**
                     * Creates a copy of current {@link com.zhekasmirnov.innercore.api.NativeItemInstanceExtra NativeItemInstanceExtra} object.
                     * @returns A created copy of the data.
                     */
                    copy(): NativeItemInstanceExtra;
                    getValue(): number;
                    /**
                     * @returns `true`, if item extra exists and is not empty.
                     */
                    isEmpty(): boolean;
                    applyTo(item: ItemInstance): void;
                    /**
                     * @returns `true` if the item is enchanted, `false` otherwise.
                     */
                    isEnchanted(): boolean;
                    /**
                     * Adds a new enchantment to the item.
                     * @param type enchantment ID, one of the {@link EEnchantment} constants
                     * @param level enchantment level, generally between 1 and 5
                     */
                    addEnchant(type: number, level: number): void;
                    /**
                     * @param type enchantment ID, one of the {@link EEnchantment} constants
                     * @returns Level of the specified enchantment.
                     */
                    getEnchantLevel(type: number): number;
                    /**
                     * Removes enchantments by it's ID.
                     * @param type enchantment ID, one of the {@link EEnchantment} constants
                     */
                    removeEnchant(type: number): void;
                    /**
                     * Removes all the enchantments of the item.
                     */
                    removeAllEnchants(): void;
                    /**
                     * @returns Amount of enchantments applied to the item.
                     */
                    getEnchantCount(): number;
                    /**
                     * @param id enchantment ID, one of the {@link EEnchantment} constants
                     * @param level enchantment level, generally between 1 and 5
                     * @returns Enchantment name by it's ID and level.
                     */
                    getEnchantName(id: number, level: number): string;
                    getRawEnchants(): number[][];
                    getEnchants(): {[id: number]: number};
                    /**
                     * @returns All enchantments names separated by line breaks.
                     */
                    getAllEnchantNames(): string;
                    getAllCustomData(): string;
                    setAllCustomData(data: string): void;
                    /**
                     * @returns Item's custom name.
                     */
                    getCustomName(): string;
                    /**
                     * Sets item's custom name.
                     */
                    setCustomName(name: string): void;
                    /**
                     * @returns Compound tag for the specified item.
                     * @since 2.0.5b44
                     */
                    getCompoundTag(): Nullable<NBT.CompoundTag>;
                    /**
                     * Sets compound tag for the specified item.
                     * @since 2.0.5b44
                     */
                    setCompoundTag(ent: number, tag: NBT.CompoundTag): void;
                    /**
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putObject(name: string, value: java.lang.Object): NativeItemInstanceExtra;
                    /**
                     * Puts some custom string parameter to the extra data of the item.
                     * @param name parameter name
                     * @param value parameter value
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putString(name: string, value: string): NativeItemInstanceExtra;
                    /**
                     * Puts some custom integer parameter to the extra data of the item.
                     * @param name parameter name
                     * @param int parameter value
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putInt(name: string, int: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom long integer parameter to the extra data of the item.
                     * @param name parameter name
                     * @param long parameter value
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putLong(name: string, long: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom floating point number parameter to the extra data of the item.
                     * @param name parameter name
                     * @param float parameter value
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putFloat(name: string, float: number): NativeItemInstanceExtra;
                    /**
                     * Puts some custom boolean parameter to the extra data of the item.
                     * @param name parameter name
                     * @param bool parameter value
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putBoolean(name: string, bool: boolean): NativeItemInstanceExtra;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't
                     * contain a parameter with specified name
                     * @returns Custom string parameter value if extra data of the item contains
                     * one, fallback value otherwise. If fallback was not specified, `null` is returned.
                     */
                    getString(name: string, fallback?: string): Nullable<string>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't
                     * contain a parameter with specified name
                     * @returns Custom integer parameter value if extra data of the item contains
                     * one, fallback value otherwise. If fallback was not specified, `null` is returned.
                     */
                    getInt(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't
                     * contain a parameter with specified name
                     * @returns Custom long integer parameter value if extra data of the item contains
                     * one, fallback value otherwise. If fallback was not specified, `null` is returned.
                     */
                    getLong(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't
                     * contain a parameter with specified name
                     * @returns Custom float parameter value if extra data of the item contains
                     * one, fallback value otherwise. If fallback was not specified, `null` is returned.
                     */
                    getFloat(name: string, fallback?: number): Nullable<number>;
                    /**
                     * @param name parameter name
                     * @param fallback default value to be returned if item extra data doesn't
                     * contain a parameter with specified name
                     * @returns Custom boolean parameter value if extra data of the item contains
                     * one, fallback value otherwise. If fallback was not specified, `null` is returned.
                     */
                    getBoolean(name: string, fallback?: boolean): Nullable<boolean>;
                    /**
                     * @returns Reference to itself to be used in sequential calls.
                     */
                    putSerializable(name: string, serializableObject: any): NativeItemInstanceExtra;
                    getSerializable(name: string): any;
                    /**
                     * Removes all custom parameters from item extra data.
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
                export module mod {
                    export module util {
                        export class ConfigVisualizer extends java.lang.Object {
                            static class: java.lang.Class<ConfigVisualizer>;
                            /**
                             * Constructs new {@link UI.ConfigVisualizer} instance with specified elements
                             * names prefix.
                             * @param config configuration file to be loaded
                             * @param prefix elements names prefix used for this visualizer
                             */
                            constructor(config: innercore.mod.build.Config, prefix: string);
                            /**
                             * Constructs new {@link UI.ConfigVisualizer} instance with default elements
                             * names prefix (*config_vis*).
                             * @param config configuration file to be loaded
                             */
                            constructor(config: innercore.mod.build.Config);
                            /**
                             * Removes all elements with current element name prefix. In other
                             * words, removes all elements that were created by this.
                             * {@link UI.ConfigVisualizer} instance
                             * @param elements target {@link com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent.elements WindowContent.elements} section
                             */
                            clearVisualContent(elements: UI.ElementSet): void;
                            /**
                             * Creates elements in the window to visualize configuration file.
                             * @param elements target {@link com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent.elements WindowContent.elements} section
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
                            export interface IWindowLocation {
                                /**
                                 * X coordinate of the window in units.
                                 * @default 0
                                 */
                                x?: number,
                                /**
                                 * Y coordinate of the window in units.
                                 * @default 0
                                 */
                                y?: number,
                                /**
                                 * Width of the window in units, by default calculated to match right
                                 * screen bound.
                                 */
                                width?: number,
                                /**
                                 * Height of the window in units, by default calculated to match bottom
                                 * screen bound.
                                 */
                                height?: number,
                                /**
                                 * Defines scrollable window size along the X axis.
                                 */
                                scrollX?: number,
                                /**
                                 * Defines scrollable window size along the Y axis.
                                 */
                                scrollY?: number;
                            }
                            /**
                             * Object representing window location used in window content object and
                             * {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation IWindowLocation} constructor.
                             */
                            export interface WindowLocationDescription extends IWindowLocation {
                                forceScrollX?: boolean, forceScrollY?: boolean,
                                /**
                                 * Paddings are distances from the window bounds to the elements in the
                                 * window.
                                 */
                                padding?: { top?: number, bottom?: number, left?: number, right?: number };
                            }
                            export class UIWindowLocation extends java.lang.Object {
                                static class: java.lang.Class<UIWindowLocation>;
                                /**
                                 * Constant used to represent bottom padding.
                                 */
                                static readonly PADDING_BOTTOM: number;
                                /**
                                 * Constant used to represent left padding.
                                 */
                                static readonly PADDING_LEFT: number;
                                /**
                                 * Constant used to represent right padding.
                                 */
                                static readonly PADDING_RIGHT: number;
                                /**
                                 * Constant used to represent top padding.
                                 */
                                static readonly PADDING_TOP: number;
                                forceScrollX: boolean;
                                forceScrollY: boolean;
                                /**
                                 * Window height.
                                 */
                                height: number;
                                /**
                                 * Window scale.
                                 */
                                scale: number;
                                /**
                                 * Horizontal window scroll.
                                 */
                                scrollX: number;
                                /**
                                 * Vertical window scroll.
                                 */
                                scrollY: number;
                                /**
                                 * Window width.
                                 */
                                width: number;
                                /**
                                 * Window horizontal position.
                                 */
                                x: number;
                                /**
                                 * Window vertical position.
                                 */
                                y: number;
                                /**
                                 * Window position on layers.
                                 */
                                zIndex: number;
                                /**
                                 * Constructs new {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation UIWindowLocation} instance with default position and
                                 * size (fullscreen window).
                                 */
                                constructor();
                                /**
                                 * Constructs new {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation UIWindowLocation} instance with specified parameters.
                                 * @param params
                                 */
                                constructor(params: WindowLocationDescription);
                                /**
                                 * Sets scrollable window size. Should be greater then window
                                 * width/height for the changes to take effect.
                                 * @param x scrollable window size along the X axis
                                 * @param y scrollable window size along the Y axis
                                 */
                                setScroll(x: number, y: number): void;
                                /**
                                 * Sets the size of the window.
                                 * @param x window's width
                                 * @param y window's height
                                 */
                                setSize(x: number, y: number): void;
                                /**
                                 * @returns Window location as a js object. Note that paddings are not
                                 * included into the object.
                                 */
                                asScriptable(): IWindowLocation;
                                /**
                                 * Creates a copy of current {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation UIWindowLocation} object.
                                 * @returns Newly created copy of the object.
                                 */
                                copy(): UIWindowLocation;
                                /**
                                 * Sets window location parameters.
                                 * @param x X coordinate of the window
                                 * @param y Y coordinate of the window
                                 * @param width width of the window
                                 * @param height height of the window
                                 */
                                set(x: number, y: number, width: number, height: number): void;
                                /**
                                 * Sets window location parameters from another {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation UIWindowLocation}.
                                 * Note that paddings are not copied instance.
                                 * @param location another {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation UIWindowLocation} instance to copy
                                 * parameters from
                                 */
                                set(location: UIWindowLocation): void;
                                /**
                                 * Sets window's scroll size to the windows size to remove scroll.
                                 */
                                removeScroll(): void;
                                /**
                                 * Sets padding of the window.
                                 * @param padding one of the {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation.PADDING_TOP UIWindowLocation.PADDING_TOP},
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation.PADDING_BOTTOM UIWindowLocation.PADDING_BOTTOM},
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation.PADDING_LEFT UIWindowLocation.PADDING_LEFT},
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation.PADDING_RIGHT UIWindowLocation.PADDING_RIGHT} constants
                                 * @param value value of the padding to be assigned to appropriate
                                 * window bound
                                 */
                                setPadding(padding: 0 | 1 | 2 | 3, value: number): void;
                                /**
                                 * Sets the four paddings of the window for the appropriate bounds.
                                 */
                                setPadding(top: number, bottom: number, left: number, right: number): void;
                                /**
                                 * @returns Unit size (in pixels) in the fullscreen context (`<screen width> / 1000`).
                                 */
                                getScale(): number;
                                /**
                                 * @returns Unit size (in pixels) in the window's bounds.
                                 */
                                getDrawingScale(): number;
                                /**
                                 * @returns Window's rectangle in the {@link android.graphics.Rect} object.
                                 */
                                getRect(): android.graphics.Rect;
                                showPopupWindow(win: android.widget.PopupWindow): void;
                                updatePopupWindow(win: android.widget.PopupWindow): void;
                                getLayoutParams(a1: number, a2: number, a3: number): android.view.WindowManager.LayoutParams;
                                setupAndShowPopupWindow(win: android.widget.PopupWindow): void;
                                /**
                                 * Sets window's Z index. Z index determines how the window will be
                                 * displayed when several windows are open.
                                 * @param z window Z index
                                 */
                                setZ(z: number): void;
                                /**
                                 * @returns Window's width in units
                                 * (always 1000 by definition of the unit).
                                 */
                                getWindowWidth(): 1000;
                                /**
                                 * @returns Window's height in units.
                                 */
                                getWindowHeight(): number;
                                /**
                                 * Transforms dimension in fullscreen units to the dimension within
                                 * window's bounds.
                                 * @param val value to be transformed
                                 */
                                globalToWindow(val: number): number;
                                /**
                                 * Transforms dimension within window's bounds to the dimension in
                                 * fullscreen units.
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
                            export class UIWindowGroup extends java.lang.Object implements IWindow {
                                static class: java.lang.Class<UIWindowGroup>;
                                closeOnBackPressed: boolean;
                                /**
                                 * Removes window from group by it's name.
                                 * @param name window name
                                 */
                                removeWindow(name: string): void;
                                /**
                                 * Adds window instance with specified name to the group.
                                 * @param name window name
                                 * @param window window to be added to the group
                                 */
                                addWindowInstance(name: string, window: IWindow): void;
                                /**
                                 * Creates a new window using provided description and adds it to the
                                 * group.
                                 * @param name window name
                                 * @param content window description object
                                 * @returns Created {@link UI.Window} object.
                                 */
                                addWindow(name: string, content: WindowContent): UIWindow;
                                /**
                                 * @param name window name
                                 * @returns Window from the group by it's name or null if no window with
                                 * such a name was added.
                                 */
                                getWindow(name: string): UIWindow;
                                /**
                                 * @param name window name
                                 * @returns Window's description object if a window with specified name
                                 * exists or null otherwise.
                                 */
                                getWindowContent(name: string): Nullable<WindowContent>;
                                /**
                                 * Sets content for the window by it's name.
                                 * @param name window name
                                 * @param content content object
                                 */
                                setWindowContent(name: string, content: WindowContent): void;
                                /**
                                 * @returns Collection object containing all the
                                 * {@link UI.Window}s in the group.
                                 */
                                getAllWindows(): java.util.Collection<UIWindow>;
                                /**
                                 * @returns Collection object containing string names of the
                                 * windows in the group.
                                 */
                                getWindowNames(): java.util.Collection<string>;
                                /**
                                 * Forces window refresh by it's name.
                                 * @param name name of the window to refresh
                                 */
                                refreshWindow(name: string): void;
                                /**
                                 * Forces refresh for all windows.
                                 */
                                refreshAll(): void;
                                /**
                                 * Moves window with specified name to the top of the group.
                                 * @param name window name
                                 */
                                moveOnTop(name: string): void;
                                /**
                                 * Opens window without container.
                                 */
                                open(): void;
                                /**
                                 * Closes window without container. Use only if the window was opened
                                 * without container.
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content.
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * @returns `true` if the window is opened, `false` otherwise.
                                 */
                                isOpened(): boolean;
                                /**
                                 * @returns `true` if the window has an inventory that should be updated.
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns `true` if the window can change it's contents position.
                                 */
                                isDynamic(): boolean;
                                /**
                                 * Gets all the elements in the window.
                                 * @returns Hashes containing string element name
                                 * as keys and element instances as values.
                                 */
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                /**
                                 * @returns `null` for {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowGroup UIWindowGroup}.
                                 * */
                                getContent(): Nullable<WindowContent>;
                                /**
                                 * @returns Currently {@link UI.Container}
                                 * that was used to open this window or null, if the window wasn't opened in container.
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * Sets container for the current window. Be careful when calling it
                                 * manually. You should prefer opening the window via
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.openAs Container.openAs} call.
                                 * @param container {@link UI.Container}
                                 * to be associated with current window or null to associate no container with current window
                                 */
                                setContainer(container: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off.
                                 * @param enabled if `true`, additional debug information will be drawn on
                                 * the window canvas
                                 */
                                setDebugEnabled(enabled: boolean): void;
                                invalidateAllContent(): void;
                                setStyle(style: types.UIStyle): void;
                                setStyle(style: types.BindingSet): void;
                                /**
                                 * @returns Object containing current style of the window.
                                 */
                                getStyle(): types.UIStyle;
                                setBlockingBackground(bb: boolean): void;
                                /**
                                 * Forces ui elements of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui drawables of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * Gives the property to be closed on pressing back navigation button to the given window group.
                                 */
                                setCloseOnBackPressed(val: boolean): void;
                                /**
                                 * @returns Whether the window group can be closed on pressing back navigation button.
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
                                /**
                                 * Just for TS not to be angry.
                                 */
                                setColorFilter(par1: number, par2: android.graphics.PorterDuff.Mode): void;
                                setColorFilter(filter: Nullable<android.graphics.ColorFilter>): void;
                                /**
                                 * @default -3
                                 */
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
                                /**
                                 * Just for TS not to be angry.
                                 */
                                setColorFilter(par1: number, par2: android.graphics.PorterDuff.Mode): void;
                                setColorFilter(filter: Nullable<android.graphics.ColorFilter>): void;
                                /**
                                 * @default -3
                                 */
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
                            /**
                             * Specifies contents and additional parameters for all types of windows.
                             */
                            export interface WindowContent {
                                /**
                                 * Specifies window's location, used for
                                 * {@link UI.Window}, {@link UI.TabbedWindow}
                                 * and {@link UI.StandartWindow}.
                                 */
                                location?: WindowLocationDescription,
                                /**
                                 * If {@link com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent.style WindowContent.style} is not specified,
                                 * this argument will be used instead.
                                 */
                                params?: types.BindingSet;
                                /**
                                 * Specifies window's style, an object containing keys as style binding
                                 * names and values as gui texture names corresponding to the binding.
                                 */
                                style?: types.BindingSet;
                                /**
                                 * Array of drawings
                                 */
                                drawing?: UI.DrawingSet;
                                /**
                                 * Object containing keys as gui elements names and {@link UI.Elements}
                                 * instances as values. Gui elements are interactive components that are
                                 * used to create interfaces functionality.
                                 */
                                elements?: UI.ElementSet;
                            }
                            export namespace StandardWindowDescriptionTypes {
                                export interface StandardWindowBackground {
                                    /**
                                     * If `true`, default window is created.
                                     */
                                    standard?: boolean,
                                    /**
                                     * Background color integer value, produced by
                                     * {@link android.graphics.Color} class.
                                     * @default 0xfff // white
                                     */
                                    color?: number,
                                    /**
                                     * Background bitmap texture name. If the bitmap size doesn't
                                     * match the screen size, bitmap will be stretched to fit.
                                     */
                                    bitmap?: string,
                                    /**
                                     * Specifies window's frame parameters.
                                     */
                                    frame?: {
                                        /**
                                         * Frame bitmap scale.
                                         * @default 3
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
                                     * Specifies header text.
                                     * @default "No Title"
                                     */
                                    text?: string,
                                    /**
                                     * Specifies font params for the header text. Only
                                     * {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.size size},
                                     * {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.color color}
                                     * and {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.shadow shadow}
                                     * properties are used.
                                     */
                                    font?: types.FontDescription,
                                    /**
                                     * If {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.font font} is not specified, used as
                                     * {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.size size} value.
                                     */
                                    size?: number,
                                    /**
                                     * If {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.font font} is not specified, used as
                                     * {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.color color} value.
                                     */
                                    color?: number,
                                    /**
                                     * If {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.font font} is not specified, used as
                                     * {@link com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowDescriptionTypes.StandardWindowHeaderText.shadow shadow} value.
                                     */
                                    shadow?: number,
                                }
                                export interface StandardWindowHeader {
                                    /**
                                     * Specifies whether the header should have shadow or not. If
                                     * `true`, the shadow is not displayed.
                                     * @default false
                                     */
                                    hideShadow?: boolean,
                                    /**
                                     * Specifies header height in units.
                                     * @default 80
                                     */
                                    height?: number,
                                    /**
                                     * If *height* is not specified, used to specify header height
                                     * in units.
                                     */
                                    width?: number,
                                    /**
                                     * Frame bitmap gui texture name. Defaults to *"headerFrame"*
                                     * style binding or, if not specified, to
                                     * *"default_frame_7"* gui texture.
                                     */
                                    frame?: string,
                                    /**
                                     * Header background color integer value, produced by
                                     * {@link android.graphics.Color} class. Default is
                                     * *Color.rgb(0x72, 0x6a, 0x70)*.
                                     */
                                    color?: number,
                                    /**
                                     * Specifies header text styles and value.
                                     */
                                    text?: StandardWindowHeaderText
                                    /**
                                     * If `true`, close button is not displayed.
                                     * @default false
                                     */
                                    hideButton?: boolean
                                }
                                export interface StandardWindowInventory {
                                    /**
                                     * Inventory width in units. Defaults to 300 units.
                                     */
                                    width?: number,
                                    /**
                                     * Specifies additional padding for the inventory in units.
                                     * Defaults to 20 units.
                                     */
                                    padding?: number,
                                    /**
                                     * If `true`, default window is created.
                                     */
                                    standard?: boolean
                                }
                                export interface StandardWindowParams {
                                    /**
                                     * Specifies minimum contents window height. If actual height is
                                     * less then desired, scrolling is used.
                                     */
                                    minHeight?: number,
                                    /**
                                     * Specifies background properties.
                                     */
                                    background?: StandardWindowBackground;
                                    /**
                                     * Specifies additional parameters for standard window's header.
                                     */
                                    header?: StandardWindowHeader
                                    /**
                                     * Specifies parameters for standard inventory window.
                                     */
                                    inventory?: StandardWindowInventory
                                }
                            }
                            /**
                             * Extended {@link com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent WindowContent} object with additional params for
                             * {@link UI.StandartWindow} and {@link UI.StandardWindow}.
                             */
                            export interface StandardWindowContent extends WindowContent {
                                /**
                                 * Used for {@link UI.StandartWindow}s and {@link UI.StandardWindow StandardWindows}.
                                 * Specifies additional parameters for standard windows.
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
                                 * Opens window without container.
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
                                 * Removes adjacent window from the adjacent windows list.
                                 * @param window another window that was added as adjacent
                                 */
                                removeAdjacentWindow(window: UIWindow): void;
                                preOpen(): void;
                                postOpen(): void;
                                /**
                                 * Closes window without container. Use only if the window was opened
                                 * without container.
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content.
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * Forces ui elements of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui drawables of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * @returns `true` if the window is opened, `false` otherwise.
                                 */
                                isOpened(): boolean;
                                postElementRefresh(): void;
                                postBackgroundRefresh(): void;
                                forceRefresh(): void;
                                /**
                                 * Specifies whether touch events should be handled by this window or
                                 * passed to underlying windows (to the game). By default all windows
                                 * are touchable.
                                 * @param touchable pass `true` if the window should handle touch events,
                                 * `false` otherwise
                                 */
                                setTouchable(touchable: boolean): void;
                                /**
                                 * @returns `true` if the window is touchable, `false` otherwise.
                                 */
                                isTouchable(): boolean;
                                /**
                                 * @returns `true` if window blocks background.
                                 */
                                isBlockingBackground(): boolean;
                                /**
                                 * Specifies whether the window should darken and block background.
                                 * @param blockingBackground pass `true` if you want the window to block
                                 * background
                                 * @default false
                                 */
                                setBlockingBackground(blockingBackground: boolean): void;
                                /**
                                 * @returns `true` if the window is game overlay, `false` otherwise.
                                 */
                                isNotFocusable(): boolean;
                                /**
                                 * Allows window to be displayed as game overlay without blocking
                                 * Minecraft sounds. Note that this drops window's FPS.
                                 * @param inGameOverlay if `true`, the window is opened in PopupWindow
                                 * to avoid blocking Minecraft sounds
                                 * @default false
                                 */
                                setAsGameOverlay(inGameOverlay: boolean): void;
                                /**
                                 * Set background color of window.
                                 * @param color integer color value (you can specify it using hex value)
                                 */
                                setBackgroundColor(color: number): void;
                                /**
                                 * @returns `true` if the window has an inventory that should be updated.
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns `true` if the window can change it's contents position.
                                 */
                                isDynamic(): boolean;
                                /**
                                 * Gets all the elements in the window.
                                 * @returns Hashes containing string element names
                                 * as keys and element instances as values.
                                 */
                                getElements(): java.util.HashMap<String, elements.UIElement>;
                                /**
                                 * @returns Window's content object (usually specified in the window's
                                 * constructor).
                                 */
                                getContent(): WindowContent;
                                /**
                                 * Specifies the content of the window.
                                 * @param content content object to be applied to the window
                                 */
                                setContent(content: WindowContent): void;
                                /**
                                 * @param dynamic specify `true`, if the window contains dynamic
                                 * (animated) elements, `false` otherwise. By default all windows are
                                 * dynamic. Make them static for better performance
                                 */
                                setDynamic(dynamic: boolean): void;
                                /**
                                 * @param inventoryNeeded specify `true` if the window requires player's
                                 * inventory
                                 * @default false
                                 */
                                setInventoryNeeded(inventoryNeeded: boolean): void;
                                invalidateBackground(): void;
                                invalidateForeground(): void;
                                /**
                                 * @returns Window's current location object.
                                 */
                                getLocation(): UIWindowLocation;
                                getElementProvider(): IElementProvider;
                                getBackgroundProvider(): IBackgroundProvider;
                                getContentProvider(): ContentProvider;
                                /**
                                 * @returns Unit size (in pixel) in the window's bounds.
                                 */
                                getScale(): number;
                                /**
                                 * @returns Object containing current style of the window.
                                 */
                                getStyle(): types.UIStyle;
                                /**
                                 * Overrides style properties of the current style by the values
                                 * specified in the style parameter.
                                 * @param style js object where keys represent binding names and values
                                 * represent texture gui names
                                 */
                                setStyle(style: types.BindingSet): void;
                                /**
                                 * Sets new style object as current window's style. If the new style is
                                 * a different object then an old one, forces window invalidation.
                                 * @param style {@link UI.Style} object to be used as style for the window
                                 */
                                setStyle(style: types.UIStyle): void;
                                invalidateAllContent(): void;
                                /**
                                 * Gets custom property by it's name. Custom properties can be used to
                                 * store some values containing window's current state. Note that these
                                 * properties are not saved between Inner Core launches.
                                 * @param name custom property name
                                 * @returns Value set by {@link com.zhekasmirnov.innercore.api.mod.ui.window.UIWindow.putProperty Window.putProperty}
                                 * or null if no value was specified for this name.
                                 */
                                getProperty<T>(name: string): T;
                                /**
                                 * Sets custom property value.
                                 * @param name custom property name
                                 * @param value custom property value
                                 */
                                putProperty<T>(name: string, value: T): void;
                                /**
                                 * @returns Currently {@link UI.Container}
                                 * that was used to open this window or null, if
                                 * the window wasn't opened in container.
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * Sets container for the current window. Be careful when calling it
                                 * manually. You should prefer opening the window via it.
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.openAs Container.openAs} call
                                 * @param container {@link UI.Container}
                                 * to be associated with current window
                                 * or null to associate no container with current window
                                 */
                                setContainer(container: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off.
                                 * @param enabled if `true`, additional debug information will be drawn on
                                 * the window canvas
                                 */
                                setDebugEnabled(enabled: boolean): void;
                                /**
                                 * Sets any window as current window's parent. If current window closes,
                                 * parent window closes too.
                                 * @param parent window to be used as parent window for the current
                                 * window.
                                 */
                                setParentWindow(parent: IWindow): void;
                                /**
                                 * @returns Current window's parent window.
                                 */
                                getParentWindow(): Nullable<IWindow>;
                                /**
                                 * Sets listener to be notified about window opening/closing events.
                                 */
                                setEventListener(listener: UI.WindowEventListener | IWindowEventListener): void;
                                /**
                                 * Gets listener to be notified about window opening/closing events.
                                 * @since 2.3.1b116
                                 */
                                getEventListener(): UI.WindowEventListener | IWindowEventListener;
                                runCachePreparation(async: boolean): void;
                                /**
                                 * Writes debug information about current window to the log.
                                 */
                                debug(): void;
                                /**
                                 * Gives the property to be closed on pressing back navigation button to the given window.
                                 */
                                setCloseOnBackPressed(val: boolean): void;
                                /**
                                 * @returns Whether the window can be closed on pressing back navigation button.
                                 */
                                onBackPressed(): boolean;
                                /**
                                 * @since 2.2.1b96
                                 */
                                updateScrollDimensions(): void;
                                /**
                                 * @since 2.2.1b96
                                 */
                                updateWindowPositionAndSize(): void;
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
                                 * Sets window location (bounds) to draw window within.
                                 * @param location location to be used for the tabbed window
                                 */
                                setLocation(location: UIWindowLocation): void;
                                /**
                                 * @returns Tab content window width in units.
                                 */
                                getInnerWindowWidth(): number;
                                /**
                                 * @returns Tab content window height in units.
                                 */
                                getInnerWindowHeight(): number;
                                /**
                                 * @returns Tab selector window width in units.
                                 */
                                getWindowTabSize(): number;
                                /**
                                 * @returns Tab selector window width in global units.
                                 */
                                getGlobalTabSize(): number;
                                /**
                                 * Constructs new {@link UI.TabbedWindow} with specified location.
                                 * @param loc location to be used for the tabbed window
                                 */
                                constructor(loc: UIWindowLocation);
                                /**
                                 * Constructs new {@link UI.TabbedWindow} with specified content.
                                 * @param content object containing window description
                                 */
                                constructor(content: TabbedWindowContent);
                                /**
                                 * Sets content of the tab.
                                 * @param index index of the tab; there are 12 tabs available, from 0 to
                                 * 11
                                 * @param tabOverlay content of the tab selector
                                 * @param tabContent content of the window to be created for the tab
                                 * @param isAlwaysSelected if `true`, tab is always displayed as selected;
                                 * default value is `false`
                                 * @remarks
                                 * The location of the tabs is as follows:
                                 * ```text
                                 * 0    6
                                 * 1    7
                                 * 2    8
                                 * 3    9
                                 * 4    10
                                 * 5    11
                                 * ```
                                 */
                                setTab(index: number, tabOverlay: UI.ElementSet, tabContent: WindowContent, isAlwaysSelected: boolean): void;
                                /**
                                 * Sets content of the tab.
                                 * @param index index of the tab; there are 12 tabs available, from 0 to
                                 * 11
                                 * @param tabOverlay content of the tab selector
                                 * @param tabContent content of the window to be created for the tab
                                 * @remarks
                                 * The location of the tabs is as follows:
                                 * ```text
                                 * 0    6
                                 * 1    7
                                 * 2    8
                                 * 3    9
                                 * 4    10
                                 * 5    11
                                 * ```
                                 */
                                setTab(index: number, tabOverlay: UI.ElementSet, tabContent: WindowContent): void;
                                /**
                                 * Creates fake tab with no content.
                                 * @param index index of the tab, see {@link com.zhekasmirnov.innercore.api.mod.ui.window.UITabbedWindow.setTab UI.TabbedWindow.setTab} for
                                 * details
                                 * @param tabOverlay content of the tab selector
                                 */
                                setFakeTab(index: number, tabOverlay: UI.ElementSet): void;
                                /**
                                 * @param index index of the tab
                                 * @returns New {@link UI.Window} instance
                                 * created for the specified tab or null if
                                 * no window was created for specified window.
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
                                setContainer(container: container.UiAbstractContainer): void;
                                setDebugEnabled(debug: boolean): void;
                                setEventListener(listener: IWindowEventListener): void;
                                setTabEventListener(index: number, listener: IWindowEventListener): void;
                                onTabSelected(index: number): void;
                                /**
                                 * Specifies whether the window should darken and block background.
                                 * @param enabled pass `true` if you want the window to block
                                 * background
                                 * @default false
                                 */
                                setBlockingBackground(enabled: boolean): void;
                                /**
                                 * @returns Current default tab index. If no default tab was specified
                                 * via {@link com.zhekasmirnov.innercore.api.mod.ui.window.UITabbedWindow.setDefaultTab UI.TabbedWindow.setDefaultTab},
                                 * the first tab added becomes default.
                                 */
                                getDefaultTab(): number;
                                /**
                                 * Sets default tab index.
                                 * @param tab index of the tab to be opened by default
                                 */
                                setDefaultTab(tab: number): void;
                                /**
                                 * Sets new style object as current window's style. If the new style is
                                 * a different object then an old one, forces window invalidation.
                                 * @param style {@link UI.Style} object to be used as style for the window
                                 */
                                setStyle(style: types.UIStyle): void;
                                /**
                                 * Overrides style properties of the current style by the values
                                 * specified in the style parameter.
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
                            export class UIAdaptiveWindow extends UIWindowGroup {
                                static class: java.lang.Class<UIAdaptiveWindow>;
                                constructor(content: WindowContent);
                                setContent(content: WindowContent): void;
                                /**
                                 * Sets style profile for the current {@link UI.AdaptiveWindow}.
                                 * @param profile 0 for classic profile, 1 for default profile
                                 */
                                setProfile(profile: 0 | 1): void;
                                /**
                                 * Forces {@link UI.AdaptiveWindow} to be displayed using some profile.
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
                            export class IWindow extends java.lang.Object {
                                static class: java.lang.Class<IWindow>;
                                constructor();
                                /**
                                 * Constructs new object inherited from {@link UI.IWindow}.
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
                                 * without container.
                                 */
                                close(): void;
                                /**
                                 * Called up to 66 times a second to update window's content.
                                 * @param time current time in milliseconds
                                 */
                                frame(time: number): void;
                                /**
                                 * @returns New {@link UI.Container}
                                 * that was used to open this window or null, if
                                 * the window wasn't opened in container.
                                 */
                                getContainer(): Nullable<container.UiAbstractContainer>;
                                /**
                                 * @returns Window's content object
                                 * (usually specified in the window's constructor).
                                 */
                                getContent(): WindowContent;
                                /**
                                 * Gets all the elements in the window.
                                 * @returns HashMap containing string element name as keys and
                                 * element instances as values.
                                 */
                                getElements(): java.util.HashMap<string, elements.UIElement>;
                                /**
                                 * @returns Object containing current style of the window.
                                 */
                                getStyle(): types.UIStyle;
                                /**
                                 * Forces ui drawables of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateDrawing(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui elements of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateElements(onCurrentThread: boolean): void;
                                /**
                                 * @returns `true` if the window can change it's contents position.
                                 */
                                isDynamic(): boolean;
                                /**
                                 * @returns `true` if the window has an inventory that should be updated.
                                 */
                                isInventoryNeeded(): boolean;
                                /**
                                 * @returns `true` if the window is opened, `false` otherwise.
                                 */
                                isOpened(): boolean;
                                /**
                                 * @returns Whether the window can be closed on pressing back navigation button.
                                 */
                                onBackPressed(): boolean;
                                /**
                                 * Opens window without container.
                                 */
                                open(): void;
                                /**
                                 * Sets container for the current window. Be careful when calling it
                                 * manually. You should prefer opening the window via
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.openAs Container.openAs} call.
                                 * @param container {@link UI.Container}
                                 * to be associated with current window or null to associate no container with current window
                                 */
                                setContainer(container: Nullable<container.UiAbstractContainer>): void;
                                /**
                                 * Turns debug mode for the window on and off.
                                 * @param debug if `true`, additional debug information will be drawn on
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
                        export module types {
                            /**
                             * Object containing binding names as keys and string values as gui textures
                             * names.
                             */
                            export type BindingSet = {[key: string]: string};
                            /**
                             * Object representing window style. Window styles allows to customize the
                             * way your windows look like.
                             */
                            export class UIStyle extends java.lang.Object {
                                static class: java.lang.Class<UIStyle>;
                                /**
                                 * Classic (0.16.*-like) windows style, which also used before
                                 * legacy version.
                                 */
                                static readonly CLASSIC: UIStyle;
                                /**
                                 * Default windows style.
                                 */
                                static readonly DEFAULT: UIStyle;
                                static readonly LEGACY: UIStyle;
                                /**
                                 * Adds gui texture name to use for the specified window part.
                                 * @param key binding name
                                 * @param name gui texture name
                                 */
                                addBinding(key: string, name: string): void;
                                /**
                                 * Gets texture binding bt it's name. Searches first in the additional
                                 * styles, then in the current style, then in all it's parents.
                                 * @param key binding name
                                 * @param fallback value to return on binding failure
                                 * @returns Ui texture name if current object, additional styles or one
                                 * of the parents contains such a binding name, fallback otherwise.
                                 */
                                getBinding(key: string, fallback: string): string;
                                /**
                                 * Adds an additional style object to the current style.
                                 * @param style additional style object to be added
                                 */
                                addStyle(style: UIStyle): void;
                                /**
                                 * Constructs new {@link com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle UIStyle} object
                                 * with bindings from {@link com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle.DEFAULT UIStyle.DEFAULT}.
                                 */
                                constructor();
                                /**
                                 * Constructs new {@link com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle UIStyle} object
                                 * from given {@link com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet BindingSet} object.
                                 */
                                constructor(bindings: BindingSet);
                                /**
                                 * @returns A copy of the current style. Only style bindings of the
                                 * current style are copied, no parent/additional styles are copied.
                                 */
                                copy(): UIStyle;
                                /**
                                 * Specifies parent style object for the current style.
                                 * @param style style to be set as parent
                                 */
                                inherit(style: UIStyle): void;
                                /**
                                 * Adds all values from given {@link com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet BindingSet} object.
                                 */
                                addAllBindings(bindings: BindingSet): void;
                                /**
                                 * @returns Collection containing all binding names
                                 * from the current style object.
                                 */
                                getAllBindingNames(): java.util.Collection<string>;
                                /**
                                 * If name is a style value (starts with `"style:"`), returns
                                 * corresponding gui texture name, else returns input string.
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
                            export class Texture extends java.lang.Object {
                                static class: java.lang.Class<Texture>;
                                animation: memory.BitmapWrap[];
                                bitmap: memory.BitmapWrap;
                                delay: number;
                                isAnimation: boolean;
                                /**
                                 * Constructs new static {@link Texture} with specified bitmap.
                                 * @param bitmap {@link android.graphics.Bitmap} instance
                                 */
                                constructor(bitmap: android.graphics.Bitmap);
                                /**
                                 * Constructs new animated {@link Texture} with specified frames.
                                 * @param bitmaps an array of {@link android.graphics.Bitmap} instances to be
                                 * used as animation frames
                                 */
                                constructor(bitmaps: android.graphics.Bitmap[]);
                                /**
                                 * Constructs new static or animated {@link Texture} with specified frames.
                                 * @param obj texture name or array of texture names for animated
                                 * textures. Accepts raw gui textures names and style bindings
                                 * (formatted as "style:binding_name").
                                 * @param style {@link com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle UIStyle} object to look for style bindings. If not
                                 * specified, default style is used
                                 */
                                constructor(obj: string | {[key: string]: string}, style?: UIStyle);
                                isAnimated(): boolean;
                                /**
                                 * Sets texture offsets in pixels from the upper left bound of the bitmap.
                                 */
                                readOffset(obj: { x?: number, y?: number }): void;
                                /**
                                 * @returns Frame number of the animation corresponding to current system time.
                                 */
                                getFrame(): number;
                                /**
                                 * @param frame frame number
                                 * @returns Bitmap object containing animation frame
                                 * for the corresponding frame number.
                                 */
                                getBitmap(frame: number): android.graphics.Bitmap;
                                getBitmapWrap(frame: number): memory.BitmapWrap;
                                draw(canvas: android.graphics.Canvas, x: number, y: number, scale: number): void;
                                drawCutout(canvas: android.graphics.Canvas, cutout: android.graphics.RectF, x: number, y: number, scale: number): void;
                                /**
                                 * @returns Width of the texture in pixels.
                                 */
                                getWidth(): number;
                                /**
                                 * @returns Height of the texture in pixels.
                                 */
                                getHeight(): number;
                                /**
                                 * Resizes all the frames of the texture to the specified size.
                                 */
                                resizeAll(width: number, height: number): void;
                                /**
                                 * Resizes all the frames by constant scale multiplier.
                                 * @param scale scale to modify the frames by
                                 */
                                rescaleAll(scale: number): void;
                                /**
                                 * Resizes all the frames to match the first one.
                                 */
                                fitAllToOneSize(): void;
                                /**
                                 * Releases all allocated resources, should be called when the texture
                                 * is not longer needed.
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
                            /**
                             * Object used to manipulate frame textures.
                             */
                            export class FrameTexture extends java.lang.Object {
                                static class: java.lang.Class<FrameTexture>;
                                /**
                                 * Specifies bottom left corner of the frame.
                                 */
                                static readonly CORNER_BOTTOM_LEFT: number;
                                /**
                                 * Specifies bottom right corner of the frame.
                                 */
                                static readonly CORNER_BOTTOM_RIGHT: number;
                                /**
                                 * Specifies top left corner of the frame.
                                 */
                                static readonly CORNER_TOP_LEFT: number;
                                /**
                                 * Specifies top right corner of the frame.
                                 */
                                static readonly CORNER_TOP_RIGHT: number;
                                /**
                                 * Specifies bottom side of the frame.
                                 */
                                static readonly SIDE_BOTTOM: number;
                                /**
                                 * Specifies left side of the frame.
                                 */
                                static readonly SIDE_LEFT: number;
                                /**
                                 * Specifies right side of the frame.
                                 */
                                static readonly SIDE_RIGHT: number;
                                /**
                                 * Specifies top side of the frame.
                                 */
                                static readonly SIDE_TOP: number;
                                constructor(source: android.graphics.Bitmap);
                                /**
                                 * Expands side of the texture by specified amount of pixels.
                                 * @param sideId side of the texture, one of the
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**,
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN** constants
                                 * @returns Expanded {@link android.graphics.Bitmap} instance with the frame.
                                 */
                                expandSide(sideId: number, pixels: number): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with
                                 * specified color.
                                 * @param color integer color value produced by {@link android.graphics.Color}
                                 * class
                                 * @param sides array of booleans marking whether the side should be
                                 * expanded or not. The order of the sides is
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**,
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN**
                                 * @returns Expanded {@link android.graphics.Bitmap} instance with the frame.
                                 */
                                expand(width: number, height: number, color: number, sides: [boolean, boolean, boolean, boolean]): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with
                                 * specified color.
                                 * @param color integer color value produced by {@link android.graphics.Color}
                                 * class
                                 */
                                expand(width: number, height: number, color: number): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with
                                 * specified color.
                                 * @param scale scale of the created bitmap
                                 * @param color integer color value produced by {@link android.graphics.Color}
                                 * class
                                 * @param sides array of booleans marking whether the side should be
                                 * expanded or not. See {@link com.zhekasmirnov.innercore.api.mod.ui.types.FrameTexture.expand FrameTexture.expand} parameters for details.
                                 * Default behavior is to scale all sides
                                 * @returns Expanded and scaled {@link android.graphics.Bitmap} instance.
                                 */
                                expandAndScale(width: number, height: number, scale: number, color: number, sides: [boolean, boolean, boolean, boolean]): android.graphics.Bitmap;
                                /**
                                 * Expands texture to the specified side, filling the middle with
                                 * specified color.
                                 * @param scale scale of the created bitmap
                                 * @param color integer color value produced by {@link android.graphics.Color}
                                 * class
                                 */
                                expandAndScale(width: number, height: number, scale: number, color: number): android.graphics.Bitmap;
                                /**
                                 * @returns Original frame texture source stored in
                                 * {@link android.graphics.Bitmap} instance.
                                 */
                                getSource(): android.graphics.Bitmap;
                                /**
                                 * @param side side of the texture, one of the
                                 * **FrameTexture.SIDE_LEFT**, **FrameTexture.SIDE_RIGHT**,
                                 * **FrameTexture.SIDE_UP**, **FrameTexture.SIDE_DOWN** constants
                                 * @returns Texture side source extracted from the original frame
                                 * texture source stored in {@link android.graphics.Bitmap} instance.
                                 */
                                getSideSource(side: number): android.graphics.Bitmap;
                                /**
                                 * @returns Object packed integer color value
                                 * of the central pixel of the source texture.
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
                            /**
                             * Object containing font parameters. If no color, size and shadow are
                             * specified, default values are ignored and white font with text size 20,
                             * white color and 0.45 shadow is created.
                             */
                            export interface FontDescription {
                                /**
                                 * Font color, android integer color value (produced by
                                 * {@link android.graphics.Color}).
                                 * @default 0x000 // black
                                 */
                                color?: number,
                                /**
                                 * Font size.
                                 * @default 20
                                 */
                                size?: number,
                                /**
                                 * Font shadow offset.
                                 * @default 0 // no shadow
                                 */
                                shadow?: number,
                                /**
                                 * Font alignment, one of the
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.types.Font.ALIGN_DEFAULT Font.ALIGN_DEFAULT},
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.types.Font.ALIGN_CENTER Font.ALIGN_CENTER},
                                 * {@link com.zhekasmirnov.innercore.api.mod.ui.types.Font.ALIGN_END Font.ALIGN_END} constants.
                                 */
                                alignment?: number,
                                /**
                                 * Same as {@link com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription.alignment FontDescription.alignment}.
                                 */
                                align?: number,
                                /**
                                 * If `true`, the font is bold, `false` otherwise.
                                 * @default false
                                 */
                                bold?: boolean,
                                /**
                                 * If `true`, the font is italic, `false` otherwise.
                                 * @default false
                                 */
                                cursive?: boolean,
                                /**
                                 * If `true`, the font is underlined, `false` otherwise.
                                 * @default false
                                 */
                                underline?: boolean
                            }
                            export class Font extends java.lang.Object {
                                static class: java.lang.Class<Font>;
                                /**
                                 * Aligns text to the start of the element (left for English locale).
                                 */
                                static readonly ALIGN_CENTER: number;
                                /**
                                 * Aligns text to the center of the element.
                                 */
                                static readonly ALIGN_DEFAULT: number;
                                /**
                                 * Aligns text to the end of the element (right for English locale).
                                 */
                                static readonly ALIGN_END: number;
                                /**
                                 * Aligns text to the center of the element horizontally.
                                 * @since 2.2.1b96
                                 */
                                static readonly ALIGN_CENTER_HORIZONTAL: number;
                                alignment: number;
                                color: number;
                                isBold: boolean;
                                isCursive: boolean;
                                isUnderlined: boolean;
                                shadow: number;
                                size: number;
                                /**
                                 * Constructs new instance of the font with specified parameters.
                                 * @param color font color, android integer color value (produced by
                                 * android.graphics.Color)
                                 * @param size font size
                                 * @param shadow shadow offset
                                 */
                                constructor(color: number, size: number, shadow: number);
                                /**
                                 * Constructs new instance of the font with specified parameters.
                                 * @param params parameters of the font
                                 */
                                constructor(params: FontDescription);
                                /**
                                 * Draws text on the canvas using created font.
                                 * @param canvas {@link android.graphics.Canvas} instance to draw the text on
                                 * @param x x coordinate of the text in pixels
                                 * @param y x coordinate of the text in pixels
                                 * @param text text string to draw
                                 * @param scale additional scale to apply to the text
                                 */
                                drawText(canvas: android.graphics.Canvas, x: number, y: number, text: string, scale: number): void;
                                /**
                                 * Calculates bounds of the text given text position, text string and
                                 * additional scale.
                                 * @returns rect object containing calculated bounds of
                                 * the text
                                 */
                                getBounds(text: string, x: number, y: number, scale: number): android.graphics.Rect;
                                /**
                                 * Calculates text width given text string and additional scale.
                                 * @returns width of the specified string when painted with specified
                                 * scale
                                 */
                                getTextWidth(text: string, scale: number): number;
                                /**
                                 * Calculates text height given text string and additional scale.
                                 * @returns height of the specified string when painted with specified
                                 * scale
                                 */
                                getTextHeight(text: string, x: number, y: number, scale: number): number;
                                /**
                                 * Converts current {@link com.zhekasmirnov.innercore.api.mod.ui.types.Font Font} object to scriptable font description.
                                 */
                                asScriptable(): FontDescription;
                                /* <DMHYT>: "Not sure about these two methods, that I saw in previous docs.
                                I can't see them in sources 0_0" */
                                /**
                                 * Sets listener to be notified about window opening/closing events.
                                 */
                                setEventListener(listener: window.IWindowEventListener | UI.WindowEventListener): void;
                                /**
                                 * Sets listener to be notified about tab with specified index opening/closing events.
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
                            export interface SlotElementDescription extends BasicElementDescription {
                                type: "slot",
                                bitmap?: string,
                                size?: number,
                                maxStackSize?: number,
                                visual?: boolean,
                                darken?: boolean,
                                isDarkenAtZero?: boolean,
                                /**
                                 * @since 2.0.4b42
                                 */
                                text?: string,
                                source?: ItemInstance,
                                /**
                                 * @deprecated In 2.0.4b43, not needed anymore.
                                 */
                                isTransparentBackground?: boolean,
                                /**
                                 * @deprecated In 2.0.4b43, not needed anymore.
                                 */
                                needClean?: boolean,
                                /**
                                 * @since 2.2.1b96
                                 */
                                iconScale?: number,
                                /**
                                 * @since 2.2.1b96
                                 */
                                disablePixelPerfect?: boolean,
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
                            /**
                             * Object where you can specify how the UI element will behave on touch events.
                             */
                            export interface UIClickEvent {
                                /**
                                 * This function will be called when element is short touched.
                                 */
                                onClick?: (position: Vector, container: container.UiAbstractContainer | apparatus.api.container.ItemContainer, tileEntity: Nullable<TileEntity> | any, window: window.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
                                /**
                                 * This function will be called when element is long touched.
                                 */
                                onLongClick?: (position: Vector, container: container.UiAbstractContainer | apparatus.api.container.ItemContainer, tileEntity: Nullable<TileEntity> | any, window: window.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
                            }
                            /**
                             * Types that can be used to create element texture.
                             * For static textures it can be string path to texture in assets directory, or {@link android.graphics.Bitmap} instance.
                             * For animated textures it can be array of string paths to texture in assets directory, or an array of {@link android.graphics.Bitmap} instances.
                             * Each element in the array represents one of animation frames.
                             */
                            export type BitmapTypes = string | string[] | android.graphics.Bitmap | android.graphics.Bitmap[];
                            /**
                             * There are 12 types of UI elements given by Inner Core, and you can also create your custom ones.
                             * Each element type has it's own specific description object.
                             * These description objects are all inherited from this BasicElementDescription.
                             * It means that each element must have coords on the GUI by X, Y, and additionally Z axis,
                             * and also you can specify how the element will behave when touched, in clicker object (optional).
                             */
                            export interface BasicElementDescription {
                                x?: number, y?: number, z?: number,
                                clicker?: UIClickEvent,
                                [key: string]: any
                            }
                            /**
                             * This is the base Java abstract class, which are all Inner Core element types inherited from.
                             * In Java, to create custom element types, you can inherit your element class from this one as well.
                             * Whereas in JavaScript, you should use "custom" element type in description object,
                             * where you can specify custom behavior for different events.
                             * For more information about custom element types in JavaScript,
                             * see {@link UI.UICustomElement}.
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
                                 * Creates a new {@link UI.Texture} instance
                                 * with specified style applied.
                                 * See {@link UI.Texture.constructor} for parameters description.
                                 */
                                createTexture(obj: BitmapTypes): types.Texture;
                                /**
                                 * Sets element's position in the window's unit coordinates.
                                 * @param x x position
                                 * @param y y position
                                 */
                                setPosition(x: number, y: number): void;
                                /**
                                 * Sets element's size in the window's unit coordinates.
                                 * @param width element's width
                                 * @param height element's height
                                 */
                                setSize(width: number, height: number): void;
                                constructor(window: window.UIWindow, scriptable: object);
                                getCleanerCopy(): UIElementCleaner;
                                /**
                                 * Passes any value to the element.
                                 * @param bindingName binding name, you can access the value from the
                                 * element by this name
                                 * @param value value to be passed to the element
                                 */
                                setBinding<T=any>(bindingName: string, value: T): void;
                                /**
                                 * Gets any value from the element.
                                 * @param name binding name, you can access the value from the
                                 * element by this name; some binding names are reserved for additional
                                 * element information, e.g. `"element_obj"` contains pointer to the
                                 * current object and `"element_rect"` contains {@link android.graphics.Rect}
                                 * object containing drawing rectangle
                                 * @returns Value that was get from the element or `null` if the element
                                 * doesn't exist.
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
                                /**
                                 * @deprecated Client only, use {@link BlockSource.spawnDroppedItem} instead.
                                 */
                                drop(x: number, y: number, z: number): void;
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
                             * @param container {@link UI.Container} the window was opened in
                             * @param window an instance of {@link UI.IWindow} that was opened
                             */
                            export interface OnOpenCloseListenerJS { (container: Container, window: window.IWindow): void; }
                            export class Container extends java.lang.Object implements UiAbstractContainer, recipes.workbench.WorkbenchField {
                                static class: java.lang.Class<Container>;
                                static readonly isContainer: boolean;
                                /**
                                 * If container is a part of {@link TileEntity}, this field stores reference
                                 * to it, otherwise null. You can also assign any value of any type to
                                 * it using {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.setParent UI.Container.setParent} method or using constructor
                                 * parameter. Consider using {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.getParent UI.Container.getParent} instead of direct
                                 * field access.
                                 */
                                parent: Nullable<TileEntity> | any;
                                slots: {[slotName: string]: container.Slot}
                                /**
                                 * Same as {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.parent UI.Container.parent}.
                                 */
                                tileEntity: Nullable<TileEntity> | any;
                                constructor();
                                constructor(parent: any);
                                /**
                                 * Sets container's parent object, for {@link TileEntity}'s container it
                                 * should be a {@link TileEntity} reference, otherwise you can pass any
                                 * value to be used in your code later.
                                 * @param parent an object to be set as container's parent
                                 */
                                setParent(parent: Nullable<TileEntity> | any): void;
                                /**
                                 * Getter for {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.parent Container.parent} field.
                                 */
                                getParent(): Nullable<TileEntity> | any;
                                /**
                                 * Gets the slot by it's name. If a slot with specified name doesn't
                                 * exists, creates an empty one with specified name.
                                 * @param name slot name
                                 * @returns Contents of the slot in a {@link UI.Slot} object.
                                 * You can modify it to change the contents of the slot.
                                 */
                                getSlot(name: string): Slot;
                                /**
                                 * Gets the slot by it's name. If a slot with specified name doesn't
                                 * exists, creates an empty one with specified name.
                                 * @param name slot name
                                 * @returns Contents of the slot in a FullSlot object containing
                                 * more useful methods for slot manipulation.
                                 */
                                getFullSlot(name: string): Slot;
                                getSlotVisualImpl(name: string): UiVisualSlotImpl;
                                handleInventoryToSlotTransaction(invSlot: number, slotName: string, amount: number): void;
                                handleSlotToSlotTransaction(from: string, to: string, amount: number): void;
                                handleSlotToInventoryTransaction(slotName: string, amount: number): void;
                                /**
                                 * Set slot's content by it's name. If a slot with specified name doesn't
                                 * exists, creates an empty one with specified name and item.
                                 * @param name slot name
                                 */
                                setSlot(name: string, id: number, count: number, data: number): void;
                                /**
                                 * Set slot's content by it's name. If a slot with specified name doesn't
                                 * exists, creates new with specified name and item.
                                 * @param name slot name
                                 * @param extra item extra value. Note that it should be an instance of
                                 * {@link ItemExtraData} and not it's numeric ID
                                 */
                                setSlot(name: string, id: number, count: number, data: number, extra: Nullable<NativeItemInstanceExtra>): void;
                                /**
                                 * Validates slot contents. If the data value is less then `0`, it becomes
                                 * `0`, if ID is `0` or count is less then or equals to zero, slot is reset
                                 * to an empty one.
                                 * @param name slot name
                                 */
                                validateSlot(name: string): void;
                                /**
                                 * Clears slot's contents.
                                 * @param name slot name
                                 */
                                clearSlot(name: string): void;
                                /**
                                 * Drops slot's contents on the specified coordinates
                                 * and clears the slot.
                                 * @param name slot name
                                 * @deprecated Client only, use {@link BlockSource.spawnDroppedItem} instead.
                                 */
                                dropSlot(name: string, x: number, y: number, z: number): void;
                                /**
                                 * Drops the contents of all the slots in the container on the specified
                                 * coordinates and clears them.
                                 * @deprecated Client only, use {@link BlockSource.spawnDroppedItem} instead.
                                 */
                                dropAt(x: number, y: number, z: number): void;
                                /**
                                 * Validates all the slots in the container.
                                 */
                                validateAll(): void;
                                /**
                                 * @returns Currently opened {@link UI.IWindow}
                                 * or `null` if no window is currently opened in the container.
                                 */
                                getWindow(): window.IWindow;
                                _addElement(element: elements.UIElement, name: string): void;
                                addElementInstance(element: elements.UIElement, name: string): void;
                                _removeElement(name: string): void;
                                /**
                                 * Opens {@link UI.IWindow} object in the container.
                                 * @param win {@link UI.IWindow} object to be opened
                                 */
                                openAs(win: window.IWindow): void;
                                /**
                                 * Closes currently opened window.
                                 */
                                close(): void;
                                /**
                                 * Sets an object to be notified when the window is opened.
                                 * @param listener object to be notified when the window is opened
                                 * @since 2.0.4b43
                                 */
                                setOnOpenListener(listener: Container.OnOpenListener | OnOpenCloseListenerJS): void;
                                /**
                                 * Sets an object to be notified when the window is closed.
                                 * @param listener object to be notified when the window is closed
                                 */
                                setOnCloseListener(listener: Container.OnCloseListener | OnOpenCloseListenerJS): void;
                                onWindowClosed(): void;
                                /**
                                 * @returns `true`, if some window is opened in the container.
                                 */
                                isOpened(): boolean;
                                /**
                                 * Same as {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.getWindow Container.getWindow}.
                                 */
                                getGuiScreen(): window.IWindow;
                                /**
                                 * @returns Window's content object (usually specified in the window's
                                 * constructor) if a window was opened in the container, `null` otherwise.
                                 */
                                getGuiContent(): Nullable<window.WindowContent>;
                                /**
                                 * @returns Window's element by it's name.
                                 * @param name element name
                                 */
                                getElement(name: string): Nullable<elements.UIElement>;
                                /**
                                 * Passes any value to the element.
                                 * @param elementName element name
                                 * @param bindingName binding name, you can access the value from the
                                 * element by this name
                                 * @param val value to be passed to the element
                                 */
                                setBinding(elementName: string, bindingName: string, val: any): void;
                                /**
                                 * Gets any value from the element.
                                 * @param elementName element name
                                 * @param bindingName binding name, you can access the value from the
                                 * element by this name. Some binding names are reserved for additional
                                 * element information, e.g. "element_obj" contains pointer to the
                                 * current object and "element_rect" contains android.graphics.Rect
                                 * object containing drawing rectangle
                                 * @returns Value that was get from the element or `null` if the
                                 * element doesn't exist.
                                 */
                                getBinding<T=any>(elementName: string, bindingName: string): elements.UIElement | android.graphics.Rect | T | null;
                                handleBindingDirty(): void;
                                sendChanges(): void;
                                /**
                                 * Sets "value" binding value for the element. Used to set scales values.
                                 * @param name element name
                                 * @param value value to be set for the element
                                 */
                                setScale(name: string, value: number): void;
                                /**
                                 * @param name element name
                                 * @returns Value "value" binding, e.g. scale value, or `null` if no
                                 * element with specified name exist.
                                 */
                                getValue(name: string): Nullable<number>;
                                /**
                                 * Sets "text" binding value for the element. Used to set element's text.
                                 * @param name element name
                                 * @param value value to be set for the element
                                 */
                                setText(name: string, value: string | number): void;
                                /**
                                 *
                                 * @param name element name
                                 * @returns Value "text" binding, usually the text displayed on the
                                 * element, or `null` if no element with specified name exist.
                                 */
                                getText(name: string): Nullable<string>;
                                /**
                                 * @param name element name
                                 * @returns `true` if the element is currently hovered.
                                 */
                                isElementTouched(name: string): boolean;
                                /**
                                 * Forces ui elements of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateUIElements(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui elements of the window to refresh.
                                 */
                                invalidateUIElements(): void;
                                /**
                                 * Forces ui drawables of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateUIDrawing(onCurrentThread: boolean): void;
                                invalidateUIDrawing(): void;
                                /**
                                 * Forces ui elements and drawables of the window to refresh.
                                 * @param onCurrentThread if `true`, the drawables will be refreshed
                                 * immediately, otherwise refresh event will be posted; ensure you are
                                 * in the UI thread if you pass `true` as the parameter
                                 * @default onCurrentThread: false
                                 */
                                invalidateUI(onCurrentThread: boolean): void;
                                /**
                                 * Forces ui elements and drawables of the window to refresh.
                                 */
                                invalidateUI(): void;
                                /**
                                 * @deprecated Backwards compatibility.
                                 */
                                refreshSlots(): void;
                                /**
                                 * @deprecated Backwards compatibility.
                                 */
                                applyChanges(): void;
                                /**
                                 * If the container is a custom workbench, you can set the slot prefix
                                 * via this method call. {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.getFieldSlot Container.getFieldSlot}
                                 * will get field slot by `prefix + slot` name.
                                 * @param wbsnp custom workbench slot prefix
                                 */
                                setWbSlotNamePrefix(wbsnp: string): void;
                                /**
                                 * @param slot slot index
                                 * @returns Workbench slot instance by slot index.
                                 */
                                getFieldSlot(slot: number): Slot;
                                /**
                                 * @returns JS array of all slots.
                                 */
                                asScriptableField(): Slot[];
                                /**
                                 * @returns `false` if container supports multiplayer, `true` otherwise.
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
                         * @returns Slot name.
                         */
                        getName(): string;
                        /**
                         * @returns Container linked to the slot.
                         */
                        getContainer(): ItemContainer;
                        /**
                         * @returns Following {@link ItemContainerSlot} as {@link ItemInstance} object.
                         */
                        asScriptable(): ItemInstance;
                        /**
                         * @returns Following {@link ItemContainerSlot} as {@link org.json.JSONObject} instance.
                         */
                        asJson(): org.json.JSONObject;
                        /**
                         * @returns Whether the slot is empty or not.
                         */
                        isEmpty(): boolean;
                        /**
                         * Refreshes slot in UI.
                         */
                        markDirty(): void;
                        /**
                         * Clears slot contents.
                         */
                        clear(): void;
                        /**
                         * Resets slot if it's ID or count equals `0`.
                         */
                        validate(): void;
                        /**
                         * Drops slot contents in given world at given coords.
                         */
                        dropAt(region: BlockSource, x: number, y: number, z: number): void;
                        /**
                         * Sets slot contents.
                         */
                        setSlot(id: number, count: number, data: number): void;
                        setSlot(id: number, count: number, data: number, extra: Nullable<innercore.api.NativeItemInstanceExtra>): void;
                        resetSavingEnabled(): void;
                        setSavingEnabled(enabled: boolean): void;
                        isSavingEnabled(): boolean;
                        /**
                         * @returns Numeric ID of the item in slot.
                         */
                        getId(): number;
                        /**
                         * @returns Count of the item in slot.
                         */
                        getCount(): number;
                        /**
                         * @returns Data of the item in slot.
                         */
                        getData(): number;
                        /**
                         * @returns Extra data object of the item in slot,
                         * or `null` if it is not present in the given item.
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
                         * Constructs a new {@link ItemContainer} object.
                         */
                        constructor();
                        /**
                         * Constructs a new {@link ItemContainer} object from given deprecated
                         * {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container Container} object.
                         */
                        constructor(legacyContainer: innercore.api.mod.ui.container.Container);
                        getNetworkEntity(): NetworkEntity;
                        getNetworkName(): string;
                        getUiAdapter(): ItemContainerUiHandler;
                        getWindow(): innercore.api.mod.ui.window.IWindow;
                        getWindowContent(): innercore.api.mod.ui.window.WindowContent;
                        removeEntity(): void;
                        /**
                         * Sets container's parent object, for {@link TileEntity}'s
                         * container it should be it reference, otherwise you can pass any
                         * value to be used in your code later.
                         * @param parent an object to be set as container's parent
                         */
                        setParent(parent: Nullable<TileEntity> | any): void;
                        /**
                         * @returns Tile if the following container is part of it,
                         * and `null` otherwise.
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
                         * Gets the slot by it's name. If a slot with specified name doesn't
                         * exists, creates an empty one with specified name.
                         * @param name slot name
                         * @returns Contents of the slot in a {@link ItemContainerSlot} object.
                         * You can modify it to change the contents of the slot.
                         */
                        getSlot(name: string): ItemContainerSlot;
                        /**
                         * @deprecated Use {@link com.zhekasmirnov.apparatus.api.container.ItemContainer.getSlot getSlot} instead.
                         */
                        getFullSlot(name: string): ItemContainerSlot;
                        markSlotDirty(name: string): void;
                        markAllSlotsDirty(): void;
                        /**
                         * Sets slot's content by it's name from given slot object. If a slot with specified
                         * name doesn't exist, a new slot with specified name and item will be created.
                         * @param name slot name
                         * @param slot {@link com.zhekasmirnov.apparatus.api.container.ItemContainerSlot ItemContainerSlot} object to specify slot contents
                         */
                        setSlot(name: string, slot: ItemContainerSlot): void;
                        /**
                         * Set slot's content by it's name. If a slot with specified name doesn't
                         * exists, creates new with specified name and item.
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
                         * Validates all the slots in the container.
                         */
                        validateAll(): void;
                        /**
                         * Validates slot contents. If the data value is less then 0, it becomes
                         * 0, if ID is 0 or count is less then or equals to zero, slot is reset
                         * to an empty one.
                         * @param name slot name
                         */
                        validateSlot(name: string): void;
                        /**
                         * Clears slot's contents.
                         * @param name slot name
                         */
                        clearSlot(name: string): void;
                        /**
                         * Drops slot's contents on the specified coordinates and clears the
                         * slot.
                         * @param name slot name
                         */
                        dropSlot(region: BlockSource, name: string, x: number, y: number, z: number): void;
                        /**
                         * Sends event to move specified amount of items from the player inventory slot by given index
                         * to container slot by given name. This event is sent from client to server,
                         * so you should use it only on the client side, for example, in custom slot element touch events, etc.
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
                         * for example, in custom slot element touch events, etc.
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
                         * because it's decided by {@link ItemContainer} automatically, and you just don't need to do this.
                         * This event is sent from client to server, so you should use it only on the client side,
                         * for example, in custom slot element touch events, etc.
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
                         * Sets "value" binding value for the element. Used to set scales values.
                         * @param elementName element name
                         * @param value value to be set for the element
                         */
                        setScale(elementName: string, value: number): void;
                        setClientScale(elementName: string, value: number): void;
                        /**
                         * @param elementName element name
                         * @returns Value with "value" binding, e.g. scale value, or `null` if no
                         * element with specified name exist.
                         */
                        getValue(elementName: string, value: number): Nullable<number>;
                        /**
                         * Sets "text" binding value for the element. Used to set element's text.
                         * @param elementName element name
                         * @param text value to be set for the element
                         */
                        setText(elementName: string, text: string | number): void;
                        setClientText(elementName: string, text: string): void;
                        /**
                         * @param elementName element name
                         * @returns Value "text" binding, usually the text displayed on the
                         * element, or `null` if no element with specified name exist.
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
                         * @remarks
                         * Available only in server container events!
                         */
                        sendResponseEvent(name: string, data: PacketData | string): void;
                        /**
                         * Opens UI for client.
                         * @param client client in which UI will be open
                         * @param screenName name of the screen to open
                         */
                        openFor(client: NetworkClient, screenName: string): void;
                        /**
                         * Closes UI for client.
                         * @param client client in which UI will be open
                         */
                        closeFor(client: NetworkClient): void;
                        /**
                         * Closes UI for all clients
                         */
                        close(): void;
                        sendClosed(): void;
                        /**
                         * @since 2.2.0b82
                         */
                        setGlobalSlotSavingEnabled(enabled: boolean): void;
                        /**
                         * @since 2.2.0b82
                         */
                        isGlobalSlotSavingEnabled(): boolean;
                        /**
                         * @since 2.2.0b82
                         */
                        setSlotSavingEnabled(name: string, enabled: boolean): void;
                        /**
                         * @since 2.2.0b82
                         */
                        resetSlotSavingEnabled(name: string): void;
                        /**
                         * @since 2.2.0b82
                         */
                        isSlotSavingEnabled(name: string): boolean;
                        /**
                         * @returns `false` if container supports multiplayer, `true` otherwise.
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
/**
 * Module that allows to work with current Minecraft world.
 * Most of the methods are client-side, use {@link BlockSource} instead.
 */
declare namespace World {
    /**
     * Setups the module to work properly with the world. Usually called by
     * Core Engine, so you generally shouldn't call it yourself.
     * @param isLoaded whether the world is loaded or not
     * @internal
     */
    function setLoaded(isLoaded: boolean): boolean;
    /**
     * @returns Whether the world is loaded or not.
     */
    function isWorldLoaded(): boolean;
    /**
     * @returns Tick number since the player joined the world.
     */
	function getThreadTime(): number;
    /**
     * Retrieves coordinates relative to the block.
     * @param side block side
     * @returns Relative coordinates.
     * @example
     * Return coordinates of the block above the specified:
     * ```js
     * World.getRelativeCoords(x, y, z, EBlockSide.UP);
     * ```
     */
    function getRelativeCoords(x: number, y: number, z: number, side: number): Vector;
    /**
     * @param side block side
     * @returns Normalized vector for this side.
     */
    function getVectorByBlockSide(side: number): Vector;
	/**
	 * @param side number from 0 to 6 (exclusive)
     * @returns Opposite side to argument.
     */
    function getInverseBlockSide(side: number): number;
    /**
     * @returns `true`, if tile can be replaced (for example, grass (not block) and
     * water can be replaced), `false` otherwise
     */
    function canTileBeReplaced(id: number, data: number): boolean;
    /**
     * @since 2.0.2b27
     */
    function doesVanillaTileHasUI(id: number): boolean;
    /**
     * @since 2.0.2b27
     * @remarks
     * Client only method!
     */
    function setBlockUpdateType(type: number): void;
    /**
     * @since 2.0.2b27
     * @remarks
     * Client only method!
     */
    function setBlockUpdateAllowed(allowed: boolean): void;
    /**
     * Enables "BlockChanged" event for the block ID. Event occurs when either
     * old block or new block is registered using this method.
     * @param id numeric tile ID
     * @param enabled if true, the block will be watched
     */
    function setBlockChangeCallbackEnabled(id: number, enabled: boolean): void;
    /**
     * Enables "BlockChanged" event for specified block IDs and registers
     * callback function for the IDs.
     * @param ids string or numeric tile ID, or an array of string and/or
     * numeric tile IDs
     * @param callback function that will be called when "BlockChanged" callback
     * occurs involving one of the blocks. **Warning!** If both old and new
     * blocks are in the IDs list, callback function will be called twice.
     */
    function registerBlockChangeCallback(ids: number | string | (string | number)[], callback: Callback.BlockChangedFunction): void;
    /**
     * Adds a new generation callback using string hash to generate a unique
     * random seed for the chunk generator.
     * @param callbackName one of the generation callbacks
     * @param callback callback function
     * @param uniqueHashStr if specified, will be used as string hash for seed
     * generation, otherwise default hash string will be used
     * @since 2.0.1b11
     */
    function addGenerationCallback(callbackName: string, callback: Callback.GenerateChunkFunction, uniqueHashStr?: string): void;
    /**
     * Sets block in the world using it's tile ID and data.
     * @param id block tile ID
     * @param data block data
     * @deprecated Consider using {@link World.setBlock} instead.
     */
    function nativeSetBlock(x: number, y: number, z: number, id: number, data: number): void;
    /**
     * @returns Tile ID of the block located on the specified coordinates.
     * @deprecated Consider using {@link World.getBlockID} instead.
     */
    function nativeGetBlockID(x: number, y: number, z: number): number;
    /**
     * @returns Data of the block located on the specified coordinates.
     * @deprecated Consider using {@link World.getBlockData} instead.
     */
    function nativeGetBlockData(x: number, y: number, z: number): number;
    /**
     * Sets block in the world using it's tile ID and data.
     * @param id block tile ID
     * @param data block data
     */
    function setBlock(x: number, y: number, z: number, id: number, data: number): void;
    /**
     * Sets block in the world using specified {@link Tile} object.
     * @param fullTile object containing ID and data of the tile
     */
    function setFullBlock(x: number, y: number, z: number, fullTile: Tile): void;
    /**
     * @returns Tile object containing tile ID and data of the block located.
     * on the specified coordinates
     */
    function getBlock(x: number, y: number, z: number): Tile;
    /**
     * @returns Tile ID of the block located on the specified coordinates.
     */
    function getBlockID(x: number, y: number, z: number): number;
    /**
     * @returns Data of the block located on the specified coordinates.
     */
    function getBlockData(x: number, y: number, z: number): number;
    /**
     * Destroys block on the specified coordinates producing appropriate drop
     * and particles. Do not use for massive tasks due to particles being
     * produced.
     * @param drop whether to provide drop for the block or not
     */
    function destroyBlock(x: number, y: number, z: number, drop?: boolean): void;
    /**
     * @returns Light level on the specified coordinates, from 0 to 15.
     * @remarks
     * Client only method!
     */
    function getLightLevel(x: number, y: number, z: number): number;
    /**
     * @param x chunk coordinate
     * @param z chunk coordinate
     * @returns Whether the chunk with specified coordinates is loaded or not.
     */
    function isChunkLoaded(x: number, z: number): boolean;
    /**
     * @param x block coordinate
     * @param y block coordinate
     * @param z block coordinate
     * @returns Whether the chunk containing specified block coordinates is
     * loaded or not.
     */
    function isChunkLoadedAt(x: number, y: number, z: number): boolean;
    /**
     * Returns chunk state on specified location, like loaded,
     * unloaded or interrupted.
     */
    function getChunkState(x: number, z: number): number;
    /**
     * Returns chunk state on specified coordinates, like loaded,
     * unloaded or interrupted.
     */
    function getChunkStateAt(x: number, y: number, z: number): number;
    /**
     * @returns Requested {@link TileEntity} located on the specified coordinates
     * or `null` if it doesn't.
     */
    function getTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;
    /**
     * If the block on the specified coordinates is a TileEntity block and is
     * not initialized, initializes it and returns created {@link TileEntity} object.
     * @returns Tile if one was created, `null` otherwise.
     */
    function addTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;
    /**
     * If the block on the specified coordinates is a {@link TileEntity}, destroys
     * it, dropping it's container.
     * @returns `true` if the tile was destroyed successfully, `false`
     * otherwise.
     */
    function removeTileEntity(x: number, y: number, z: number, region?: BlockSource): boolean;
    /**
	 * @param region BlockSource
     * @returns If the block on the specified coordinates is a {@link TileEntity}, returns
     * it's container, if the block is a {@link NativeTileEntity}, returns it, if
     * none of above, returns `null`.
     */
    function getContainer(x: number, y: number, z: number, region?: BlockSource): Nullable<NativeTileEntity | UI.Container | ItemContainer>;
    /**
     * @returns Current world's time in ticks.
     * @since 2.3.1b116-3 (client-side)
     */
    function getWorldTime(): number;
    /**
     * Sets current world time.
     * @param time time in ticks
     */
    function setWorldTime(time: number): number;
    /**
     * Sets current time to day or night.
     * @param day if true, sets time to 10000 (day), else to 13000 (night)
     * @deprecated Consider using {@link World.setWorldTime} instead.
     */
    function setDayMode(day: boolean): void;
    /**
     * Sets current time to day or night.
     * @param night if true, sets time to 13000 (night), else to 10000 (day)
     * @deprecated Consider using {@link World.setWorldTime} instead.
     */
    function setNightMode(night: boolean): void;
    /**
     * @returns Current weather object. This value should not be edited, call
     * {@link World.setWeather} to change current weather.
     */
    function getWeather(): Weather;
    /**
     * Sets current weather in the world.
     * @param weather {@link Weather} object to be used as current weather value
     */
    function setWeather(weather: Nullable<Weather>): void;
    /**
     * @todo
     * @param mode certain modes also working with actors
     * @since 2.0.2b27
     */
    function clip(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, mode?: number): void;
    /**
     * Drops item or block with specified ID, count, data and
     * extra on the specified coordinates. For blocks, be sure
     * to use block ID, not the tile ID.
     * @returns Spawned drop entity ID.
     */
    function drop(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
    /**
     * Creates an explosion on the specified coordinates.
     * @param power defines how many blocks can the explosion destroy and what
     * blocks can or cannot be destroyed
     * @param fire if true, puts the crater on fire
     */
    function explode(x: number, y: number, z: number, power: number, fire: boolean): void;
    /**
     * Sets biome on the specified coordinates when generating biome map.
     * Should be called only in *GenerateBiomeMap* callback.
     * @param x block x coordinate
     * @param z block z coordinate
     * @param id biome ID to be set on the specified coordinates
     * @since 2.0.1b11
     */
    function setBiomeMap(x: number, z: number, id: number): void;
    /**
     * Gets biome on the specified coordinates when generating biome map.
     * Should be called only in *GenerateBiomeMap* callback.
     * @param x block x coordinate
     * @param z block z coordinate
     * @returns Biome's numeric ID.
     * @since 2.0.1b11
     */
    function getBiomeMap(x: number, z: number): number;
    /**
     * Overrides currently biome on specified coordinates. Consider
     * using {@link World.setBiomeMap} in *GenerateBiomeMap* callback.
     */
    function setBiome(x: number, z: number): void;
    /**
     * @returns Biome ID on the specified coordinates.
     */
    function getBiome(x: number, z: number): number;
    /**
     * @returns Biome name on the specified coordinates.
     */
    function getBiomeName(x: number, z: number): string;
    /**
     * @returns Biome name by specified identifier.
     */
    function getBiomeNameById(biome: number): string;
    /**
     * @returns Biome temperature on specified coordinates.
     * @remarks
     * Client only method!
     */
    function getTemperature(x: number, y: number, z: number): number;
    /**
     * @returns Grass color for specified coordinates, uses android integer
     * color model.
     */
    function getGrassColor(x: number, z: number): number;
    /**
     * Sets grass color on the specified coordinates, uses android-like
     * integer color model.
     * @param color grass color to be set for the specified coordinates
     */
    function setGrassColor(x: number, z: number, color: number): void;
    /**
     * @returns Grass color for specified coordinates, uses rgb color model.
     */
    function getGrassColorRGB(x: number, z: number): Color;
    /**
     * Sets grass color on the specified coordinates, uses rgb color model.
     * @param rgb grass color to be set for the specified coordinates
     */
    function setGrassColorRGB(x: number, z: number, rgb: Color): void;
    /**
     * @returns `true`, if one can see sky from the specified position, `false`
     * otherwise.
	 * @remarks
     * Client only method!
     */
    function canSeeSky(x: number, y: number, z: number): boolean;
    /**
     * Plays standart Minecraft sound on the specified coordinates.
     * @param name sound name
     * @param volume sound volume from 0 to 1
     * @param pitch sound pitch, from 0 to 1, 0.5 is default value
     */
    function playSound(x: number, y: number, z: number, name: string, volume: number, pitch?: number): void;
    /**
     * Plays standart Minecraft sound from the specified entity.
     * @param name sound name
     * @param volume sound volume from 0 to 1
     * @param pitch sound pitch, from 0 to 1, 0.5 is default value
     */
    function playSoundAtEntity(entity: number, name: string, volume: number, pitch?: number): void;
    /**
     * @returns Loaded world directory full path.
     */
    function getWorldDir(): string;
    /**
     * @returns Currently world seed, which is used, for example,
     * in generation callbacks.
     */
    function getSeed(): number;
}
/**
 * Mostly internal variable determined to be useful for control
 * mod lifecycle, configuration and executables.
 */
declare var __mod__: Mod.ModJsAdapter;
/**
 * Name property, generally loaded from *mod.info*.
 */
declare var __name__: string;
/**
 * Full path to the mod's directory, ends with "/".
 */
declare var __dir__: string;
/**
 * Main mod configuration manager, settings are stored in *config.json* file.
 */
declare var __config__: Config;
/**
 * Full path to current selected pack (like Inner Core) directory.
 */
declare var __packdir__: string;
/**
 * Full path to current modpack (like *innercore*) directory.
 * @since 2.2.1b85
 */
declare var __modpack__: ModPack.ModPackJsAdapter;
/**
 * Numeric IDs of vanilla blocks placed in the world.
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
 * Numeric IDs of vanilla items.
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
 * Numeric IDs of vanilla blocks in the inventory.
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
 * Module used to create and manage Updatables. Updatables provide the proper
 * way to manage objects that update their state every tick. Updatables may not
 * be notified every tick, if there are too many, to avoid user interface
 * freezes.
 */
declare namespace Updatable {
    /**
     * Adds object to updatables list.
     * @param obj object to be added to updatables list
     */
	function addUpdatable(obj: Updatable): any;
    /**
     * Adds object to updatables list, that ticks on client
     * thread and never saves.
     * @param obj object to be added to updatables list
     * @since 2.0.4b40
     */
    function addAnimator(obj: Updatable): any;
	/**
     * Adds object to updatables list.
     * @param obj object to be added to updatables list
     */
    function addLocalUpdatable(obj: Updatable): any;
    /**
     * @returns ArrayList instance containing all defined
     * {@link Updatable} objects.
     */
    function getAll(): java.util.ArrayList<Updatable>;
    /**
     * @returns Current thread tick number.
     */
    function getSyncTime(): number;
}
/**
 * Updatable is an object that is notified every tick via it's
 * {@link Updatable.update} method call.
 */
interface Updatable {
    /**
     * Called every tick.
     */
    update: () => void;
    /**
     * Once `true`, the object will be removed from updatables list and will no
     * longer receive update calls.
     */
    remove?: boolean;
    /**
     * Any other user-defined properties.
     */
    [key: string]: any;
}
declare module UI {
    type ElementName = string | number | symbol;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent}
	 */
	export type WindowContent = com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowContent}
	 */
	export type StandardWindowContent = com.zhekasmirnov.innercore.api.mod.ui.window.StandardWindowContent;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription}
	 */
	export type FontDescription = com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription}
	 */
    export type FontParams = com.zhekasmirnov.innercore.api.mod.ui.types.FontDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.window.WindowLocationDescription}
	 */
    export type WindowLocationParams = com.zhekasmirnov.innercore.api.mod.ui.window.WindowLocationDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet}
	 */
	export type BindingsSet = com.zhekasmirnov.innercore.api.mod.ui.types.BindingSet;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle}
	 */
	export type Style = com.zhekasmirnov.innercore.api.mod.ui.types.UIStyle;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.UIClickEvent}
	 */
	export type UIClickEvent = com.zhekasmirnov.innercore.api.mod.ui.elements.UIClickEvent;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.ColorDrawingDescription}
	 */
    export type ColorDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.ColorDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.CustomDrawingDescription}
	 */
    export type CustomDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.CustomDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.FrameDrawingDescription}
	 */
    export type FrameDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.FrameDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.ImageDrawingDescription}
	 */
    export type ImageDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.ImageDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.LineDrawingDescription}
	 */
    export type LineDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.LineDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.background.TextDrawingDescription}
	 */
    export type TextDrawing = com.zhekasmirnov.innercore.api.mod.ui.background.TextDrawingDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.BasicElementDescription}
	 */
    export type UIElement = com.zhekasmirnov.innercore.api.mod.ui.elements.BasicElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.CustomElementDescription}
	 */
    export type UICustomElement = com.zhekasmirnov.innercore.api.mod.ui.elements.CustomElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription}
	 */
    export type UIButtonElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription}
	 */
    export type UICloseButtonElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ButtonElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.FrameElementDescription}
	 */
    export type UIFrameElement = com.zhekasmirnov.innercore.api.mod.ui.elements.FrameElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.ImageElementDescription}
	 */
    export type UIImageElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ImageElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.ScaleElementDescription}
	 */
    export type UIScaleElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ScaleElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.ScrollElementDescription}
	 */
    export type UIScrollElement = com.zhekasmirnov.innercore.api.mod.ui.elements.ScrollElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.SlotElementDescription}
	 */
    export type UISlotElement = com.zhekasmirnov.innercore.api.mod.ui.elements.SlotElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.SwitchElementDescription}
	 */
    export type UISwitchElement = com.zhekasmirnov.innercore.api.mod.ui.elements.SwitchElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.TabElementDescription}
	 */
    export type UITabElement = com.zhekasmirnov.innercore.api.mod.ui.elements.TabElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.TextElementDescription}
	 */
    export type UITextElement = com.zhekasmirnov.innercore.api.mod.ui.elements.TextElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.FPSTextElementDescription}
	 */
    export type UIFPSTextElement = com.zhekasmirnov.innercore.api.mod.ui.elements.FPSTextElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.elements.InvSlotElementDescription}
	 */
    export type UIInvSlotElement = com.zhekasmirnov.innercore.api.mod.ui.elements.InvSlotElementDescription;
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.window.IWindow}
	 */
	export interface IWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.IWindow {}
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.container.Slot}
	 */
	export interface Slot extends com.zhekasmirnov.innercore.api.mod.ui.container.Slot {}
	/**
	 * {@inheritDoc UI.UIElement}
	 */
	export type Element = UIElement;
    /**
	 * Object containing ui elements with key as the name and value as the
	 * {@link UI.UIElement} instance to be used.
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
	 * Object used to handle windows opening and closing events.
	 */
	export interface WindowEventListener {
		/**
		 * Called when the window is opened.
		 * @param window current {@link UI.Window} object
		 */
		onOpen: (window: Window) => void,
		/**
		 * Called when the window is closed.
		 * @param window current {@link UI.Window} object
		 */
		onClose: (window: Window) => void
	}
    /**
	 * Class representing several windows opened at the same. For example,
	 * {@link UI.StandardWindow} is a window group that consists of several separate
	 * windows.
	 */
    export class WindowGroup extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowGroup {
        static class: java.lang.Class<WindowGroup>;
        /**
		 * Constructs new {@link UI.WindowGroup} instance.
		 */
        constructor();
    }
    /**
	 * Containers are used to properly manipulate windows and save slots
	 * contents and windows state between window opens. Every {@link TileEntity} has
	 * a built-in container that can be accessed as {@link TileEntity.container}.
	 * @deprecated Client class only.
	 */
    export class Container extends com.zhekasmirnov.innercore.api.mod.ui.container.Container {
        static class: java.lang.Class<Container>;
        /**
		 * Creates a new instance of {@link UI.Container}.
		 */
        constructor();
        /**
		 * Creates a new instance of {@link UI.Container} and initializes it's parent.
		 *
		 * See {@link com.zhekasmirnov.innercore.api.mod.ui.container.Container.setParent UI.Container.setParent} for details.
		 */
        constructor(parent: Nullable<TileEntity> | any);
    }
    /**
	 * Represents window of required size that can be opened in container to
	 * provide any required UI facilities.
	 */
    export class Window extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindow {
        static class: java.lang.Class<Window>;
        /**
		 * Constructs new {@link UI.Window} object with specified bounds.
		 * @param location object containing window's bounds. Note that the
		 * bounds change the width of the window, but the full width of the
		 * window becomes 1000 units.
		 */
        constructor(location: com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation);
        /**
		 * Constructs new {@link UI.Window} object with specified content.
		 * @param content window's content
		 */
        constructor(content: WindowContent);
        /**
         * Constructs new empty {@link UI.Window} object.
         */
        constructor();
    }
    /**
	 * Legacy misspelled standard UI, which is works under classic
	 * styling, but must be used only in unsupported mods.
	 * @deprecated In 2.0.4b40, use {@link UI.StandardWindow} instead.
	 */
    export class StandartWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowStandard {
        static class: java.lang.Class<StandartWindow>;
        constructor(content: StandardWindowContent);
        constructor();
    }
    /**
	 * Class used to create standard UI for the mod's machines.
	 * {@link UI.StandardWindow} is a {@link UI.WindowGroup} that has three windows with names
	 * `"main"`, `"inventory"` and `"header"`. They represent custom window
	 * contents, player's inventory and window's header respectively.
	 * @since 2.0.4b40
	 */
    export class StandardWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowStandard {
        static class: java.lang.Class<StandardWindow>;
        /**
		 * Constructs new {@link UI.StandardWindow} with specified content.
		 * Content is applied to the main window, header and inventory remain
		 * the same.
		 * @param content object containing window description
		 */
        constructor(content: StandardWindowContent);
        /**
         * Constructs new empty {@link UI.StandardWindow} object.
         */
        constructor();
    }
	/**
	 * {@inheritDoc com.zhekasmirnov.innercore.api.mod.ui.window.UIAdaptiveWindow}
	 */
    export class AdaptiveWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UIAdaptiveWindow {
        static class: java.lang.Class<AdaptiveWindow>;
        /**
	     * Constructs new {@link UI.AdaptiveWindow} with specified content.
	     * @param content object containing window description
	     */
        constructor(content: WindowContent);
        /**
	     * Constructs a new empty {@link UI.AdaptiveWindow}.
	     */
        constructor();
    }
    /**
	 * Class used to create windows with multiple tabs.
	 */
    export class TabbedWindow extends com.zhekasmirnov.innercore.api.mod.ui.window.UITabbedWindow {
        static class: java.lang.Class<TabbedWindow>;
        /**
		 * Constructs new {@link UI.TabbedWindow} with specified location.
		 * @param loc location to be used for the tabbed window
		 */
        constructor(loc: com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation);
        /**
		 * Constructs new {@link UI.TabbedWindow} with specified content.
		 * @param content object containing window description
		 */
        constructor(content: WindowContent);
        /**
         * Constructs new empty {@link UI.TabbedWindow} object.
         */
        constructor();
    }
    /**
	 * Class representing window's location. All coordinates are defined in
	 * units (given screen's width is 1000 units).
	 */
    export class WindowLocation extends com.zhekasmirnov.innercore.api.mod.ui.window.UIWindowLocation {
        static class: java.lang.Class<WindowLocation>;
        /**
		 * Constructs new {@link UI.WindowLocation} instance with default position and
		 * size (fullscreen window).
		 */
        constructor();
        /**
		 * Constructs new {@link UI.WindowLocation} instance with specified parameters.
		 */
        constructor(desc: com.zhekasmirnov.innercore.api.mod.ui.window.WindowLocationDescription);
    }
    /**
	 * Class representing static or animated texture.
	 */
    export class Texture extends com.zhekasmirnov.innercore.api.mod.ui.types.Texture {
		static class: java.lang.Class<Texture>;
	}
    /**
	 * Class representing font used in the UI.
	 */
    export class Font extends com.zhekasmirnov.innercore.api.mod.ui.types.Font {
        static class: java.lang.Class<Font>;
        constructor(color: number, size: number, shadow: number);
        constructor(desc: FontDescription);
    }
	/**
	 * Class used to visualize configuration file contents in a simple way.
	 */
    export class ConfigVisualizer extends com.zhekasmirnov.innercore.api.mod.util.ConfigVisualizer {
        static class: java.lang.Class<ConfigVisualizer>;
		/**
		 * Constructs new {@link UI.ConfigVisualizer} instance with specified elements
		 * names prefix.
		 * @param config configuration file to be loaded
		 * @param prefix elements names prefix used for this visualizer
		 */
        constructor(config: com.zhekasmirnov.innercore.mod.build.Config, prefix: string);
		/**
		 * Constructs new {@link UI.ConfigVisualizer} instance with default elements
		 * names prefix (*config_vis*).
		 * @param config configuration file to be loaded
		 */
        constructor(config: com.zhekasmirnov.innercore.mod.build.Config);
    }
    /**
	 * Namespace containing method to get {@link com.zhekasmirnov.innercore.api.mod.ui.types.FrameTexture FrameTexture} instances.
	 */
    export class FrameTextureSource extends java.lang.Object {
        static class: java.lang.Class<FrameTextureSource>;
        /**
		 * @param name gui texture name of the frame
		 */
        static get(name: string): com.zhekasmirnov.innercore.api.mod.ui.types.FrameTexture;
    }
    /**
	 * Namespace containing methods used to get and add gui textures.
	 */
    export class TextureSource extends java.lang.Object {
        static class: java.lang.Class<TextureSource>;
        /**
		 * @param name gui texture name
		 * @returns Bitmap instance with the ui texture, if it
		 * was loaded, with `"missing_texture"` texture otherwise.
		 */
        static get(name: string): android.graphics.Bitmap;
        /**
		 *
		 * @param name gui texture name
		 * @returns Bitmap instance with the ui texture, if it
		 * was loaded, `null` otherwise.
		 */
        static getNullable(name: string): Nullable<android.graphics.Bitmap>;
        /**
		 * Adds any bitmap as a gui texture with specified name.
		 * @param name gui texture name
		 * @param bitmap {@link android.graphics.Bitmap} instance to be used as
		 * gui texture
		 */
        static put(name: string, bitmap: android.graphics.Bitmap): void;
    }
    /**
	 * Same as {@link UI.getScreenHeight}.
	 */
    export function getScreenRelativeHeight(): number;
    /**
	 * @returns Screen height in units.
	 */
    export function getScreenHeight(): number;
    /**
	 * @returns Current {@link android.app.Activity} instance that can be used as
	 * {@link android.content.Context} wherever required.
	 */
    export function getContext(): android.app.Activity;
}
/**
 * Type used to mark Java bytes.
 */
type jbyte = number;
/**
 * Most methods must return `null` if value is not presented.
 */
type Nullable<T> = T | null;
/**
 * Flattened hieracly, extendable in declarations.
 */
type Scriptable = {
    [key: string]: any
}
/**
 * Object representing the set of coordinates in the three-dimensional world.
 */
interface Vector {
    x: number,
    y: number,
    z: number
}
/**
 * Object representing coordinate set with side data.
 */
interface BlockPosition extends Vector {
    /**
     * Side of the block, one of the {@link EBlockSide} constants.
     */
    side: number
}
/**
 * Object representing RGB color.
 */
interface Color {
    r: number,
    g: number,
    b: number
}
/**
 * Object representing pitch/yaw angle set (in radians).
 */
interface LookAngle {
    pitch: number,
    yaw: number
}
/**
 * Object representing item instance in the inventory.
 */
interface ItemInstance {
    /**
     * Item ID.
     */
    id: number,
    /**
     * Amount of items of the specified ID.
     */
    count: number,
    /**
     * Item data value. Generally specifies some property of the item, e.g.
     * color, material, etc. In many cases `-1` means "any data value".
     * @default 0
     */
    data: number,
    /**
     * Item extra data. Contains some additional item data such as enchants,
     * custom item name or some additional properties.
     */
    extra?: ItemExtraData
}
/**
 * Array of three or four elements representing item ID, count, data and extra respectively.
 * Uses in block drop functions.
 */
type ItemInstanceArray = [number, number, number, ItemExtraData?];
/**
 * Object representing block in the world.
 */
interface Tile {
    id: number,
    data: number
}
/**
 * Object representing current weather in the world.
 */
interface Weather {
    /**
     * Current rain level, from 0 (no rain) to 10 (heavy rain).
     */
    rain: number,
    /**
     * Current lightning level, from 0 (no lightning) to 10.
     */
    thunder: number
}
/**
 * Module that can be used to localize mods.
 * All default strings (e.g. item names, windows titles, etc.) in the mod should
 * be in English. Add translations to these strings using
 * {@link Translation.addTranslation}. For items and blocks translations are applied
 * automatically. For the other strings, use {@link Translation.translate}.
 */
declare namespace Translation {
    /**
     * Adds translations for specified object in several languages.
     * @param name default string in English or name key
     * @param localization object containing two-letter language codes as keys
     * and localized strings in the specified language as values
     */
    function addTranslation(name: string, localization: { [language: string]: string }): void;
    /**
     * Translates string from English to current game language (if available).
     * Add translations via {@link Translation.addTranslation} to apply them.
     * @param name default string in English or name key
     * @returns String in the current game language or input string if
     * translation is not available.
     */
    function translate(name: string): string;
    /**
     * @returns Two-letter language code for current game language.
     */
    function getLanguage(): string;
}
/**
 * Module used to manage block and tools material and create tools with all
 * required properties.
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
     * Registers item as a tool.
     * @param id numeric item ID
     * @param toolMaterial registered tool material name or tool material object
     * used to register the tool
     * @param blockMaterials block material names that can be broken by this
     * instrument. For example, you can use *["stone"]* for the pickaxes
     * @param params additional tool parameters
     */
    function registerTool(id: number, toolMaterial: string | ToolMaterial, blockMaterials: string[], params?: ToolParams): void;
    /**
     * Registers item as a sword.
     * @param id numeric item ID
     * @param toolMaterial registered tool material name or tool material object
     * used to register the sword
     * @param params additional tool parameters
     */
    function registerSword(id: number, toolMaterial: string | ToolMaterial, params?: ToolParams): void;
    /**
     * Registers material and digging level for the specified block.
     * @param uid numeric tile ID
     * @param materialName material name
     * @param level block's digging level
     * @param isNative used to mark vanilla blocks data. Generally used within
     * Core Engine code and should not be used within mods until you really
     * know what you're doing
     */
    function registerBlockMaterial(uid: number, materialName: string, level?: number, isNative?: boolean): void;
    /**
     * Sets digging level for block. If digging level of tool is higher then
     * block's one, the block is dropped.
     * @param uid numeric tile ID
     * @param level block's digging level
     */
    function registerBlockDiggingLevel(uid: number, level: number): void;
    /**
     * Registers material and digging level for the specified blocks.
     * @param materialName material name
     * @param UIDs an array of numeric tiles IDs
     * @param isNative used to mark vanilla blocks data. Generally used within
     * Core Engine code and should not be used within mods until you really
     * know what you're doing
     */
    function registerBlockMaterialAsArray(materialName: string, UIDs: number[], isNative: boolean): void;
    /**
     * @deprecated Backwards compatibility.
     */
    function refresh(): void;
    /**
     * @param blockID numeric tile ID
     * @returns Object containing ToolAPI block data or undefined if no block
     * data was specified for this block.
     */
    function getBlockData(blockID: number): BlockData | undefined;
    /**
     * @param blockID numeric tile ID
     * @returns Object containing block material information or `null`, if no
     * block data was specified for this block.
     */
    function getBlockMaterial(blockID: number): Nullable<BlockMaterial>;
    /**
     * @param blockID numeric tile ID
     * @returns Destroy level of the block with specified ID or `0`, if no block
     * data was specified for this block.
     */
    function getBlockDestroyLevel(blockID: number): number;
    /**
     * @param extra item extra instance, if not specified, method uses carried
     * item's extra
     * @returns Enchant data object, containing enchants used for blocks
     * destroy speed calculations.
     */
    function getEnchantExtraData(extra?: ItemExtraData): EnchantData;
    /**
     * Applies fortune drop modifier to the drop array.
     * @param drop drop array containing number of the arrays
     * @param level enchantment level
     */
    function fortuneDropModifier(drop: ItemInstanceArray[], level: number): ItemInstanceArray[];
    /**
     * Calculates destroy time for the block that is being broken with specified
     * tool at the specified coords. Used mostly by Core Engine to apply break.
     * time
     * @param ignoreNative if block and item are native items, and this
     * parameter is set to true, all the calculations will still be performed
     */
    function getDestroyTimeViaTool(fullBlock: Tile, toolItem: ItemInstance, coords: Callback.ItemUseCoordinates, ignoreNative?: boolean): number;
    /**
     * @param itemID numeric item ID
     * @returns Tool information stored in slightly modified
     * {@link ToolAPI.ToolParams} object or null if no tool data was specified.
     */
    function getToolData(itemID: number): Nullable<ToolParams>;
    /**
     * @param itemID numeric item ID
     * @returns Tool's breaking level or 0 if no tool data was provided.
     */
    function getToolLevel(itemID: number): number;
    /**
     * @param itemID numeric item ID
     * @param blockID numeric tile ID
     * @returns Digging level if specified tool can mine specified block, `0` if
     * data for the tool or for the block was not specified or if specified tool
     * cannot mine specified block.
     */
    function getToolLevelViaBlock(itemID: number, blockID: number): number;
    /**
     * @returns Carried tool information stored in slightly modified
     * {@link ToolAPI.ToolParams} object or null if no tool data was specified.
     */
    function getCarriedToolData(): any;
    /**
     * @returns Carried tool's breaking level or `0` if no tool data was provided.
     */
    function getCarriedToolLevel(): number;
    /**
     * @internal
     */
    function resetEngine(): void;
    /**
     * Spawns experience orbs on the specified coordinate.
     * @param value amount of experience to spawn
     */
    function dropExpOrbs(x: number, y: number, z: number, value: number): void;
    /**
     * Spawns random amount of experience on the specified block coordinates.
     * @param coords block coordinates
     * @param minVal minimum amount of orbs to be spawned
     * @param maxVal maximum amount of orbs to be spawned
     * @param modifier additional experiences, usually passed from
     * {@link ToolAPI.EnchantData.experience} field
     */
    function dropOreExp(coords: Vector, minVal: number, maxVal: number, modifier: number): void;
    /**
     * @param blockID numeric tile ID
     */
    function getBlockMaterialName(blockID: number): Nullable<string>;
    /**
     * Object used to describe tool material type.
     */
    interface ToolMaterial {
        /**
         * Divider used to calculate block breaking
         * speed. 2 is a default value for wooden instruments and 12 is a default
         * value for golden instruments.
         */
        efficiency?: number,
        /**
         * Additional damage for the instruments, this value
         * is added to the base tool damage. If damage is not integer, it is rounded
         * to the higher integer with the chance of the fractional part, e.g. if
         * the value is *3.3*, the damage will be 4 with the chance of 30%.
         */
        damage?: number,
        /**
         * Durability of the tool, 33 is a default value
         * for golden tools and 1562 is a default value for diamond tools.
         */
        durability?: number,
        /**
         * Block breaking level, 1 is wooden instruments, 4 is diamond
         * instruments. If block's breaking level is less or equal to the tool's
         * level, block will be dropped when broken.
         */
        level?: number
    }
    /**
     * Object used to describe block material.
     */
    interface BlockMaterial {
        /**
         * Multiplier used to calculate block breaking speed.
         */
        multiplier: number,
        /**
         * Block material name.
         */
        name: string
    }
    /**
     * Object used to store all of the ToolAPI block data.
     */
    interface BlockData {
        /**
         * Material data used for this block.
         */
        material: BlockMaterial,
        /**
         * Digging level of the block. If digging level of tool is higher then
         * block's one, the block is dropped.
         */
        level: number,
        /**
         * Specifies whether the block was added as vanilla item or as a custom
         * block. `true`, if the block is vanilla, `false` if the block is custom.
         * Should not generally be changed.
         */
        readonly isNative: boolean
    }
    /**
     * Object containing additional parameters and functions used by Core Engine
     * to work with the tool
     */
    interface ToolParams {
        /**
         * Numeric ID of the item that replaces tool item when it's broken.
         * By default the tool disappears.
         * @default 0
         */
        brokenId?: number,
        /**
         * Base damage of the instrument, is added to the material damage to
         * calculate the tool's final damage.
         * @default 0
         */
        damage?: number,
		/**
		 * Properties of the tool material. Defined by {@link ToolAPI.registerTool},
		 */
		toolMaterial?: ToolMaterial,
		/**
		 * List of block material names that can be broken by this instrument.
		 * Defined by {@link ToolAPI.registerTool},
		 */
		blockMaterials?: { [key: string]: boolean }
        /**
         * Function used to recalculate block destroy time based on some custom
         * logic.
         */
        calcDestroyTime?: (
            /**
             * Tool item.
             */
            tool: ItemInstance,
            /**
             * Coordinates where the block is being broken.
             */
            coords: Callback.ItemUseCoordinates,
            /**
             * Block that is being broken.
             */
            block: Tile,
            /**
             * Some time properties that can be used to calculate
             * destroy time for the tool and block.
             */
            timeData: {
                /**
                 * Base destroy time of the block.
                 */
                base: number,
                /**
                 * Tool material devider.
                 */
                devider: number,
                /**
                 * Divider applied due to efficiency enchantment.
                 */
                modifier: number
            },
            /**
             * Default block destroy time, calculated as `base / divider / modifier`.
             */
            defaultTime: number,
            /**
             * Tool's enchant data.
             */
            enchantData?: EnchantData
        ) => number,
        /**
         * If `true`, the tool is vanilla Minecraft tool. Generally used within
         * Core Engine code and should not be used within mods until you really
         * know what you're doing.
         * @internal
         */
        isNative?: boolean,
        /**
         * Function that is called when the block is destroyed.
         * @returns `true` if default damage should not be applied to the instrument,
         * `false` otherwise.
         */
        onDestroy?: (
            /**
             * Tool item.
             */
            item: ItemInstance,
            /**
             * Coordinates where the block is destroyed.
             */
            coords: Callback.ItemUseCoordinates,
            /**
             * Block that is destroyed.
             */
            block: Tile,
            /**
             * Entity UID of the player that destroyed the block.
             */
            player: number
        ) => boolean,
        /**
         * Function that is called when players attacks some entity with the tool.
         * @returns `true` if default damage should not be applied to the instrument,
         * `false` otherwise.
         */
        onAttack?: (
            /**
             * Tool item.
             */
            item: ItemInstance,
            /**
             * Unique numeric ID of the entity that is attacked.
             */
            victim: number,
            /**
             * Entity UID of the player that attacked victim.
             */
            attacker: number
        ) => boolean,
        /**
         * If true, breaking blocks with this tool makes it break 2x faster,
         * otherwise attacking mobs breaks tool 2x faster.
         */
        isWeapon?: boolean,
        /**
         * Function that is called when the instrument is broken.
         * @returns `true` if default breaking behavior (replacing by `brokenId` item)
         * should not be applied.
         */
        onBroke?: (
            /**
             * Tool item.
             */
            item: ItemInstance
        ) => boolean,
        /**
         * Function that is used to change enchant data object before all the
         * calculations. Can be used to add some enchantment properties, such as
         * silk touch, efficiency, unbreaking or fortune.
         */
        modifyEnchant?: (
            /**
             * Tool's enchant data.
             */
            enchantData: EnchantData,
            /**
             * Tool item.
             */
            item: ItemInstance,
            /**
             * Coordinates where the block is being broken. Passed only if
             * the block is destroyed.
             */
            coords?: Callback.ItemUseCoordinates,
            /**
             * Destroyed block data. Passed only if the block is destroyed.
             */
            block?: Tile
        ) => void,
        /**
         * Function that is called when the block that has a destroy function is
         * destroyed.
         */
        onMineBlock?: (
            /**
             * Coordinates where the block is destroyed.
             */
            coords: Callback.ItemUseCoordinates,
            /**
             * An item in player's hand.
             */
            carried: ItemInstance,
            /**
             * Block that was destroyed.
             */
            fullTile: Tile,
            /**
             * {@link BlockSource} object of the world where the block was destroyed.
             */
            blockSource: BlockSource,
            /**
             * Entity UID of the player that destroyed the block.
             */
            player: number
        ) => void,
		/**
         * Any other user-defined methods and properties
         */
		[key: string]: any
    }
    /**
     * Object containing some of the enchants that are used to calculate block
     * destroy time.
     */
    interface EnchantData {
        /**
         * If `true`, the item has Silk Touch enchantment.
         */
        silk: boolean,
        /**
         * Specifies the level of Fortune enchantment, or `0` if the item doesn't
         * have this enchant.
         */
        fortune: number,
        /**
         * Specifies the level of Efficiency enchantment, or `0` if the item
         * doesn't have this enchant.
         */
        efficiency: number,
        /**
         * Specifies the level of Unbreaking enchantment, or `0` if the item
         * doesn't have this enchant.
         */
        unbreaking: number,
        /**
         * Specifies the amount of additional experience that is dropped when
         * player breaks block with specified item.
         */
        experience: number
    }
}
/**
 * TileEntity is a powerful mechanism that allows for creation of interactive blocks
 * such as chests, furnaces, etc.
 */
declare namespace TileEntity {
    /**
     * @internal
     */
    function resetEngine(): void;
    /**
     * Registers block as a TileEntity
     * @param blockID numeric block ID to be used
     * @param customPrototype a set of defining parameters
     * behavior
     */
    function registerPrototype(blockID: number, customPrototype: TileEntityPrototype): void;
    /**
     * @returns Prototype by it's numeric block ID.
     */
    function getPrototype(blockID: number): TileEntityPrototype;
    /**
     * @param blockID numeric block ID
     * @returns `true` if the specified numeric block ID is a {@link TileEntity}
     * block ID, `false` otherwise.
     */
    function isTileEntityBlock(blockID: number): boolean;
    /**
     * @internal
     */
    function createTileEntityForPrototype(prototype: TileEntityPrototype, addToUpdate?: boolean): TileEntity;
    /**
     * If the block on the specified coordinates is a TileEntity block and is
     * not initialized, initializes it and returns created {@link TileEntity} object.
     * @returns Tile if one was created, `null` otherwise.
     */
    function addTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;
    /**
     * Adding attached to block updatable, which is working like ordinary
     * tile entity, except the fact that it registers in any case.
     */
    function addUpdatableAsTileEntity(updatable: Updatable): void;
    /**
     * @returns A {@link TileEntity} on the specified coordinates or `null` if the block on the
     * coordinates is not it.
     */
    function getTileEntity(x: number, y: number, z: number, region?: BlockSource): Nullable<TileEntity>;
    /**
     * Destroys {@link TileEntity}, dropping it's container.
     * @returns `true` if the it was destroyed successfully, `false`
     * otherwise.
     */
    function destroyTileEntity(tileEntity: TileEntity, fromDestroyBlock?: boolean, isDropAllowed?: boolean): boolean;
    /**
     * If the block on the specified coordinates is a {@link TileEntity}, destroys
     * it, dropping it's container.
     * @returns `true` if the it was destroyed successfully, `false`
     * otherwise.
     */
    function destroyTileEntityAtCoords(x: number, y: number, z: number, region?: BlockSource): boolean;
    /**
     * Checks whether the {@link TileEntity} is in the loaded chunk or not.
     * @param tileEntity to be verified
     * @returns `true` if the chunk with TileEntity and some of the surrounding
     * chunks are loaded, `false` otherwise.
     * @remarks
     * The following chunks are verified:
     * ```text
     *  + +
     *   #
     *  + +
     * ```
     * Where "#" is the chunk containing the current TileEntity and "+" are
     * the chunks that are also verified.
     */
    function isTileEntityLoaded(tileEntity: TileEntity): boolean;
    /**
     * @internal
     */
    function checkTileEntityForIndex(index: number): void;
    /**
     * Interface passed to {@link TileEntity.registerPrototype} function.
     */
    interface TileEntityPrototype {
		/**
         * Use ItemContainer that supports multiplayer.
         */
        useNetworkItemContainer?: boolean;
        /**
         * Default data values, will be initially added to {@link TileEntity.data} field.
         */
        defaultValues?: Scriptable,
        /**
         * Called when a {@link TileEntity} is created.
         */
		created?: () => void,
		/**
         * Client TileEntity prototype copy.
         */
        client?: {
            /**
             * Called when the client copy is created.
             * @since 2.0.2b29
             */
            load?: () => void,
            /**
             * Called on destroying the client copy.
             * @since 2.0.2b29
             */
            unload?: () => void,
            /**
             * Called when every client ticking.
             * @since 2.0.2b29
             */
            onCheckerTick?: (isInitialized: boolean, isLoaded: boolean, wasLoaded: boolean) => void,
            /**
             * Called every tick on client thread.
             */
            tick?: () => void,
            /**
             * Events that receive packets on the client side.
             */
            events?: {
                /**
                 * Example of the client packet event function.
                 */
                [packetName: string]: (packetData: any, packetExtra: any) => void;
            },
            /**
             * Events of the container's client copy.
             */
            containerEvents?: {
                /**
                 * Example of the client container event function.
                 */
                [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
            }
            /**
              * Any other user-defined methods and properties.
              */
            [key: string]: any
        },
        /**
         * Events that receive packets on the server side.
         */
        events?: {
            /**
             * Example of the server packet event function.
             * 'this.sendResponse' method is only available here.
             */
            [packetName: string]: (packetData: any, packetExtra: any, connectedClient: NetworkClient) => void;
        },
        /**
         * Events of the container on the server side.
         */
        containerEvents?: {
            /**
             * Example of the server container event function.
             */
            [eventName: string]: (container: ItemContainer, window: UI.Window | UI.StandartWindow | UI.StandardWindow | UI.TabbedWindow | null, windowContent: UI.WindowContent | null, eventData: any) => void;
        }
        /**
         * Called when a {@link TileEntity} is initialised in the world.
         */
        init?: () => void,
        /**
         * Called every tick and should be used for all the updates of the {@link TileEntity}.
         */
        tick?: () => void,
        /**
         * Called when player uses some item on a {@link TileEntity}.
         * @returns `true` if the event is handled and should not be propagated to
         * the next handlers. Return `true` if you don't want the user interface
         * to be opened.
         */
        click?: (id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number, extra: ItemExtraData) => boolean | void,
        /**
         * Occurs when a block of the {@link TileEntity} is being destroyed. See
         * {@link Callback.DestroyBlockFunction} for details.
         */
        destroyBlock?: (coords: Callback.ItemUseCoordinates, player: number) => void,
        /**
         * Occurs when the {@link TileEntity} should handle redstone signal. See
         * {@link Callback.RedstoneSignalFunction} for details.
         */
        redstone?: (params: { power: number, signal: number, onLoad: boolean }) => void,
        /**
         * Occurs when a projectile entity hits the {@link TileEntity}. See
         * {@link Callback.ProjectileHitFunction} for details.
         */
        projectileHit?: (coords: Callback.ItemUseCoordinates, target: Callback.ProjectileHitTarget) => void,
        /**
         * Occurs when the {@link TileEntity} is being destroyed.
         * @returns `true` to prevent it.
         * {@link TileEntity} object from destroying (but if the block was destroyed, returning
         * true from this function doesn't replace the missing block with a new one)
         */
        destroy?: () => boolean | void;
        /**
         * Called to get the {@link UI.IWindow} object for the current {@link TileEntity}. The
         * window is then opened within {@link TileEntity.container} when the player clicks it.
		 * @deprecated Client method only.
         */
		getGuiScreen?: () => com.zhekasmirnov.innercore.api.mod.ui.window.IWindow;
		/**
         * Called on server side and returns UI name to open on click.
         */
        getScreenName?: (player: number, coords: Vector) => string;
        /**
         * Called on client side, returns the window to open.
         */
        getScreenByName?: (screenName?: string) => com.zhekasmirnov.innercore.api.mod.ui.window.IWindow;
        /**
         * Called when more liquid is required.
         */
        requireMoreLiquid?: (liquid: string, amount: number) => void;
        /**
         * Called when player connects to server.
         * @param client connected player client
         * @since 2.3.1b116-3
         */
        onConnectionPlayer?: (client: NetworkClient) => void;
        /**
         * Called when player disconnects from server.
         * @param client disconnected player client
         * @since 2.3.1b116-3
         */
        onDisconnectionPlayer?: (client: NetworkClient) => void;
        /**
         * Any other user-defined methods and properties.
         */
        [key: string]: any;
    }
}
declare interface TileEntity extends TileEntity.TileEntityPrototype {
    /**
     * X coord of the TileEntity in it's dimension.
     */
    readonly x: number,
    /**
     * Y coord of the TileEntity in it's dimension.
     */
    readonly y: number,
    /**
     * Z coord of the TileEntity in it's dimension.
     */
    readonly z: number,
    /**
     * Dimension where the TileEntity is located.
     */
    readonly dimension: number,
    /**
     * Block ID of TileEntity.
     */
    readonly blockID: number,
    /**
     * TileEntity data values object.
     */
    data: Scriptable,
    /**
     * TileEntity's item container.
     */
    container: ItemContainer | UI.Container,
    /**
     * TileEntity's liquid storage.
     */
    liquidStorage: LiquidRegistry.Storage,
    /**
     * `true` if TileEntity is loaded in the world.
     */
    isLoaded: boolean;
    /**
     * `true` if TileEntity was destroyed.
     */
    remove: boolean;
    /**
     * Destroys the TileEntity prototype.
     */
    selfDestroy: () => void;
    /**
     * Sends the packet from server to all clients.
     */
    sendPacket: (name: string, data: object) => void;
    /**
     * Sends packet to specified client.
     * @remarks
     * Availabled only in server-side methods!
     */
    sendResponse: (packetName: string, someData: object) => void;
    /**
     * BlockSource object to manipulate TileEntity's position in world.
     */
    blockSource: BlockSource;
    /**
     * SyncedNetworkData object of the TileEntity.
     */
    readonly networkData: SyncedNetworkData;
    /**
     * NetworkEntity object of the TileEntity.
     */
    readonly networkEntity: NetworkEntity;
}
/**
 * Module used to create and manipulate threads. Threads let you execute
 * time-consuming tasks without blocking current execution thread.
 */
declare namespace Threading {
    /**
     * Function used to format error messages in a custom way.
     * @internal
     */
    type ErrorMessageFormatFunction =
        /**
         * @param error java.lang.Throwable instance or javascript exception
         * @param priority current thread priority
         */
        (error: any, priority: number) => string;
    /**
     * Function used to create formatted error message with the full debug
     * information about exception in one of the threads.
     * @param error java.lang.Throwable instance or javascript exception
     * @param name thread name used to localize errors if there are any
     * @param priority current thread priority
     * @param formatFunc function that formats the exception itself
     * @internal
     */
    function formatFatalErrorMessage(error: any, name: string, priority: number, formatFunc: ErrorMessageFormatFunction): string;
    /**
     * Creates and runs new thread with specified function as a task.
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
     * @returns Instance representing created thread.
     */
    function initThread(name: string, func: () => void, priority?: number, isErrorFatal?: boolean, formatFunc?: ErrorMessageFormatFunction): java.lang.Thread;
    /**
     * Gets thread by it's name.
     * @param name name of the thread
     * @returns Instance representing the thread.
     */
    function getThread(name: string): Nullable<java.lang.Thread>;
    /**
     * Running threads, use {@link Threading.getThread} to directly
     * access required thread by name.
     * @internal
     */
    let threads: { [name: string]: java.lang.Thread };
}
/**
 * Class representing texture that can be animated.
 * @deprecated Represents deprecated render type, should
 * be performed in texture packs.
 */
declare class Texture {
    /**
     * Creates new {@link Texture} object using specified file path.
     */
    constructor(path: string);
    /**
     * Sets texture file path.
     * @returns Reference to itself to be used in sequential calls.
     */
    setTexture(path: string): Texture;
    /**
     * Specifies texture resolution. If not equal to file dimensions, the image
     * will be stretched to fit the resolution.
     * @returns Reference to itself to be used in sequential calls.
     */
    setResolution(w: number, h: number): Texture;
    /**
     * Makes texture animated.
     * @param animation array of paths to the animation frames. Each frame should
     * be stored in a separate file
     * @param delay specifies each frame delay in ticks
     * @returns Reference to itself to be used in sequential calls.
     */
    setAnimation(animation: string[], delay: number): Texture;
    /**
     * Resets animation.
     * @returns Reference to itself to be used in sequential calls.
     */
    resetAnimation(token: number): Texture;
    /**
     * @returns Current animation frame.
     */
    getTexture(token: number): string;
    /**
     * @returns Texture resolution after recalculating it with pixel scale.
     */
    getResolution(): { w: number, h: number };
    /**
     * Sets pixel scale for the texture.
     */
    setPixelScale(scale: number): Texture;
}
declare namespace SyncedNetworkData {
    /**
     * Server synced data validator and transformer, calls for every change.
     * **Warning!** Please do NOT send changes here, any changes will sent after verifying.
     * @param key key that was changed
     * @param value value for this key
     * @returns transformed value to set, `null` means no change will be performed
     */
    interface DataVerifierFunction {
        (key: string, value: object): Nullable<object>
    }
    /**
     * When data changes (no matter where, it will be applied on both client and server sides),
     * listener will be called with received or set synced data.
     * @param data instance of data, there is no way to listener be called from other ones
     * @param key key that was changed
     * @param isExternal is change was received from other side (server for client, client for server)
     */
    interface OnDataChangedListenerFunction {
        (data: SyncedNetworkData, key: string, isExternal: boolean): void
    }
}
/**
 * Class to work with values, synchronized between server and all clients.
 */
declare class SyncedNetworkData {
    /**
     * @returns Registered client synced data by name or null if it was not yet received.
     */
    static getClientSyncedData(name: string): Nullable<SyncedNetworkData>;
    /**
     * Constructs server network data by specified name, clients will receive
     * data via instance with same contructor.
     */
    constructor(name: string);
    /**
     * Constructs server network data with random uuid, name like SND<uuid> will
     * be applied (e.g., "SNDe58ed763-928c-4155-bee9-fdbaaadc15f3").
     */
    constructor();
    /**
     * @returns Requested value by key or null if key not found.
     */
    getObject(key: string): Nullable<java.lang.Object>;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getInt(key: string, fallback?: number): number;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getLong(key: string, fallback?: number): number;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getFloat(key: string, fallback?: number): number;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getDouble(key: string, fallback?: number): number;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getString(key: string, fallback?: string): string;
    /**
     * @returns Requested value by key or fallback if key not found.
     */
    getBoolean(key: string, fallback?: boolean): boolean;
    /**
     * Sets Object value by key.
     */
    putObject(key: string, value: java.lang.Object): void;
    /**
     * Sets Integer value by key.
     */
    putInt(key: any, value: number): void;
    /**
     * Sets Long value by key.
     */
    putLong(key: any, value: number): void;
    /**
     * Sets Float value by key.
     */
    putFloat(key: any, value: number): void;
    /**
     * Sets Double value by key.
     */
    putDouble(key: any, value: number): void;
    /**
     * Sets String value by key.
     */
    putString(key: any, value: string): void;
    /**
     * Sets Boolean value by key.
     */
    putBoolean(key: any, value: boolean): void;
    /**
     * @returns Name passed in constructor, which one will be used for packets.
     */
    getName(): string;
    /**
     * @returns `true` if it was server-side data that can be sent to clients.
     */
    isServer(): boolean;
    /**
     * @returns Connected client list, which receive this data.
     */
    getClients(): NetworkConnectedClientList;
    /**
     * Overrides connected client list, new one will automatically send server data.
     */
    setClients(clients: NetworkConnectedClientList): void;
    /**
     * Same as {@link SyncedNetworkData.sendChanges}.
     */
    apply(): void;
    /**
     * Sends changed data values.
     */
    sendChanges(): void;
    /**
     * Sends changed data values for specific client (dirty data remains).
     * @param client connected client to server
     * @since 2.3.1b116-3
     */
    sendChangesForClient(client: NetworkClient): void;
    /**
     * Adds event that catches changes of any data values on both sides.
     */
    addOnDataChangedListener(listener: SyncedNetworkData.OnDataChangedListenerFunction): void;
    /**
     * Removes data change event, that was registered by
     * {@link SyncedNetworkData.addOnDataChangedListener} before.
     */
    removeOnDataChangedListener(listener: SyncedNetworkData.OnDataChangedListenerFunction): void;
    /**
     * Removes all data change events, that was registered by
     * {@link SyncedNetworkData.addOnDataChangedListener} before.
     */
    removeAllListeners(): void;
    /**
     * Adds server-side data transformer received from client
     * to the object by specified key.
     */
    addVerifier(key: string, verifier: SyncedNetworkData.DataVerifierFunction): void;
    /**
     * Adds server-side data transformer received from client
     * that will be used if there is no verifier with specified key
     * registered via {@link SyncedNetworkData.addVerifier}.
     */
    setGlobalVerifier(verifier: SyncedNetworkData.DataVerifierFunction): void;
    /**
     * Global verifier that was set via {@link SyncedNetworkData.setGlobalVerifier}.
     */
    getGlobalVerifier(): SyncedNetworkData.DataVerifierFunction;
    /**
     * @returns Serialized object data which are in object.
     * @since 2.3.1b116-3
     */
    toJSON(): string;
    /**
     * Replaces existing data with those that are in given object.
     * @param json serialized object data
     * @since 2.3.1b116-3
     */
    fromJSON(json: string): void;
}
/**
 * @since 2.0.2b20
 */
declare class ShaderUniformSet {
    lock(): ShaderUniformSet;
    unlock(): ShaderUniformSet;
    setUniformValueArr(uniformSet: string, uniformName: string, value: number[]): ShaderUniformSet;
    setUniformValue(uniformSet: string, uniformName: string, ...value: number[]): ShaderUniformSet;
}
/**
 * Module used to save data between world sessions,
 * different worlds has their own saves.
 */
declare namespace Saver {
    /**
     * Creates saves scope, a universal data storage container. This storage
     * container should be used whenever you need to save some data between
     * world sessions. If you want to store primitives, use an object to wrap
     * them.
     * @param name saves scope name
     * @param load function used to load saved data
     * @param save function used to save data
     *
     * @example
     * ```js
     * let thirst = 20;
     * Saver.addSavesScope("thirst_library.thirst",
     *     function read(scope) {
     *         thirst = scope ? scope.thirst : 20;
     *     },
     *     function save() {
     *         return { thirst: thirst };
     *     }
     * );
     * ```
     */
    function addSavesScope(name: string, load: ScopeLoadFunction, save: ScopeSaveFunction): void;
    /**
     * Registers object as scope saver.
     * @param name saves scope name
     * @param saver object that implements {@link Saver.IScopeSaver}
     * interface and can be loaded and saved via it's functions calls
     */
    function registerScopeSaver(name: string, saver: IScopeSaver): void;
    /**
     * Registers object as object instance saver.
     * @param name saves scope name
     * @param saver object that implements {@link Saver.IObjectSaver}
     * interface and can be loaded and saved via it's functions calls
     * @returns Saver identifier of your object instance.
     *
     * @example
     * ```js
     * function PedestalTile(type) {
     *     this.type = type;
     *     Saver.registerObject(this, PedestalTile.saverId);
     * }
     * PedestalTile.saverId = Saver.registerObjectSaver("mystical_agriculture.pedestal", {
     *     read(obj) {
     *         return new PedestalTile(obj.type);
     *     },
     *     save(instance) {
     *         return { type: instance.type };
     *     }
     * });
     * ```
     */
    function registerObjectSaver(name: string, saver: IObjectSaver): number;
    /**
     * Registers object to be saved with a given saver
     * by identifier received from {@link Saver.registerObjectSaver}.
     * @param obj target object instance
     * @param saverId to be used on saving
     */
    function registerObject(obj: any, saverId: number): void;
    /**
     * Changes registered via {@link Saver.registerObject} instance
     * behavior to object be skippable or not.
     * @param obj target object instance
     * @param ignore should be skipped on saving
     */
    function setObjectIgnored(obj: any, ignore: boolean): void;
    /**
     * Converts present object hieracly via registered
     * {@link Saver.registerScopeSaver} and {@link Saver.registerObjectSaver}
     * instances recursively to serialized data.
     * @returns Serialized object hieracly transformed to string.
     */
    function serializeToString(obj: any): string;
    /**
     * Converts present object hieracly via registered
     * {@link Saver.registerScopeSaver} and {@link Saver.registerObjectSaver}
     * instances recursively to serialized data.
     * @returns Serialized object hieracly.
     */
    function serialize(obj: any): object;
    /**
     * Converts present transformed to string serialized object
     * via registered {@link Saver.registerScopeSaver} and
     * {@link Saver.registerObjectSaver} recursively to instance hieracly.
     * @returns Deserialized object instance hieracly.
     */
    function deserializeFromString(str: string): any;
    /**
     * Converts present serialized object via registered {@link Saver.registerScopeSaver}
     * and {@link Saver.registerObjectSaver} recursively to instance hieracly.
     * @returns Deserialized object instance hieracly.
     */
    function deserialize(obj: object): any;
    /**
     * Function that loads data from saves scope.
     */
    interface ScopeLoadFunction {
        /**
         * @param scope object data from saves
         */
        (scope: object): void
    }
    /**
     * Function used to save data.
     */
    interface ScopeSaveFunction {
        /**
         * @returns Object data to be serialized in saves scope.
         */
        (): Nullable<object>
    }
    /**
     * Function that returns default data to be passed
     * to {@link ScopeLoadFunction} if there is no previous data.
     * @since 2.3.1b116-3
     */
    interface DefaultSavesFunction {
        (): Nullable<object>
    }
    /**
     * Interface that should be implemented to pass object as
     * {@link Saver.registerScopeSaver} parameter.
     */
    interface IScopeSaver {
        /**
         * Function that loads data from saves scope.
         */
        read: ScopeLoadFunction,
        /**
         * Function used to save data.
         */
        save: ScopeSaveFunction,
        /**
         * Function that returns default data to be passed
         * to {@link read} if there is no previous data.
         * @since 2.3.1b116-3
         */
        getDefaultSaves?: DefaultSavesFunction
    }
    /**
     * Function that converts serialized data
     * from saves scope to your object instance.
     */
    interface ObjectLoadFunction {
        /**
         * @param obj object data from saves
         * @returns Instance of newly instantiated object.
         */
        (obj: object): any
    }
    /**
     * Function used to save serialized data of your object instance.
     */
    interface ObjectSaveFunction {
        /**
         * @param instance instance of your object to be saved
         * @returns Object data to be serialized in saves scope.
         */
        (instance: any): object
    }
    /**
     * Interface that should be implemented to pass object as
     * {@link Saver.registerObjectSaver} parameter.
     */
    interface IObjectSaver {
        /**
         * Function that converts serialized data
         * from saves scope to your object instance.
         */
        read: ObjectLoadFunction,
        /**
         * Function used to save serialized data of your object instance.
         */
        save: ObjectSaveFunction
    }
}
/**
 * @remarks
 * Availabled in preloader scripts only!
 */
declare namespace Resources {
	/**
	 * Creatings runtime pack, that will be removed on next
	 * launching game stage. Useful for both: client and server.
	 * @param typeStr one of: **resource** or **behavior**
	 * @param name generated pack name that additionaly hashes
	 * @returns Complete path to generated pack, it might be used
	 * to working with files and directories.
	 */
	function addRuntimePack(typeStr: string, name: string): string;
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 */
	function getAllResourceDirectories(): string[];
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 * @since 2.0.2b24
	 */
	function getAllResourceDirectoriesPaths(): string[];
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 */
	function searchFilesInDir(result: Array<string>, baseDir: java.io.File, file: java.io.File, regex: string): void;
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 */
	function getAllMatchingResourcesInDir(directory: Object, regex: string): string[];
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 */
	function getAllMatchingResourcesInPath(directory: Object, regex: string): string[];
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 * @since 2.0.2b24
	 */
	function getAllMatchingResources(regex: string): string[];
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 */
	function getResourcePathNoVariants(path: string): Nullable<java.io.File>;
	/**
	 * @remarks
	 * Availabled in preloader scripts only!
	 * @since 2.0.2b24
	 */
	function getResourcePath(path: string): Nullable<string>;
}
/**
 * Class representing a set of vertices with some other parameters required to
 * display them correctly. Used as block, entity and item models, in animations
 * and actually anywhere you need some physical shape.
 */
declare class RenderMesh extends com.zhekasmirnov.innercore.api.NativeRenderMesh {
    /**
     * Creates a new {@link RenderMesh} and initializes it from file.
     * See {@link com.zhekasmirnov.innercore.api.NativeRenderMesh.importFromFile importFromFile}
     * method description for parameters details.
     */
    constructor(path: string, type: string, params: Nullable<RenderMesh.ImportParams>);
    /**
     * Creates a new empty {@link RenderMesh}.
     */
    constructor();
}
declare namespace RenderMesh {
    type ImportParams = com.zhekasmirnov.innercore.api.NativeRenderMesh.ImportParams;
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
     * Creates a new Render instance with specified parameters.
     * @param parameters specifies all the
     * properties of the object. If it is a number, vanilla render ID is used,
     * if it is a string, used as {@link Render.RenderParameters.name RenderParameters.name} name property
     */
    constructor(parameters?: Render.RenderParameters | string | number);
    /**
     * @deprecated Use {@link Render.getId getId} instead.
     */
    getID(): number;
    /**
     * @deprecated Use {@link Render.getId getId} instead.
     */
    getRenderType(): number;
    /**
     * @returns Render identifier that can be used to set render to the mob, animation
     * or block.
     */
    getId(): number;
    /**
     * Specifies additional params for the following {@link Render}.
     * @param params specifies all the
     * properties of the object. If it is a number, vanilla render ID is used,
     * if it is a string, used as {@link Render.RenderParameters.name RenderParameters.name} name property
     */
    init(params?: Render.RenderParameters | string | number): void
    initModel(): void;
    checkChangeable(): void;
    rebuild(): void;
    /**
     * @returns Render's model that defines it's visual shape.
     */
    getModel(): Render.Model;
    /**
     * @returns Transform object used to manipulate current render.
     */
    transform(): Render.Transform;
    /**
     * @param partName full name of the part separated by "."
     * @returns A part of the render by it's full name. By default, there are six
     * parts available to the user. However, you can create your own parts that
     * suit your needs and get them by their names.
     */
    getPart(partName: string): Render.ModelPart;
    /**
     * Adds a part to the render by it's full name. The part should be descendent
     * of one of the six default parts, see {@link Render.ModelPart ModelPart} for details.
     * @param partName full name of the part separated by "."
     * @param partParams specifies all the parameters of the part
     * @returns Newly created part.
     */
    addPart(partName: string, partParams?: Render.PartParameters): Render.ModelPart;
    /**
     * Sets all the properties of the part by it's full name.
     * @param partName full name of the part separated by "."
     * @param partParams specifies all the parameters of the part
     */
    setPartParams(partName: string, partParams?: Render.PartParameters): void;
    /**
     * Sets the content and all properties of the part by it's full name.
     * @param name full name of the part separated by "."
     * @param data array of part data objects to be applied to the part
     * @param params specifies all the parameters of the part
     */
    setPart(name: string, data: Render.PartElement[], params: Render.PartParameters): void;
    /**
     * @internal
     */
    _setPartRecursive(part: Render.ModelPart, data: Render.PartElement[], coords: Vector): void;
    fromCache(data: Render.Cache): void;
    toCache(): Render.Cache;
    saveState(name: string, isLocal: boolean): void;
    loadState(name: string, isLocal: boolean): void;
    loadInitialState(name: string): void;
    saveToNext(name: string, isLocal: boolean): void;
    /**
     * @deprecated Does nothing, not required anymore.
     */
    setTextureResolution(...params: any): void;
}
/**
 * We're meant native renderer, it's not connected with
 * same class here.
 */
declare namespace Render {
    /**
     * An interface of the object that is used as {@link Render.constructor} parameter.
     * */
    interface RenderParameters {
        /**
         * Name of the cached Render object to be used.
         */
        name?: string;
        /**
         * Item ID for Item Sprite render type.
         */
        item?: number;
        /**
         * Relative path to the texture used by render,
         * e.g. `"textures/entity/zombie.png"`.
         */
        skin?: string;
        /**
         * Render scale multiplier.
         */
        scale?: number;
        /**
         * If set to true, a humanoid render is constructed, empty otherwise.
         */
        raw?: boolean;
    }
    /**
     * Part's box description specified in {@link Render.setPart} method.
     */
    interface PartElement {
        /**
         * Box coordinates, relative to part's coordinates.
         */
        coords: Vector,
        /**
         * Box texture offset.
         */
        uv?: { x: number, y: number },
        /**
         * Box size.
         * @param w additional size to be added from all the
         * six sizes of the box
         */
        size: { x: number, y: number, z: number, w?: number },
        /**
         * Specifies child elements, using current box coordinates
         * as base for the child boxes.
         */
        children?: PartElement[]
    }
    /**
     * Interface used to perform transformation on the specified render object.
     */
    interface Transform extends com.zhekasmirnov.innercore.api.NativeRenderer.Transform {
        /**
         * Scales the render along all the three axes. Applicable only to the
         * {@link Animation}'s transformations.
         * @returns Reference to itself to be used in sequential calls.
         * @deprecated Consider using {@link Render.Transform.scale Transform.scale} instead.
         */
        scaleLegacy(scale: number): Transform;
    }
    /**
     * An interface of the object that is used as {@link Render.addPart} parameter.
     */
    interface PartParameters {
        /**
         * If false or not specified in {@link Render.setPart} call, the part is
         * cleared, otherwise new parts and params are applied to the existing parts.
         */
        add?: boolean,
        /**
         * Texture width, use the real texture file width or change it to stretch
         * texture.
         */
        width?: number,
        /**
         * Texture height, use the real texture file height or change it to stretch
         * texture.
         */
        height?: number,
        /**
         * Texture horizontal offset from left up corner.
         */
        u?: number,
        /**
         * Texture vertical offset from left up corner.
         */
        v?: number,
        /**
         * Part center position.
         */
        pos?: Vector | [number, number, number];
        /**
         * Part rotation.
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
 * Module used to manipulate crafting recipes for vanilla and custom workbenches.
 */
declare namespace Recipes {
    /**
     * Adds new shaped crafting recipe.
     * @param result recipe result item
     * @param mask recipe shape, up to three string corresponding to the three
     * crafting field rows; each character means one item in the field
     * @param data an array explaining the meaning of each character within
     * mask. The array should contain three values for each symbol: the symbol
     * itself, item ID and item data.
     * @param func function to be called when the craft is processed
     * @param prefix recipe prefix. Use a non-empty values to register recipes
     * for custom workbenches
     *
     * @example
     * ```js
     * Recipes.addShaped({ id: 264, count: 1, data: 0 }, [
     *     "ax",
     *     "xa",
     *     "ax"
     * ], ['x', 265, 0, 'a', 266, 0]);
     * ```
     *
     * @remarks
     * Pickaxe recipe should look like this:
     * ```text
     * "+++"
     * " | "
     * " | "
     * ```
     * Do not use empty lines or line endings, if the recipe can be placed
     * within less then three rows or cols; e.g., to craft plates, you can
     * use a shape like this:
     * ```text
     * "--"
     * ```
     */
    function addShaped(result: ItemInstance, mask: string[], data: (string | number)[], func?: CraftingFunction, prefix?: string): WorkbenchShapedRecipe;
    /**
     * Same as {@link Recipes.addShaped}, but you can specify result as three
     * separate values corresponding to ID, count and data.
     */
    function addShaped2(id: number, count: number, aux: number, mask: string[], data: (string | number)[], func?: CraftingFunction, prefix?: string): WorkbenchShapedRecipe;
    /**
     * Adds new shapeless crafting recipe.
     * @param result recipe result item
     * @param data crafting ingredients, an array of objects representing item
     * ID and data
     * @param func function to be called when the craft is processed
     * @param prefix recipe prefix; use a non-empty values to register recipes
     * for custom workbenches
     *
     * @example
     * ```js
     * Recipes.addShapeless({ id: 264, count: 1, data: 0 }, [
     *     { id: 265, data: 0 }, { id: 265, data: 0 }, { id: 265, data: 0 },
     *     { id: 266, data: 0 }, { id: 266, data: 0 }, { id: 266, data: 0 }
     * ]);
     * ```
     */
    function addShapeless(result: ItemInstance, data: { id: number, data: number }[], func?: CraftingFunction, prefix?: string): WorkbenchShapelessRecipe;
    /**
     * Deletes recipe by it's result.
     * @param result recipe result
     */
    function deleteRecipe(result: ItemInstance): void;
    /**
     * Removes recipe by result ID, count and data.
     */
    function removeWorkbenchRecipe(id: number, count: number, data: number): void;
    /**
     * Gets all available recipes for the recipe result.
     * @returns Collection object containing {@link Recipes.WorkbenchRecipe}.
     */
    function getWorkbenchRecipesByResult(id: number, count: number, data: number): java.util.Collection<WorkbenchRecipe>;
    /**
     * Gets all available recipes containing an ingredient.
     * @returns Collection object containing {@link Recipes.WorkbenchRecipe}.
     */
    function getWorkbenchRecipesByIngredient(id: number, data: number): java.util.Collection<WorkbenchRecipe>;
    /**
     * Gets recipe by the field and prefix.
     * @param field {@link Recipes.WorkbenchField WorkbenchField} object containing crafting field
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     * @returns Recipe {@link Recipes.WorkbenchRecipe WorkbenchRecipe} instance, containing useful methods and
     * recipe information.
     */
    function getRecipeByField(field: WorkbenchField, prefix?: string): Nullable<WorkbenchRecipe>;
    /**
     * Gets recipe result item by the field and recipe prefix.
     * @param field {@link Recipes.WorkbenchField WorkbenchField} object containing crafting field
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     */
    function getRecipeResult(field: WorkbenchField, prefix?: string): Nullable<ItemInstance>;
    /**
     * Performs crafting by the field contents and recipe prefix.
     * @param field {@link Recipes.WorkbenchField WorkbenchField} object containing crafting field
     * information
     * @param prefix recipe prefix, defaults to empty string (vanilla workbench)
     */
    function provideRecipe(field: WorkbenchField, prefix?: string): Nullable<ItemInstance>;
    /**
     * Adds new furnace recipe.
     * @param sourceId source item ID
     * @param sourceData source item data
     * @param resultId resulting item ID
     * @param resultData resulting item data
     * @param prefix prefix, used to create recipes for non-vanilla furnaces
     */
    function addFurnace(sourceId: number, sourceData: number, resultId: number, resultData: number, prefix?: string): void;
    /**
     * Adds new furnace recipe with no need to manually specify input item data
     * (it defaults to -1).
     * @param sourceId source item ID
     * @param resultId result item ID
     * @param resultData resulting item data
     * @param prefix prefix, used to create recipes for non-vanilla furnaces; if
     * the prefix is not empty and some recipes for this source exist for
     * vanilla furnace, they are removed
     */
    function addFurnace(sourceId: number, resultId: number, resultData: number, prefix?: string): void
    /**
     * Removes furnace recipes by source item.
     * @param sourceId source item ID
     * @param sourceData source item data
     */
    function removeFurnaceRecipe(sourceId: number, sourceData: number): void;
    /**
     * Adds fuel that can be used in the furnace.
     * @param id fuel item ID
     * @param data fuel item data
     * @param time burning time in ticks
     */
    function addFurnaceFuel(id: number, data: number, time: number): void;
    /**
     * Removes furnace fuel by fuel item ID and data.
     */
    function removeFurnaceFuel(id: number, data: number): void;
    /**
     * @param prefix recipe prefix used for non-vanilla furnaces
     * @returns Furnace recipe resulting item.
     */
    function getFurnaceRecipeResult(id: number, data: number, prefix?: string): ItemInstance;
    /**
     * @returns Fuel burn duration by fuel item ID and data.
     */
    function getFuelBurnDuration(id: number, data: number): number;
    /**
     * Gets furnace recipes by result and custom prefix.
     * @param resultId result item ID
     * @param resultData result item data
     * @param prefix recipe prefix used for non-vanilla furnaces
     * @returns Collection object with all furnace recipes found by given params.
     */
    function getFurnaceRecipesByResult(resultId: number, resultData: number, prefix: string): java.util.Collection<FurnaceRecipe>;
    /**
     * @returns Collection object with all registered workbench recipes.
     */
    function getAllWorkbenchRecipes(): java.util.Collection<WorkbenchRecipe>;
    /**
     * @returns Collection object with all registered furnace recipes.
     */
    function getAllFurnaceRecipes(): java.util.Collection<FurnaceRecipe>;
    /**
     * Class used to simplify creation of custom workbenches.
     */
    class WorkbenchUIHandler {
        /**
         * Constructs a new Workbench UI handler.
         * @param target target {@link com.zhekasmirnov.innercore.api.mod.ui.window.WindowContent.elements WindowContent.elements} section
         * @param targetCon target container
         * @param field workbench field
         */
        constructor(target: UI.ElementSet, targetCon: UI.Container, field: WorkbenchField);
        /**
         * Sets custom workbench prefix.
         * @param prefix custom workbench prefix
         */
        setPrefix(prefix: string): void;
        /**
         * Refreshes all the recipes in the workbench.
         * @returns Amount of recipes displayed.
         */
        refresh(): number;
        /**
         * Runs recipes refresh in the ticking thread delaying refresh process
         * for a tick. To get recipes count use {@link Recipes.WorkbenchUIHandler.setOnRefreshListener WorkbenchUIHandler.setOnRefreshListener}.
         */
        refreshAsync(): void;
        /**
         * Registers listener to be notified when some recipe is selected.
         * @param listener recipe selection listener
         */
        setOnSelectionListener(listener: { onRecipeSelected: (recipe: WorkbenchRecipe) => void }): void;
        /**
         * Registers listener to be notified when the workbench starts and
         * completes refreshing.
         * @param listener workbench refresh listener
         */
        setOnRefreshListener(listener: { onRefreshCompleted: (count: number) => void, onRefreshStarted: () => void }): void;
        /**
         * Deselects current recipe (asynchronously).
         */
        deselectCurrentRecipe(): void;
        /**
         * Sets workbench recipes displaying limit.
         * @param count count of the recipes to show
         * @default 250
         */
        setMaximumRecipesToShow(count: number): void;
    }
    /**
     * Object representing workbench recipe.
     */
    interface WorkbenchRecipe extends java.lang.Object {
        /**
         * @returns `true`, if the recipe is valid, `false` otherwise.
         */
        isValid(): boolean;
        /**
         * @param c recipe entry character
         * @returns Recipe entry by entry character.
         */
        getEntry(c: string): RecipeEntry;
        /**
         * @returns Resulting item instance.
         */
        getResult(): ItemInstance;
        /**
         * @returns `true` if specified item is recipe's result, `false` otherwise.
         */
        isMatchingResult(id: number, count: number, data: number): boolean;
        /**
         * @returns Recipe unique mask identifier.
         */
        getRecipeMask(): string;
        /**
         * @param field workbench field to compare with
         * @returns `true` if the field contains this recipe, false` otherwise.
         */
        isMatchingField(field: WorkbenchField): boolean;
        /**
         * @returns All recipe's entries in a java array.
         */
        getSortedEntries(): native.Array<RecipeEntry>;
        /**
         * Tries to fill workbench field with current recipe.
         * @param field workbench field to fill
         */
        putIntoTheField(field: WorkbenchField): void;
        /**
         * @returns Recipe prefix.
         * @default ""
         */
        getPrefix(): string;
        /**
         * Sets prefix value for the recipe.
         * @param prefix new prefix value
         */
        setPrefix(prefix: string): void;
        /**
         * Compares current recipe's prefix with given one.
         * @param prefix prefix value to compare with
         * @returns `true`, if current recipe's prefix is the same as given one,
         * `false` otherwise.
         */
        isMatchingPrefix(prefix: string): boolean;
        /**
         * Sets craft function for the recipe.
         * @param callback function to be called on item craft
         */
        setCallback(callback: CraftingFunction): void;
        /**
         * @returns Current crafting function or null if no one was specified.
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
         * @returns Reference to itself to be used in sequential calls.
         */
        setVanilla(isVanilla: boolean): WorkbenchRecipe;
    }
    /**
     * Object representing workbench shaped recipe.
     */
    interface WorkbenchShapedRecipe extends WorkbenchRecipe {
        addVariants(variants: java.util.ArrayList<WorkbenchRecipe>): void;
        setPattern(pattern: string[]): void;
        setPattern(pattern: RecipeEntry[][]): void;
    }
    /**
     * Object representing workbench shapeless recipe.
     */
    interface WorkbenchShapelessRecipe extends WorkbenchRecipe {
        addVariants(variants: java.util.ArrayList<WorkbenchRecipe>): void;
    }
    /**
     * Object representing furnace recipe.
     */
    interface FurnaceRecipe extends java.lang.Object {
        readonly inData: number;
        readonly inId: number;
        readonly resData: number;
        readonly resId: number;
        /**
         * @returns `true`, if the recipe is valid, `false` otherwise.
         */
        isValid(): boolean;
        /**
         * @returns Resulting item instance.
         */
        getResult(): ItemInstance;
        /**
         * @returns Recipe prefix.
         * @default ""
         */
        getPrefix(): string;
        /**
         * Sets prefix value for the recipe.
         * @param prefix new prefix value
         */
        setPrefix(prefix: string): void;
        /**
         * Compares current recipe's prefix with given one.
         * @param prefix prefix value to compare with
         * @returns `true`, if current recipe's prefix is the same as given one,
         * `false` otherwise.
         */
        isMatchingPrefix(prefix: string): boolean;
        getInputKey(): number;
    }
    /**
     * Function called when the craft is in progress.
     * @param api object used to perform simple recipe manipulations and to prevent
     * crafting
     * @param field array containing all slots of the crafting field
     * @param result recipe result item instance
     */
    interface CraftingFunction {
        (api: WorkbenchFieldAPI, field: com.zhekasmirnov.innercore.api.mod.ui.container.Slot[], result: ItemInstance, player: number): void
    }
    /**
     * Object representing workbench field.
     */
    interface WorkbenchField {
        /**
         * @param slot slot index
         * @returns Workbench slot instance by slot index.
         */
        getFieldSlot(slot: number): com.zhekasmirnov.innercore.api.mod.ui.container.Slot,
        /**
         * @returns JS array of all slots.
         */
        asScriptableField(): com.zhekasmirnov.innercore.api.mod.ui.container.Slot[]
    }
    /**
     * Object used to work with workbench field in the craft function.
     */
    interface WorkbenchFieldAPI {
        /**
         * @param slot slot index
         * @returns Workbench slot instance by slot index.
         */
        getFieldSlot(slot: number): com.zhekasmirnov.innercore.api.mod.ui.container.Slot;
        /**
         * Decreases item count in the specified slot, if possible.
         * @param slot slot index
         */
        decreaseFieldSlot(slot: number): void;
        /**
         * Prevents crafting event.
         */
        prevent(): void;
        /**
         * @returns `true`, if crafting event was prevented, `false` otherwise.
         */
        isPrevented(): boolean;
    }
    /**
     * Crafting recipe entry.
     */
    interface RecipeEntry extends java.lang.Object {
        /**
         * @param slot slot to compare with
         * @returns `true` if recipe entry matches the slot.
         */
        isMatching(slot: com.zhekasmirnov.innercore.api.mod.ui.container.Slot): boolean;
        /**
         * @param entry entry to compare with
         * @returns `true` if recipe entry matches another entry.
         */
        isMatching(entry: RecipeEntry): boolean;
    }
}
/**
 * Class to manipulate with separate players.
 * @remarks
 * It is temporary! Most methods works only 1 server tick!
 */
declare class PlayerActor {
    constructor(playerUid: number);
    /**
     * @returns Player's unique numeric entity ID.
     */
    getUid(): number;
    /**
     * @returns ID of dimension where player is.
     */
    getDimension(): number;
    /**
     * @returns Player's gamemode.
     */
    getGameMode(): number;
    /**
     * Adds item to player's inventory.
     * @param dropRemaining if true, surplus will be dropped near player
     */
    addItemToInventory(id: number, count: number, data: number, extra: ItemExtraData | null, dropRemaining: boolean): void;
    /**
     * @returns Inventory slot's contents.
     */
    getInventorySlot(slot: number): ItemInstance;
    /**
     * Sets inventory slot's contents.
     */
    setInventorySlot(slot: number, id: number, count: number, data: number, extra: ItemExtraData | null): void;
    /**
     * @returns Armor slot's contents.
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
     * @returns Whether the player is a valid entity.
     */
    isValid(): boolean;
    /**
     * @returns Player's selected slot.
     */
    getSelectedSlot(): number;
    /**
     * Sets player's selected slot.
     */
    setSelectedSlot(slot: number): void;
    /**
     * @returns Player's experience.
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
     * @returns Player's xp level.
     */
    getLevel(): number;
    /**
     * Sets player's xp level.
     */
    setLevel(level: number): void;
    /**
     * @returns Player's exhaustion.
     */
    getExhaustion(): number;
    /**
     * Sets player's exhaustion.
     */
    setExhaustion(value: number): void;
    /**
     * @returns Player's hunger.
     */
    getHunger(): number;
    /**
     * Sets player's hunger.
     */
    setHunger(value: number): void;
    /**
     * @returns Player's saturation.
     */
    getSaturation(): number;
    /**
     * Sets player's saturation.
     */
    setSaturation(value: number): void;
    /**
     * @returns Player's score.
     */
    getScore(): number;
    /**
     * Sets player's score.
     */
    setScore(value: number): void;
    /**
     * @since 2.2.1b100
     */
    getItemUseDuration(): number;
    /**
     * @since 2.2.1b100
     */
    getItemUseIntervalProgress(): number;
    /**
     * @since 2.2.1b100
     */
    getItemUseStartupProgress(): number;
    /**
     * @returns `true` if player has operator permissions
     * @since 2.3.1b116
     */
    isOperator(): boolean;
    /**
     * Sets some of the player's abilities.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @param value the value to be set for the ability
     * @remarks
     * Server-side analogue of {@link Player.setAbility}.
     * @since 2.3.1b116
     */
    setPlayerBooleanAbility(ability: string, value: boolean): void;
    /**
     * Sets some of the player's abilities.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @param value the value to be set for the ability
     * @remarks
     * Server-side analogue of {@link Player.setAbility}.
     * @since 2.3.1b116
     */
    setPlayerFloatAbility(ability: string, value: number): void;
    /**
     * Gets one of the player's abilities in a boolean form.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @returns Current value of the ability in a boolean form.
     * @remarks
     * Server-side analogue of {@link Player.getBooleanAbility}.
     * @since 2.3.1b116
     */
    getPlayerBooleanAbility(ability: string): boolean;
    /**
     * Gets one of the player's abilities in a form
     * of floating-point number.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @returns Current value of the ability in a form
     * of floating-point number.
     * @remarks
     * Server-side analogue of {@link Player.getFloatAbility}.
     * @since 2.3.1b116
     */
    getPlayerFloatAbility(ability: string): number;
    /**
     * @returns `true` if player is allowed to fly, `false` otherwise.
     * @since 2.3.1b116
     * @remarks
     * Server-side analogue of {@link Player.getFlyingEnabled}.
     */
    canFly(): boolean;
    /**
     * Enables or disables player's ability to fly.
     * @param enabled whether the player can fly or not
     * @since 2.3.1b116
     * @remarks
     * Server-side analogue of {@link Player.setFlyingEnabled}.
     */
    setCanFly(enabled: boolean): void;
    /**
     * @returns `true` if player is flying, `false` otherwise.
     * @since 2.3.1b116
     * @remarks
     * Server-side analogue of {@link Player.getFlying}.
     */
    isFlying(): boolean;
    /**
     * Changes player's current flying state, call {@link PlayerActor.setCanFly}
     * to be able to set this property to `true`.
     * @param enabled whether the player should fly or not
     * @since 2.3.1b116
     * @remarks
     * Server-side analogue of {@link Player.setFlying}.
     */
    setFlying(enabled: boolean): void;
}
/**
 * Module used to manipulate player. Player is also an entity in Minecraft, so
 * you can use all the functions from {@link Entity} module as well. To get player's
 * entity ID, call {@link Player.get} function.
 */
declare namespace Player {
    /**
     * @returns Player's entity ID that can be used with most of {@link Entity}
     * function.
     */
    function get(): number;
    /**
     * @deprecated Use attributes and {@link Entity.getNameTag} instead.
     */
    function getNameForEnt(entityUid: number): string;
    /**
     * @deprecated Use attributes and {@link Entity.getNameTag} instead.
     */
    function getName(): void;
    /**
     * @returns Current dimension numeric ID, one of the {@link EDimension}
     * values or custom dimension ID.
     */
    function getDimension(): number;
    /**
     * @returns `true` if specified entity is of player type, `false` otherwise.
     */
    function isPlayer(entityUid: number): boolean;
    /**
     * Fetches information about the objects player is currently pointing.
     */
    function getPointed(): {
        /**
         * Pointed block position.
         */
        pos: BlockPosition,
        /**
         * Look vector.
         */
        vec: Vector,
        /**
         * Pointed block data, if player doesn't look at the block,
         * air block is returned.
         */
        block: Tile,
        /**
         * Pointed entity, if no entity's pointed, returns -1.
         */
        entity: number
    };
    /**
     * Simulates local player rotation by specified delta.
     * @param deltaX horizontal radians offset
     * @param deltaY vertical radians offset
     * @since 2.4.0b120 (implemented in 2.3.1b116)
     */
    function localPlayerTurn(deltaX: number, deltaY: number): void;
    /**
     * @deprecated Consider use {@link Player.getInventorySlot} instead.
     */
    function getInventory(loadPart: any, handleEnchant: any, handleNames: any): void;
    /**
     * Adds items to player's inventory, stacking them if possible.
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     * @param preventDrop if set to false, function drops items that could not be
     * added to player's inventory, destroys them otherwise
     */
    function addItemToInventory(id: number, count: number, data: number, extra?: ItemExtraData, preventDrop?: boolean): void;
    /**
     * @returns Item in player's hand.
     */
    function getCarriedItem(): ItemInstance;
    /**
     * Sets item in player's hand.
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setCarriedItem(id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns Player's current offhand item information.
     */
    function getOffhandItem(): ItemInstance;
    /**
     * Sets current offhand item for the player.
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setOffhandItem(id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Decreases carried item count by specified number.
     * @param count amount of items to decrease carried item by, default value
     * is 1
     */
    function decreaseCarriedItem(count?: number): void;
    /**
     * @param slot slot ID, from 0 to 36
     * @returns Information about item in the specified inventory slot.
     */
    function getInventorySlot(slot: number): ItemInstance;
    /**
     * Sets contents of the specified inventory slot.
     * @param slot slot ID, from 0 to 36
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setInventorySlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @param slot armor slot ID, should be one of the {@link EArmorType}
     * values.
     * @returns Information about item in the specified armor slot.
     */
    function getArmorSlot(slot: number): ItemInstance;
    /**
     * Sets contents of the specified armor slot.
     * @param slot armor slot ID, should be one of the {@link EArmorType}
     * values
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setArmorSlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns Currently selected inventory slot, from 0 to 8.
     */
    function getSelectedSlotId(): number;
    /**
     * Selects currently selected inventory slot.
     * @param slot slot ID to be selected, from 0 to 8
     */
    function setSelectedSlotId(slot: number): void;
    /**
     * Sets specified coordinates as player's position.
     */
    function setPosition(x: number, y: number, z: number): void;
    /**
     * @returns Current player's position.
     */
    function getPosition(): Vector;
    /**
     * Changes current player position by specified vector.
     */
    function addPosition(x: number, y: number, z: number): void;
    /**
     * Set player's velocity using velocity vector.
     * @param x velocity
     * @param y velocity
     * @param z velocity
     */
    function setVelocity(x: number, y: number, z: number): void;
    /**
     * Get player's velocity.
     * @returns Currently {@link Vector} containing player's velocity.
     */
    function getVelocity(): Vector;
    /**
     * Updates current entity's velocity by specified values.
     */
    function addVelocity(x: number, y: number, z: number): void;
    /**
     * @returns An object that allows to manipulate player experience.
     * @deprecated Consider using {@link Player.getExperience},
     * {@link Player.setExperience}, {@link Player.addExperience}.
     */
    function experience(): PlayerExperience;
    /**
     * @returns Player's current experience.
     */
    function getExperience(): number;
    /**
     * Sets player's experience.
     * @param exp experience value to be set
     */
    function setExperience(exp: number): void;
    /**
     * Adds specified amount of experience to the current value.
     * @param exp amount to be added
     */
    function addExperience(exp: number): void;
    /**
     * @returns An object that allows to manipulate player level.
     * @deprecated Consider using {@link Player.getLevel},
     * {@link Player.setLevel}, {@link Player.addLevel}.
     */
    function level(): PlayerLevel;
    /**
     * @returns Player's current level.
     */
    function getLevel(): number;
    /**
     * Sets player's level.
     * @param level level value to be set
     */
    function setLevel(level: number): void;
    /**
     * Adds specified amount of level to the current value.
     * @param level amount to be added
     */
    function addLevel(level: number): void;
    /**
     * @returns An object that allows to manipulate player flying ability and
     * state.
     * @deprecated Consider using {@link Player.getFlyingEnabled},
     * {@link Player.setFlyingEnabled}, {@link Player.getFlying}, {@link Player.setFlying}.
     */
    function flying(): PlayerFlying;
    /**
     * @returns `true` if player is allowed to fly, `false` otherwise.
     */
    function getFlyingEnabled(): boolean;
    /**
     * Enables or disables player's ability to fly.
     * @param enabled whether the player can fly or not
     */
    function setFlyingEnabled(enabled: boolean): void;
    /**
     * @returns `true` if player is flying, `false` otherwise.
     */
    function getFlying(): boolean;
    /**
     * Changes player's current flying state, call {@link Player.setFlyingEnabled}
     * to be able to set this property to `true`.
     * @param enabled whether the player should fly or not
     */
    function setFlying(enabled: boolean): void;
    /**
     * @returns An object that allows to manipulate player's exhaustion.
     * @deprecated Consider using {@link Player.getExhaustion} and
     * {@link Player.setExhaustion}.
     */
    function exhaustion(): PlayerExhaustion;
    /**
     * @returns Player's current exhaustion.
     */
    function getExhaustion(): number;
    /**
     * Sets player's exhaustion.
     * @param value exhaustion value to be set
     */
    function setExhaustion(value: number): void;
    /**
     * @returns An object that allows to manipulate player's exhaustion.
     * @deprecated Consider using {@link Player.getHunger} and
     * {@link Player.setHunger}.
     */
    function hunger(): PlayerHunger;
    /**
     * @returns Player's current hunger.
     */
    function getHunger(): number;
    /**
     * Sets player's hunger.
     * @param value hunger value to be set
     */
    function setHunger(value: number): void;
    /**
     * @returns An object that allows to manipulate player's saturation.
     * @deprecated Consider using {@link Player.getSaturation} and
     * {@link Player.setSaturation}.
     */
    function saturation(): PlayerSaturation;
    /**
     * @returns Player's current saturation.
     */
    function getSaturation(): number;
    /**
     * Sets player's saturation.
     * @param value saturation value to be set
     */
    function setSaturation(value: number): void;
    /**
     * @returns An object that allows to manipulate player's health.
     * @deprecated Consider using {@link Player.getHealth} and
     * {@link Player.setHealth}.
     */
    function health(): PlayerHealth;
    /**
     * @returns Player's current health.
     */
    function getHealth(): number;
    /**
     * Sets player's health.
     * @param value Health value to be set.
     */
    function setHealth(value: number): void;
    /**
     * @returns An object that allows to manipulate player's score.
     * @deprecated Consider using {@link Player.getScore}.
     */
    function score(): PlayerScore;
    /**
     * @returns Player's current score.
     */
    function getScore(): number;
    /**
     * Sets view zoom, to reset value call {@link Player.resetFov}.
     * @param fov view zoom, default zoom is about 70
     */
    function setFov(fov: number): void;
    /**
     * Resets view zoom to the default value.
     */
    function resetFov(): void;
    /**
     * Sets player's camera to the specified entity.
     * @param entityUid entity ID
     */
    function setCameraEntity(entityUid: number): void;
    /**
     * Resets player's camera if it was previously set to another entity.
     */
    function resetCameraEntity(): void;
    /**
     * Sets some of the player's abilities. If the argument is of type
     * boolean, sets the ability as the boolean one, otherwise as numeric one.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @param value the value to be set for the ability; can be either boolean
     * or number, depending on the ability
     * @since 2.0.3b33
     */
    function setAbility(ability: string, value: boolean | number): void;
    /**
     * Gets one of the player's abilities in a form
     * of floating-point number.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @returns Current value of the ability in a form
     * of floating-point number.
     * @since 2.0.3b33
     */
    function getFloatAbility(ability: string): number;
    /**
     * Gets one of the player's abilities in a boolean form.
     * @param ability ability name constant, should be
     * one of the {@link EPlayerAbility} constants
     * @returns Current value of the ability in a boolean form.
     * @since 2.0.3b33
     */
    function getBooleanAbility(ability: string): number;
    /**
     * Class used to manipulate player's experience.
     * @deprecated Consider using {@link Player.getExperience},
     * {@link Player.setExperience}, {@link Player.addExperience}.
     */
    class PlayerExperience {
        /**
         * @returns Player's current experience.
         */
        public get(): number;
        /**
         * Sets player's experience.
         * @param exp experience value to be set
         */
        public set(exp: number): void;
        /**
         * Adds specified amount of experience to the current value.
         * @param exp amount to be added
         */
        public add(exp: number): void;
    }
    /**
     * Class used to manipulate player's level.
     * @deprecated Consider using {@link Player.getLevel},
     * {@link Player.setLevel}, {@link Player.addLevel}.
     */
    class PlayerLevel {
        /**
         * @returns Player's current level.
         */
        public get(): number;
        /**
         * Sets player's level.
         * @param level level value to be set
         */
        public set(level: number): void;
        /**
         * Adds specified amount of level to the current value.
         * @param level amount to be added
         */
        public add(level: number): void;
    }
    /**
     * Class used to manipulate player's flying ability and state.
     * @deprecated Consider using {@link Player.getFlyingEnabled},
     * {@link Player.setFlyingEnabled}, {@link Player.getFlying}
     * and {@link Player.setFlying}.
     */
    class PlayerFlying {
        /**
         * @returns `true` if player is flying, `false` otherwise.
         */
        public get(): boolean;
        /**
         * Changes player's current flying state, call {@link Player.PlayerFlying.setEnabled}
         * to be able to set this property to `true`.
         * @param enabled whether the player should fly or not
         */
        public set(enabled: boolean): void;
        /**
         * @returns `true` if player is allowed to fly, `false` otherwise.
         */
        public getEnabled(): boolean;
        /**
         * Enables or disables player's ability to fly.
         * @param enabled whether the player can fly or not
         */
        public setEnabled(enabled: boolean): void;
    }
    /**
     * Class used to manipulate player's exhaustion.
     * @deprecated Consider using {@link Player.getExhaustion} and
     * {@link Player.setExhaustion}.
     */
    class PlayerExhaustion {
        /**
         * @returns Player's current exhaustion.
         */
        public get(): number;
        /**
         * Sets player's exhaustion.
         * @param value exhaustion value to be set
         */
        public set(value: number): void;
    }
    /**
     * Class used to manipulate player's hunger.
     * @deprecated Consider using {@link Player.getHunger} and
     * {@link Player.setHunger}.
     */
    class PlayerHunger {
        /**
         * @returns Player's current hunger.
         */
        public get(): number;
        /**
         * Sets player's hunger.
         * @param value hunger value to be set
         */
        public set(value: number): void;
    }
    /**
     * Class used to manipulate player's saturation.
     * @deprecated Consider using {@link Player.getSaturation} and
     * {@link Player.setSaturation}.
     */
    class PlayerSaturation {
        /**
         * @returns Player's current saturation.
         */
        public get(): number;
        /**
         * Sets player's saturation.
         * @param value saturation value to be set
         */
        public set(value: number): void;
    }
    /**
     * Class used to manipulate player's health.
     * @deprecated Consider using {@link Player.getHealth} and
     * {@link Player.setHealth}.
     */
    class PlayerHealth {
        /**
         * @returns Player's current health.
         */
        public get(): number;
        /**
         * Sets player's health.
         * @param value health value to be set
         */
        public set(value: number): void;
    }
    /**
     * Class used to manipulate player's score.
     * @deprecated Consider using {@link Player.getScore}.
     */
    class PlayerScore {
        /**
         * @returns Player's current score.
         */
        public get(): number;
    }
}
/**
 * Module to work with vanilla and custom particles.
 */
declare namespace Particles {
    /**
     * Custom particle's animator params object.
     */
    interface IAnimatorDescription {
        /**
         * Animator's period in ticks, if it's less than zero or not listed,
         * it'll be particle's lifetime.
         */
         period?: number;
         /**
          * Appearance moment in the proportions of the period.
          * @default 0
          */
         fadeIn?: number;
         /**
          * Disappearance moment in the proportions of the period.
          * @default 0
          */
         fadeOut?: number;
    }
    /**
     * {@inheritDoc Particles.IAnimatorDescription}
     */
    interface AnimatorDescription extends IAnimatorDescription {
        /**
         * Initial value.
         * @default 0
         */
        start?: number;
        /**
         * Ending value.
         * @default 0
         */
        end?: number;
    }
    /**
     * {@inheritDoc Particles.IAnimatorDescription}
     */
    interface ColorAnimatorDescription extends IAnimatorDescription {
        /**
         * Initial value.
         * @default [1, 1, 1, 1]
         */
        start?: [number, number, number, number];
        /**
         * Ending value.
         * @default [1, 1, 1, 1]
         */
         end?: [number, number, number, number];
    }
    /**
     * Custom particle's sub-emitter params object.
     */
    interface SubEmitterDescription {
        /**
         * Emitted particle's type numeric ID.
         */
        type: number;
        /**
         * Additional data of the emitted particle.
         * @default 0
         */
        data?: number;
        /**
         * Triggering float chance from 0 to 1.
         * @default 1
         */
        chance?: number;
        /**
         * Particles count for the single emit time.
         * @default 1
         */
        count?: number;
        /**
         * If `true`, the new particle will have the velocity of the particle,
         * that calls the sub-emitter, at the time of invocation.
         * @default false
         */
        keepVelocity?: boolean;
        /**
         * If true, the new particle will save the emitter that was used for it's creation if it had been.
         * @remarks
         * In this case we are talking about emitters, not about sub-emitters.
         */
        keepEmitter?: boolean;
        /**
         * If this value is listed, emitted particles will receive random initial speed,
         * that isn't more than `value * sqrt(3)`.
         */
        randomize?: number;
    }
    /**
     * Custom particle type params object.
     */
    interface ParticleDescription {
        /**
         * Particle's texture name from *\/particle-atlas* resource directory.
         */
        texture: string;
        /**
         * Minimum and maximum size of the particle.
         */
        size: [number, number];
        /**
         * Minimum and maximum particle's lifetime in ticks.
         */
        lifetime: [number, number];
        /**
         * Particle's render type:
         * + 0 - additive
         * + 1 - without blending
         * + 2 - with blending
         */
        render?: number;
        /**
         * Four component color of the particle (RGBA).
         * @default [1, 1, 1, 1]
         */
        color?: [number, number, number, number];
        /**
         * @since 2.0.4b38
         */
        color2?: [number, number, number, number];
        /**
         * If `true`, particle won't go through blocks. It reduces performance if
         * there are lots of these particles.
         * @default false.
         */
        collision?: boolean;
        /**
         * Particle's initial velocity, if it's spawned without initial speed parameter.
         * @default [0, 0, 0]
         */
        velocity?: [number, number, number];
        /**
         * Particle's acceleration, if it's spawned without this parameter.
         * @default [0, 0, 0]
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
             * @remarks
             * This value makes sense only if collision param is `true`.
             */
            block?: number;
        }
        /**
         * If `false`, particle's speed will be set to zero when touching a block.
         * If `true`, the speed will be saved.
         * @remarks
         * This value makes sense only if collision param is `true`.
         */
        keepVelocityAfterImpact?: boolean;
        /**
         * Particle will lose given number of ticks from it's maximum lifetime, when touching a block.
         * @remarks
         * This value makes sense only if collision param is `true`.
         * @default 0
         */
        addLifetimeAfterImpact?: number;
        /**
         * If `true`, the particle will be exposed to the world's lighting.
         * If `false`, the particle will always have maximum brightness.
         * Enabling this parameter may reduce the performance when having lots of particles.
         * @default false.
         */
        isUsingBlockLight?: boolean;
        /**
         * Animation frame grid size around width.
         * @since 2.0.4b38
         */
        framesX?: number;
        /**
         * Animation frame grid size around height.
         * @since 2.0.4b38
         */
        framesY?: number;
        /**
         * Time in ticks between particle mesh updates.
         * @since 2.0.4b38
         */
        rebuildDelay?: number;
        /**
         * Animators allow to change some properties of the specific particle depending on the time,
         * each animator is described as an object of definite format and can be not described, if it's not needed.
         */
        animators?: {
            /**
             * Describes the behavior of particle's size,
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
             * Must have the value between 0 and 1.
             * @deprecated Use `icon` instead.
             */
            texture?: AnimatorDescription;
            /**
             * Describes the animation frame, if particle supports it.
             * Must have the value between 0 and 1.
             */
            icon?: AnimatorDescription;
            /**
             * Describes the animated color value, if particle supports it.
             * Accepts values in RGBA ranges, like `color` property in descriptor.
             * @since 2.0.4b38
             */
            color?: ColorAnimatorDescription;
        }
        /**
         * Sub-emitters (don't confuse with emitters) describe how specific particle
         * can emit other particles, according to some events, that may happen to it.
         * Each sub-emitter is described as an object of definite format and
         * can be not described if it's not needed.
         */
        emitters?: {
            /**
             * Called every tick.
             */
            idle?: SubEmitterDescription;
            /**
             * Called when touching a block, makes sense only if collision parameter is `true`.
             */
            impact?: SubEmitterDescription;
            /**
             * Called at the end of particle's life.
             */
            death?: SubEmitterDescription;
        }
    }
    /**
     * Spawns particle of given type on given coords
     * with given velocity and additional parameters in the world.
     * @param type particle type's numeric ID; if you want to spawn vanilla particles,
     * see {@link EParticleType} enums
     * @param vx velocity for the particle by X-axis
     * @param vy velocity for the particle by Y-axis
     * @param vz velocity for the particle by Z-axis
     * @param data additional params, currently don't know how to use, just put 0
     * @remarks
     * Called only on the client side! Use packets to spawn particles for multiple players.
     */
    function addParticle(type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number): void;
    /**
     * Same as {@link Particles.addParticle}, but applies `far` shader to the particle.
     */
    function addFarParticle(type: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data?: number): void;
    /**
     * Spawns {@link EParticleType.ITEM_BREAK} particles at
     * a given location with a given item in world.
     * @param id numeric item ID
     * @param data item data
     * @remarks
     * Called only on the client side! Use packets to spawn particles for multiple players.
     * @since 2.4.0b119
     */
    function addBreakingItemParticle(id: number, data: number, x: number, y: number, z: number): void;
    /**
     * Spawnds particles in line with specified gapness.
     * @param type particle type's numeric ID; if you want to spawn vanilla particles,
     * see {@link EParticleType} enums
     * @param coords1 start location of line
     * @param coords2 end location of line
     * @param gap gapness means step of particles, values more than 1
     * will increase offsets between particles; randomized
     * @param vel velocity of spawned particles
     * @param data variant of spawned particles or properties
     */
    function line(type: number, coords1: Vector, coords2: Vector, gap?: number, vel?: Vector, data?: number): void;
    /**
     * Registers new custom particle type of given params object.
     * @returns Created particle type's numeric ID.
     */
    function registerParticleType(descriptor: ParticleDescription): number;
    /**
     * @returns Object {@link Particles.ParticleType} of the particle by given ID, if it exists.
     */
    function getParticleTypeById(id: number): ParticleType;
    /**
     * Class to create custom particle types.
     * Mostly for internal use, you can use {@link Particles.registerParticleType} instead.
     */
    class ParticleType {
        /**
         * Constructs new {@link Particles.ParticleType}
         * object from given needed params.
         */
        constructor(textureName: string, minU: number, minV: number, maxU: number, maxV: number, textureCountHorizontal: number, textureCountVertical: number, isUsingBlockLight: boolean);
        /**
         * Constructs new {@link Particles.ParticleType}
         * object from given needed params (unfinished documentation).
         */
        constructor(locationName: string, isUsingBlockLight: boolean, uv: number[], textureCountHorizontal: number, textureCountVertical: number);
        /**
         * Constructs new {@link Particles.ParticleType}
         * object from given descriptor object.
         */
        constructor(descriptor: ParticleDescription);
        /**
         * @returns Following particle type's numeric ID.
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
     * @remarks
     * Emitter can be moved only while being in world,
     * and it works ONLY for custom particles, not for vanilla!
     */
    class ParticleEmitter {
        /**
         * Constructs new particle emitter with origin in given coords.
         */
        constructor(x: number, y: number, z: number);
        /**
         * Moves the coordinate system to given coords,
         * it will cause all particles' transfer.
         */
        move(x: number, y: number, z: number): void;
        /**
         * Moves the ORIGIN of the coordinate system to given coords.
         */
        moveTo(x: number, y: number, z: number): void;
        /**
         * Sets the speed of the coordinate system by each axis in blocks per tick,
         * it can be stopped with `emitter.stop()` or `emitter.setVelocity(0, 0, 0)`.
         */
        setVelocity(x: number, y: number, z: number): void;
        /**
         * Binds the origin to the given entity's position,
         * resets the coordinate system's speed.
         */
        attachTo(entity: number): void;
        /**
         * Same as `attachTo(entity)`, but adds x, y and z offset to entity's coords.
         */
        attachTo(entity: number, x: number, y: number, z: number): void;
        /**
         * Detaches the coords system from the entity and leaves it on the current position.
         */
        detach(): void;
        /**
         * Terminates any movement of the coordinate system.
         */
        stop(): void;
        /**
         * Performs the finalization of the native object of the following emitter.
         * It means that you will no longer be able to use the following emitter after calling this method,
         * and the object itself will be removed from the memory.
         * Can be used for optimization purposes.
         */
        release(): void;
        /**
         * @returns Origin's coords in {@link Vector} object.
         */
        getPosition(): Vector;
        /**
         * @returns Origin's coords in float array of 3 elements.
         */
        getPositionArray(): [number, number, number];
        /**
         * Default is false. It means that the coords of the particles for the following emitter.
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
         * Constructs new {@link Particles.ParticleAnimator} object from given needed params.
         */
        constructor(period: number, fadeInTime: number, fadeInValue: number, fadeOutTime: number, fadeOutValue: number);
        /**
         * Constructs new {@link Particles.ParticleAnimator} object from given descriptor object.
         */
        constructor(descriptor: AnimatorDescription);
    }
    /**
     * Sub-emitters describe how specific particle can emit other particles,
     * according to some events, that may happen to it.
     * Mostly for internal use, put sub-emitters descriptors into `emitters`.
     */
    class ParticleSubEmitter {
        /**
         * Constructs new {@link Particles.ParticleSubEmitter}
         * object from given needed params.
         */
        constructor(chance: number, count: number, type: number, data: number);
        /**
         * Constructs new {@link Particles.ParticleSubEmitter}
         * object from given descriptor object.
         */
        constructor(descriptor: SubEmitterDescription);
        /**
         * Emitted particles will receive random initial speed.
         */
        setRandomVelocity(maxRandomVelocity: number): void;
        /**
         * @param keepVelocity If true, the new particle will have the velocity of the particle,
         * that calls the sub-emitter, at the time of invocation; default is false
         */
        setKeepVelocity(keepVelocity: boolean): void;
        /**
         * @param keepEmitter If true, the new particle will save the emitter that was used for it's creation if it had been.
         * @remarks
         * In this case we are talking about emitters, not about sub-emitters.
         */
        setKeepEmitter(keepEmitter: boolean): void;
    }
}
/**
 * Class that represents network entity type.
 */
declare class NetworkEntityType {
	constructor(name: string);
	setClientListSetupListener(action: (list: NetworkConnectedClientList, target: object, entity) => void): this;
	setClientEntityAddedListener<T = any>(action: (entity: number, packet: any) => T): this;
	setClientEntityRemovedListener(action: (target: any, entity: number) => void): this;
	setClientAddPacketFactory(action: (target: any, entity: number, client: any) => any): this;
	addClientPacketListener(name: string, action: (target: any, entity: number, packetData: any) => void): this;
}
declare namespace NetworkEntity {
	/**
	 * Listener used to handle type events.
	 */
	interface IPlayerListener {
		/**
		 * @param client (dis)connected client
		 */
		(client: NetworkClient): void
	}
}
/**
 * Class that represents network entity of the block, currently is not learned.
 */
declare class NetworkEntity {
	constructor(type: NetworkEntityType, context: any);
	remove(): void;
	send(name: string, data: any): void;
	getClients(): NetworkConnectedClientList;
	/**
	 * @since 2.3.1b116-3
	 */
	setConnectionPlayerListener(listener: NetworkEntity.IPlayerListener): void;
	/**
	 * @since 2.3.1b116-3
	 */
	setDisconnectionPlayerListener(listener: NetworkEntity.IPlayerListener): void;
	getType(): NetworkEntityType;
}
/**
 * Class to work with definite couple of clients,
 * bound by certain conditions.
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
     * All clients in a given dimension at a distance
     * of no more than maxDistance from x, y, z.
     * @param x X coord of the conditional centre point of the area where clients are located
     * @param y Y coord of the conditional centre point of the area where clients are located
     * @param z Z coord of the conditional centre point of the area where clients are located
     * @param dimensionID numeric ID of the dimension where clients are located
     * @param maxDistance max distance from the client to the conditional centre, to bound the client to the list
     * @returns Reference to itself to be used in sequential calls.
     */
    setupDistancePolicy(x: number, y: number, z: number, dimensionID: number, maxDistance: number): NetworkConnectedClientList;
    /**
     * Sends packet to all clients from the following list.
     * @param packetName name of the packet to send
     * @param packetData packet data object
     */
    send(packetName: string, packetData: object): void;
    /**
     * Adds given client to the list.
     */
    add(client: NetworkClient): void;
    /**
     * Removes given client from the list.
     */
    remove(client: NetworkClient): void;
    /**
     * @returns Whether the list contains given client.
     */
    contains(client: NetworkClient): boolean;
    /**
     * Sets up policy to add all players to the list.
     * @returns Reference to itself to be used in sequential calls.
     */
    setupAllPlayersPolicy(): NetworkConnectedClientList;
    /**
     * Sets up policy to add all players to the list.
     * @param updateRate how many milliseconds will have to pass between list updates
     * @returns Reference to itself to be used in sequential calls.
     */
    setupAllPlayersPolicy(updateRate: number): NetworkConnectedClientList;
    /**
     * Sets up policy to add players from the same given dimension to the list.
     * @param dimensionID numeric ID of the dimension where the clients have to be located to be included into the list
     * @param updateRate how many milliseconds will have to pass between list updates
     * @returns Reference to itself to be used in sequential calls.
     */
    setupAllInDimensionPolicy(dimensionID: number, updateRate: number): NetworkConnectedClientList;
    /**
     * Sets up policy to add players from the same given dimension to the list.
     * @param dimensionID numeric ID of the dimension where the clients have to be located to be included into the list
     * @returns Reference to itself to be used in sequential calls.
     */
    setupAllInDimensionPolicy(dimensionID: number): NetworkConnectedClientList;
    /**
     * @returns Iterator across clients' objects that the list consists of.
     */
    iterator(): java.util.Iterator<NetworkClient>
}
/**
 * Class that represents network client.
 */
declare class NetworkClient {
    /**
     * Sends given packet to the following client.
     * @param name name of the packet to send
     * @param packetData packet data object
     */
    send(name: string, packetData: object): void;
    /**
     * @returns Unique numeric entity ID of the player.
     */
    getPlayerUid(): number;
    getDisconnectCause(): java.io.IOException;
    getDisconnectPacket(): string;
    /**
     * Sends a packet to the client with a text like a system message.
     */
    sendMessage(message: string): void;
    /**
     * Disconnects player from the server and sends a packet with given reason.
     */
    disconnect(reason: string): void;
    /**
     * Disconnects player from the server with no further information.
     */
    disconnect(): void;
}
/**
 * Working with client and server packets in multiplayer
 * and also determine stuff.
 */
declare namespace Network {
    /**
     * @returns Array containing connected clients.
     */
    function getConnectedClients(): native.Array<NetworkClient>;
    /**
     * @returns Array containing connected players UIDs.
     */
    function getConnectedPlayers(): native.Array<number>;
    /**
     * @returns Client object for player by player's entity ID.
     */
    function getClientForPlayer(player: number): NetworkClient;
    /**
     * Event that is called when a client receives a packet with given name.
     * @param name name of the packet
     */
    function addClientPacket<T extends object>(name: string, func: (packetData: T) => void): void;
    /**
     * Event that is called when server receives a packet with the specified name from client.
     * @param name name of the packet
     */
    function addServerPacket<T extends object>(name: string, func: (client: NetworkClient, data: T) => void): void;
    /**
     * Sends packet object with specified name to all clients.
     */
    function sendToAllClients(name: string, packetData: object): void;
    /**
     * Sends packet object with the specified name from client to server.
     */
    function sendToServer(name: string, packetData: object): void;
    /**
     * Sends message to all players.
     * @param message text of the message
     */
    function sendServerMessage(message: string): void;
    /**
     * Converts item or block ID from server to local value.
     */
    function serverToLocalId(id: string | number): number;
    /**
     * Converts item or block ID from local to server value.
     */
    function localToServerId(id: string | number): number;
    /**
     * @returns `true` if player connected to remote world.
     * @since 2.1.0b57
     */
    function inRemoteWorld(): boolean;
}
/**
 * NBT (Named Binary Tag) is a tag based binary format designed to carry large
 * amounts of binary data with smaller amounts of additional data.
 * You can get or set nbt tags of {@link Entity entities},
 * {@link NativeTileEntity native tile entities (such as chests or beacons)} and
 * {@link ItemExtraData items}. To get more information about these data structures,
 * see {@link http://web.archive.org/web/20110723210920/http://www.minecraft.net/docs/NBT.txt this page}.
 */
declare namespace NBT {
    /**
     * List tags represent NBT map-like data structure (key-value pairs). it's values may
     * be of any type, so check the type before calling the appropriate getter.
     */
    class CompoundTag {
        /**
         * Creates a new compound tag.
         */
        constructor();
        /**
         * Creates a copy of specified compound tag.
         */
        constructor(tag: CompoundTag);
        /**
         * Converts compound tag to JavaScript object for easier reading.
         * @returns Valid JavaScript representation of compound tag.
         */
        toScriptable(): Scriptable;
        /**
         * @returns Java-array containing all the keys of the compound tag.
         */
        getAllKeys(): native.Array<string>;
        /**
         * @returns `true` if specified key exists in compound tag.
         */
        contains(key: string): boolean;
        /**
         * @param key key to verify for the type
         * @param type tag type to verify for, one of the {@link ENbtDataType} constants
         * @returns `true` if specified key exists in compound tag and it's value is
         * of specified type.
         */
        containsValueOfType(key: string, type: number): boolean;
        /**
         * @returns Value type for the specified key. One of the {@link ENbtDataType}
         * constants.
         */
        getValueType(key: string): number;
        /**
         * @returns NBT tag of byte type by it's key.
         */
        getByte(key: string): number;
        /**
         * @returns NBT tag of short type by it's key.
         */
        getShort(key: string): number;
        /**
         * @returns NBT tag of 32-bit integer type by it's key.
         */
        getInt(key: string): number;
        /**
         * @returns NBT tag of 64-bit integer type by it's key.
         */
        getInt64(key: string): number;
        /**
         * @returns NBT tag of float type by it's key.
         */
        getFloat(key: string): number;
        /**
         * @returns NBT tag of double type by it's key.
         */
        getDouble(key: string): number;
        /**
         * @returns NBT tag of string type by it's key.
         */
        getString(key: string): string;
        /**
         * @returns NBT tag of compound type by it's key. Note that a copy of
         * existing compound tag is created so you cannot edit it directly. Use
         * setCompoundTag method to apply changes or use
         * {@link NBT.CompoundTag.getCompoundTagNoClone getCompoundTagNoClone} to edit it directly.
         */
        getCompoundTag(key: string): NBT.CompoundTag;
        /**
         * @returns Directly editable NBT tag of byte type by it's key. Don't save
         * reference for future usage since they get destroyed when the parent
         * object is destroyed.
         */
        getCompoundTagNoClone(key: string): NBT.CompoundTag;
        /**
         * @returns NBT tag of list type by it's key. Note that a copy of
         * existing list tag is created so you cannot edit it directly. Use
         * setCompoundTag method to apply changes or use
         * {@link NBT.CompoundTag.getListTagNoClone getListTagNoClone} to edit it directly.
         */
        getListTag(key: string): NBT.ListTag;
        /**
         * @returns Directly editable NBT tag of byte type by it's key. Don't save
         * reference for future usage since they get destroyed when the parent
         * object is destroyed.
         */
        getListTagNoClone(key: string): NBT.ListTag;
        /**
         * Puts value of byte type into compound tag.
         */
        putByte(key: string, value: number): void;
        /**
         * Puts value of short type into compound tag.
         */
        putShort(key: string, value: number): void;
        /**
         * Puts value of 32-bit integer type into compound tag.
         */
        putInt(key: string, value: number): void;
        /**
         * Puts value of 64-bit integer type into compound tag.
         */
        putInt64(key: string, value: number): void;
        /**
         * Puts value of float type into compound tag.
         */
        putFloat(key: string, value: number): void;
        /**
         * Puts value of double type into compound tag.
         */
        putDouble(key: string, value: number): void;
        /**
         * Puts value of string type into compound tag.
         */
        putString(key: string, value: string): void;
        /**
         * Puts value of compound type into compound tag.
         */
        putCompoundTag(key: string, value: CompoundTag): void;
        /**
         * Puts value of list type into compound tag.
         */
        putListTag(key: string, value: ListTag): void;
        /**
         * Removes tag by it's key.
         */
        remove(key: string): void;
        /**
         * Removes all the tags from the compound tags.
         */
        clear(): void;
    }
    /**
     * List tags represent NBT array-like indexed data structure. it's values may
     * be of any type, so check the type before calling the appropriate getter.
     */
    class ListTag {
        /**
         * Creates a new list tag.
         */
        constructor();
        /**
         * Creates a copy of specified list tag.
         */
        constructor(tag: CompoundTag);
        /**
         * Converts list tag to JavaScript object for easier reading.
         * @returns Valid JavaScript representation of list tag.
         * @since 2.0.5b45
         */
        toScriptable(): any[];
        /**
         * @returns Count of the tags in the list tag.
         */
        length(): number;
        /**
         * @returns Value type for the specified index.
         * One of the {@link ENbtDataType} constants.
         */
        getValueType(index: number): number;
        /**
         * @returns NBT tag of byte type by it's index.
         */
        getByte(index: number): number;
        /**
         * @returns NBT tag of short type by it's index.
         */
        getShort(index: number): number;
        /**
         * @returns NBT tag of 32-bit integer type by it's index.
         */
        getInt(index: number): number;
        /**
         * @returns NBT tag of 64-bit integer type by it's index.
         */
        getInt64(index: number): number;
        /**
         * @returns NBT tag of float type by it's index.
         */
        getFloat(index: number): number;
        /**
         * @returns NBT tag of double type by it's index.
         */
        getDouble(index: number): number;
        /**
         * @returns NBT tag of string type by it's index.
         */
        getString(index: number): string;
        /**
         * @returns NBT tag of compound type by it's index. Note that a copy of
         * existing compound tag is created so you cannot edit it directly.
         * Use setCompoundTag method to apply changes or use
         * {@link NBT.CompoundTag.getCompoundTagNoClone getCompoundTagNoClone} to edit it directly.
         */
        getCompoundTag(index: number): NBT.CompoundTag;
        /**
         * @returns Directly editable NBT tag of byte type by it's index. Don't save
         * reference for future usage since they get destroyed when the parent
         * object is destroyed.
         */
        getCompoundTagNoClone(index: number): NBT.CompoundTag;
        /**
         * @returns NBT tag of list type by it's index. Note that a copy of
         * existing list tag is created so you cannot edit it directly. Use
         * setCompoundTag method to apply changes or use
         * {@link NBT.CompoundTag.getListTagNoClone getListTagNoClone} to edit it directly.
         */
        getListTag(index: number): NBT.ListTag;
        /**
         * @returns Directly editable NBT tag of byte type by it's index. Don't save
         * reference for future usage since they get destroyed when the parent
         * object is destroyed.
         */
        getListTagNoClone(index: number): NBT.ListTag;
        /**
         * Puts value of byte type into list tag.
         */
        putByte(index: number, value: number): void;
        /**
         * Puts value of short type into list tag.
         */
        putShort(index: number, value: number): void;
        /**
         * Puts value of 32-bit integer type into list tag.
         */
        putInt(index: number, value: number): void;
        /**
         * Puts value of 64-bit integer type into list tag.
         */
        putInt64(index: number, value: number): void;
        /**
         * Puts value of float type into list tag.
         */
        putFloat(index: number, value: number): void;
        /**
         * Puts value of double type into list tag.
         */
        putDouble(index: number, value: number): void;
        /**
         * Puts value of string type into list tag.
         */
        putString(index: number, value: string): void;
        /**
         * Puts value of compound type into list tag.
         */
        putCompoundTag(index: number, value: CompoundTag): void;
        /**
         * Puts value of list type into list tag.
         */
        putListTag(index: number, value: ListTag): void;
        /**
         * Removes all the tags from the compound tags.
         */
        clear(): void;
    }
    /**
     * Templates to typofication of resulted {@link CompoundTag.toScriptable},
     * which is used to determine containment of tags.
     * Not includes structure `.nbt`, only in-game definitions.
     * @remarks
     * Booleans still "bytes", which means it just omitted when
     * comparing `<obj>.property == false` nor `<obj>.property === false`.
     */
    namespace Templates {
        interface Block extends Scriptable {
            name: string;
            states: BlockState[];
            /**
             * Database tracking identifier (in 1.16 equals `17825808`).
             */
            version: number;
        }
        interface BlockState extends Scriptable {
        }
        interface Item<T extends Nullable<ItemTag> = ItemTag> extends Scriptable {
            Block?: Block;
            /**
             * Amount of item in slot.
             */
            Count: number;
            /**
             * Dealed damage, when it comes to {@link Item.getMaxDamage} item will be broken.
             * @default 0 // not damaged at all
             */
            Damage: number;
            /**
             * Typed identifier, such as `"minecraft:stick"`.
             */
            Name: string;
            /**
             * Indexed slot, required in containers with more than one slots.
             */
            Slot?: number;
            /**
             * Picked up by entity, denies despawn it naturally.
             */
            WasPickedUp: boolean;
            /**
             * Additional data, such as nametags, enchantments, etc.
             */
            tag?: T;
        }
        interface ItemWritableBookTagPage extends Scriptable {
            /**
             * Screenshot shotted on server (appears in pause menu), specially based on Education Edition.
             * @default ""
             */
            photoname: string;
            /**
             * Text placed on page as-is (with new lines `\n`).
             */
            text: string;
        }
        interface ItemTag extends Scriptable {
            /**
             * List of applied enchantments in index-numeral sorting.
             */
            ench?: ItemTagEnchantment[];
        }
        interface ItemFilledMapTag extends ItemTag {
            /**
             * Whether map should display compasses for players or not.
             */
            map_display_players: boolean;
            /**
             * Displayed for players map number, starts with `1`.
             */
            map_name_index: number;
            /**
             * UID to be taken from world NBT.
             */
            map_uuid: number;
        }
        interface ItemWritableBookTag extends ItemTag {
            /**
             * Written book author, assigned when signing book.
             * @default "Author Unknown"
             */
            author?: string;
            /**
             * Number of written copy, `0` means original.
             * @default 0
             */
            generation?: number;
            /**
             * List of created pages in index-numeral sorting.
             */
            pages: ItemWritableBookTagPage[];
            /**
             * Written book title, assigned when signing book.
             */
            title?: string;
            /**
             * Linked teacher book, especially for Education Edition.
             * @default 0
             */
            xuid?: string;
        }
        interface ItemTagEnchantment extends Scriptable {
            /**
             * One of {@link EEnchantment} enum values.
             */
            id: number;
            /**
             * Level of strength, value between `0` and `255` (more buggy up to `32768`).
             */
            lvl: number;
        }
        interface Entity extends Scriptable {
            /**
             * Countdown in ticks before entity become adult.
             */
            Age?: number;
            /**
             * Countdown in ticks before entity start drowning.
             */
            Air: number;
            /**
             * Helmet, Chestplate, Leggings, Boots. Accessible by index, not marked with `Slot` property.
             */
            Armor: Item[];
            /**
             * Last attack tick, determines time between attacks.
             */
            AttackTime: number;
            /**
             * Entity attributes, such as `"minecraft:health"`, `"minecraft:follow_range"`, etc.
             */
            Attributes: EntityAttribute[];
            /**
             * Entity body yaw rotation in degrees, with offset of {@link Rotation}.
             */
            BodyRot: number;
            /**
             * Llama or mule equipped chests.
             */
            Chested: boolean;
            Color: number;
            Color2: number;
            /**
             * Entity is dead, which is required to visualize animation of dying.
             */
            Dead: boolean;
            /**
             * Tick when entity become dead (health <= 0).
             */
            DeathTime: number;
            /**
             * Last synchronized distance between ground and entity.
             */
            FallDistance: number;
            /**
             * Fire ticks before burning stopped, alternative of {@link Entity.setFire}.
             */
            Fire: number;
            HasExecuted: false;
            HomeDimensionId: number;
            /**
             * @default [-2147483648, -2147483648, -2147483648] // when not set
             */
            HomePos: number[];
            /**
             * Last hurt tick, determines entity panic/attack state.
             */
            HurtTime: number;
            /**
             * Immune to in-game damage types, such as NPCs and Agents.
             */
            Invulnerable: boolean;
            /**
             * Normally, entity become angry when attacked.
             */
            IsAngry: boolean;
            /**
             * Entity can move, alternative of {@link Entity.setMobile}.
             */
            IsAutonomous: boolean;
            /**
             * Entity is not adult, so when {@link Age} reaches `0` it is not baby.
             */
            IsBaby: boolean;
            /**
             * Entity is eating {@link Mainhand} item, displays particles around.
             */
            IsEating: boolean;
            /**
             * Entity is using elytra (to glide).
             */
            IsGliding: boolean;
            IsGlobal: boolean;
            /**
             * Patrols of pillagers following their leader.
             */
            IsIllagerCaptain: boolean;
            IsOrphaned: boolean;
            IsOutOfControl: boolean;
            /**
             * Entity breeded and prepared to duplicate itself, such as turtles.
             */
            IsPregnant: boolean;
            IsRoaring: boolean;
            /**
             * Entity sees dangerous thing around, such as villagers flee.
             */
            IsScared: boolean;
            IsStunned: boolean;
            /**
             * Entity is standing on water.
             */
            IsSwimming: boolean;
            /**
             * Entity is tamed, such as cats or dogs.
             */
            IsTamed: boolean;
            /**
             * Entity is trusting player (do not panic when it came),
             * such as foxes childs breeded by someone.
             */
            IsTrusting: boolean;
            /**
             * Dimension from entity transfered when is going to portal,
             * last saved state when loaded into dimension.
             */
            LastDimensionId: number;
            /**
             * Leashed with knot entity (normally, player).
             * @default -1
             */
            LeasherID: number;
            /**
             * Required on first death tick, drops loot again if set to `false`.
             */
            LootDropped: boolean;
            /**
             * @default 0 // when is not breeded
             */
            LoveCause: number;
            /**
             * Item set by {@link Entity.setCarriedItem}, entities uses it for attack and other AI-related things.
             */
            Mainhand: Item;
            MarkVariant: number;
            /**
             * Velocity of physics in-world, vector of moving target.
             */
            Motion: number[];
            /**
             * Entity is naturally spawned, not breeded or summoned.
             */
            NaturalSpawn: boolean;
            /**
             * Item set by {@link Entity.setOffhandItem}, in common cases entities ignores it, but players or extra-powered items (Totem of Undying fully restores non-player entities health) are useful.
             */
            Offhand: Item;
            /**
             * Entity is standing on landing.
             */
            OnGround: boolean;
            /**
             * Projectile shooter entity UID.
             * @default -1
             */
            OwnerNew: number;
            /**
             * Entity can not be despawned.
             */
            Persistent: boolean;
            /**
             * Ticks before entity can move through portal again.
             */
            PortalCooldown: number;
            /**
             * XYZ absolute coordinates, alternative of {@link Entity.setPosition}.
             */
            Pos: number[];
            /**
             * Yaw (horizontal rotation angle) and pitch (vertical rotation angle) respectively in degrees, alternative of {@link Entity.setLookAngle}.
             */
            Rotation: number[];
            /**
             * When pig or strider is saddled (excludes horses or not?).
             */
            Saddled: boolean;
            /**
             * When sheep or snow golem is sheared.
             */
            Sheared: boolean;
            ShowBottom: boolean;
            /**
             * Entity is sitting, such as players or foxes.
             */
            Sitting: boolean;
            SkinID: number;
            Strength: number;
            StrengthMax: number;
            Surface: number;
            Tags: string[];
            /**
             * Following, attacking or anything else targeted entity.
             * @default -1
             */
            TargetID: number;
            /**
             * Tick when entity is born, used to {@link limitedLife} property.
             */
            TimeStamp: number;
            TradeExperience: number;
            TradeTier: number;
            /**
             * Entity UID, which is passed to Inner Core callbacks.
             */
            UniqueID: number;
            Variant: number;
            boundX: number;
            boundY: number;
            boundZ: number;
            /**
             * Entity may equip, take or replace containing item from drop.
             */
            canPickupItems: boolean;
            /**
             * Set of rules applied (starts with `+`) or excluded (starts with `-`)
             * from entity; it includes properties, tasks, etc.
             */
            definitions: string[];
            hasBoundOrigin: boolean;
            hasSetCanPickupItems: boolean;
            /**
             * Typed entity identifier without tags, such as `"minecraft:cow"`.
             */
            identifier: string;
            /**
             * Ticks after {@link TimeStamp} when entity become {@link Dead}.
             */
            limitedLife: number;
        }
        interface EntityAttribute extends Scriptable {
            Base: number;
            Current: number;
            DefaultMax: number;
            DefaultMin: number;
            Max: number;
            Min: number;
            /**
             * One of {@link Entity.Attributes} or your custom one.
             */
            Name: Entity.Attributes | string;
        }
        interface IBlockEntity extends Scriptable {
            /**
             * Typed identifier, such as `"Chest"`, `"Beacon"`, etc.
             */
            id: string;
            /**
             * Block Entity will be saved without instantiating new one when transporting (via pistons, commands, etc.).
             */
            isMovable: boolean;
            x: number, y: number, z: number;
        }
        interface IContainerBlockEntity extends IBlockEntity {
            /**
             * Contained slots, which is stored in numeral-index sorting starting with zero.
             * @remarks
             * Normally, slot information removes when item became "air" (disappears), so please
             * be careful when calling via `<tag>.Items[<index>]` convention!
             */
            Items: Item[];
        }
        interface ILootableBlockEntity extends IContainerBlockEntity {
            /**
             * Exploration map can be pointed here, tract as treasure.
             * @default false
             */
            Findable: boolean;
            /**
             * Definition to behavior pack path with extension, such as `"loot_tables/chests/end_city_treasure.json"`.
             */
            LootTable?: string;
            /**
             * Randomly generated seed to determine containment.
             */
            LootTableSeed?: number;
        }
        /**
         * **Chest** (Chest / Trapped Chest) with `ID = 0`.
         */
        interface ChestBlockEntity extends ILootableBlockEntity {
            id: "Chest";
            /**
             * If there's sometime created connection with double-chest.
             */
            pairlead?: boolean;
            pairx?: number;
            pairz?: number;
        }
        interface IFurnaceBlockEntity extends IContainerBlockEntity {
            /**
             * Currently burning fuel (appears in slot `1`) total time in ticks (e.g. coal burns in `1600` ticks) before burning completed.
             * @default 0
             */
            BurnDuration: number;
            /**
             * Counter to {@link BurnDuration}, when them equals furnace unlit.
             * @default 0
             */
            BurnTime: number;
            /**
             * Currently smelting item (appears in slot `0`) progress, result will be presented in slot with index `2`.
             */
            CookTime: number;
            /**
             * Accumulated experience, it will be dropped when result taken or furnace digged.
             * @default 0
             */
            StoredXPInt: number;
        }
        /**
         * **Furnace** with `ID = 1`.
         */
        interface FurnaceBlockEntity extends IFurnaceBlockEntity {
            id: "Furnace";
        }
        /**
         * **Hopper** with `ID = 2`.
         */
        interface HopperBlockEntity extends IContainerBlockEntity {
            id: "Hopper";
            /**
             * Ticks counter before transfering to watching side or down if hoppers unlocked.
             * @default 0
             */
            TransferCooldown: number;
        }
        /**
         * **NetherReactor** (Nether Reactor Core) with `ID = 3`.
         */
        interface NetherReactorBlockEntity extends IBlockEntity {
            id: "NetherReactor";
            /**
             * @default false
             */
            HasFinished: boolean;
            /**
             * @default false
             */
            IsInitialized: boolean;
            /**
             * @default 0
             */
            Progress: number;
        }
        /**
         * **Sign** with `ID = 4`.
         */
        interface SignBlockEntity extends IBlockEntity {
            id: "Sign";
            /**
             * Written text, delimited with newlines (`\n`, it may be more than 4 lines, but not rendered in-world).
             */
            Text: string;
            /**
             * No. Owners. Constant.
             * @default ""
             */
            TextOwner: string;
            /**
             * Basic text color, {@link EColor.RESET} restores it.
             */
            Color?: string;
        }
        /**
         * **MobSpawner** (Spawner) with `ID = 5`.
         */
        interface MobSpawnerBlockEntity extends IBlockEntity {
            id: "MobSpawner";
            /**
             * Ticks before spawning next entity.
             */
            Delay: number;
            /**
             * Placeholder animation in spawner height, constant.
             * @default 1.7999999523162842
             */
            DisplayEntityHeight: number;
            /**
             * Placeholder animation in spawner size relative to block itself.
             */
            DisplayEntityScale: number;
            /**
             * Placeholder animation in spawner width, constant.
             * @default 0.6000000238418579
             */
            DisplayEntityWidth: number;
            /**
             * Typed entity identifier, such as `"minecraft:enderman"`.
             * @default ""
             */
            EntityIdentifier: string;
            /**
             * Maximum containment mobs in {@link SpawnRange}, if here are more
             * spawner just emitting particles.
             * @default 6
             */
            MaxNearbyEntities: number;
            /**
             * Maximum time in ticks between mob spawing.
             * @default 800
             */
            MaxSpawnDelay: number;
            /**
             * Minimum time in ticks between mob spawing.
             * @default 800
             */
            MinSpawnDelay: number;
            /**
             * Anyone (of players) must be near to spawner, otherwise spawner
             * hides placeholder animation and stops.
             * @default 16
             */
            RequiredPlayerRange: number;
            /**
             * Maximum spawning limit, not everyone may spawned with each other
             * when place above comes to zero.
             * @default 4
             */
            SpawnCount: number;
            /**
             * Ranged AABB box where entities became.
             * @default 4
             */
            SpawnRange: number;
        }
        /**
         * **Skull** (Mob Head) with `ID = 6`.
         */
        interface SkullBlockEntity extends IBlockEntity {
            id: "Skull";
            /**
             * Whether dragon mouth powered by redstone.
             * @default 0
             */
            MouthMoving: boolean;
            /**
             * Cycling time in ticks, between full-cycled move down and up.
             * @default 0
             */
            MouthTickCount: number;
            /**
             * Rotation angle in degrees, value between `22.5` and `180` (with in-game step `22.5`).
             */
            Rotation: number;
            /**
             * `0` means skeleton, `1` wither skeleton, `2` zombie, `3` player, `4` creeper and `5` ender dragon.
             */
            SkullType: number;
        }
        /**
         * **FlowerPot** (Flower Pot) with `ID = 7`.
         */
        interface FlowerPotBlockEntity extends IBlockEntity {
            id: "FlowerPot";
            /**
             * Anything in particular, my cat preferr `"minecraft:brown_mushroom"` (`name` property).
             */
            PlantBlock?: Block;
        }
        /**
         * **BrewingStand** (Brewing Stand) with `ID = 8`.
         */
        interface BrewingStandBlockEntity extends IContainerBlockEntity {
            id: "BrewingStand";
            /**
             * Every potion cooks on same time ticks, counter.
             * When next ingredient is done, every potion in slots `1`-`3`
             * obtains tag `"wasJustBrewed" = true`.
             * @default 0
             */
            CookTime: number;
            /**
             * Fuel left of {@link FuelTotal} property, when it comes to zero
             * next charge from slot `4` was used.
             * @default 0
             */
            FuelAmount: number;
            /**
             * When fuel was taken from slot changes to it capacity, now availabled
             * only `"minecraft:blaze_powder"` (`name` property), which sets fuel to `20`.
             * @default 0
             */
            FuelTotal: number;
        }
        /**
         * **EnchantTable** (Enchanting Table) with `ID = 9`.
         */
        interface EnchantTableBlockEntity extends IBlockEntity {
            id: "EnchantTable";
            /**
             * Rotation angle in radians between `-Math.PI` and `Math.PI`.
             */
            rott: number;
        }
        /**
         * **DaylightDetector** (Daylight Sensor) with `ID = 10`.
         */
        interface DaylightDetectorBlockEntity extends IBlockEntity {
            id: "DaylightDetector";
        }
        /**
         * **Music** (Note Block) with `ID = 11`.
         */
        interface MusicBlockEntity extends IBlockEntity {
            id: "Music";
            /**
             * Number between `0` and `24`, which changes note tone.
             */
            note: number;
        }
        /**
         * **Comparator** (Redstone Comparator) with `ID = 12`.
         */
        interface ComparatorBlockEntity extends IBlockEntity {
            id: "Comparator";
            /**
             * Redstone power, value between `0` and `15`.
             */
            OutputSignal: number;
        }
        /**
         * **Dispenser** with `ID = 13`.
         */
        interface DispenserBlockEntity extends IContainerBlockEntity {
            id: "Dispenser";
        }
        /**
         * **Dropper** with `ID = 14`.
         */
        interface DropperBlockEntity extends IContainerBlockEntity {
            id: "Dropper";
        }
        /**
         * **Cauldron** with `ID = 16`.
         * @remarks
         * Contains {@link Items}, but it intentionally not used.
         */
        interface CauldronBlockEntity extends IContainerBlockEntity {
            id: "Cauldron";
            /**
             * One of {@link EPotionEffect} enum values.
             * But... Maybe try `<enum value> - 1`?
             */
            PotionId: number;
            /**
             * Level of strength, value between `0` and `255` (more buggy to `32768`).
             * @default -1
             */
            PotionType: number;
            /**
             * Packed RGB color, one of my favorites is `-75715`.
             */
            CustomColor?: number;
        }
        /**
         * **ItemFrame** (Item Frame) with `ID = 17`.
         */
        interface ItemFrameBlockEntity extends IBlockEntity {
            id: "ItemFrame";
            /**
             * Item to be displayed in frame, tag doesn't exist by default.
             */
            Item?: Item;
            /**
             * Percent value between `0` and `1`; everything just cool when elytra
             * drops with chance `0.01`.
             * @default 1
             */
            ItemDropChance?: number;
            /**
             * Rotation angle in degress between `0` and `315` (with in-game step `45`).
             * Also changes comparator strength, triggers observers.
             */
            ItemRotation?: number;
        }
        /**
         * **PistonArm** (Piston) with `ID = 18`.
         */
        interface PistonArmBlockEntity extends IBlockEntity {
            id: "PistonArm";
            /**
             * Blocks attached to piston (excluding head) with slime and honey blocks.
             */
            AttachedBlocks: Block[];
            /**
             * Blocks prevents piston from moving, such as obsidian.
             */
            BreakBlocks: Block[];
            /**
             * Latest successfully changed state progress, which determine piston movement.
             */
            LastProgress: number;
            /**
             * Required by redstone state, if nothing blocking way, piston moves.
             */
            NewState: number;
            /**
             * Percent between `0` and `1` (with in-game step `0.5`), where `1` means activated.
             */
            Progress: number;
            /**
             * Currently state, `0` means pulled, `1` moving and `2` pushed.
             */
            State: number;
            /**
             * Whether piston crafted with slime and can transfer blocks back.
             */
            Sticky: boolean;
        }
        /**
         * **MovingBlock** (Moving Block) with `ID = 19`.
         */
        interface MovingBlockEntity extends IBlockEntity {
            id: "MovingBlock";
            /**
             * Block to be rendered as moving, let give a try with a `"minecraft:cake"` (`name` property).
             */
            movingBlock: Block;
            /**
             * Block to be rendered as moving above {@link movingBlock}, let give a try with a `"minecraft:flowing_lava"` (`name` property).
             */
            movingBlockExtra: Block;
            /**
             * If block connected with a sticky piston, it will appears here.
             * @default 0
             */
            pistonPosX: number;
            /**
             * If block connected with a sticky piston, it will appears here.
             * @default 1
             */
            pistonPosY: number;
            /**
             * If block connected with a sticky piston, it will appears here.
             * @default 0
             */
            pistonPosZ: number;
        }
        /**
         * **Beacon** with `ID = 21`.
         * @remarks
         * Primary effect requires just one-level platform, meanwhile secondary
         * works only when four-level built, otherwise fallbacks to primary.
         */
        interface BeaconBlockEntity extends IBlockEntity {
            id: "Beacon";
            /**
             * `0` means none, `1` speed, `2` haste, `3` resistance, `4` jump boost and `5` strength.
             * @default 0
             */
            primary: number;
            /**
             * `0` means none, `1` regeneration and `2` boost {@link primary} effect.
             * @default 0
             */
            secondary: number;
        }
        /**
         * **EndPortal** (End Portal) with `ID = 22`.
         */
        interface EndPortalBlockEntity extends IBlockEntity {
            id: "EndPortal";
        }
        /**
         * **EnderChest** (Ender Chest) with `ID = 23`.
         */
        interface EnderChestBlockEntity extends ILootableBlockEntity {
            id: "EnderChest";
        }
        /**
         * **EndGateway** (End Gateway) with `ID = 24`.
         */
        interface EndGatewayBlockEntity extends IBlockEntity {
            id: "EndGateway";
            /**
             * Counter, that drops when entity moves through portal.
             * Used to display purple beacon in portal for few hundred ticks.
             */
            Age: number;
            /**
             * XYZ coordinates of place portal transfers to.
             * @default [0, 0, 0] // so, under world
             */
            ExitPortal: number[];
        }
        /**
         * **ShulkerBox** (Shulker Box) with `ID = 25`.
         */
        interface ShulkerBoxBlockEntity extends ILootableBlockEntity {
            id: "ShulkerBox";
            /**
             * One of {@link EBlockSide} enum values.
             */
            facing: number;
        }
        /**
         * **CommandBlock** (Command Block) with `ID = 26`.
         */
        interface CommandBlockEntity extends IBlockEntity {
            id: "CommandBlock";
            /**
             * Command to be executed here, such as `/playanimation \@e[type=!minecraft:player] animation.humanoid.celebrating null 20`.
             */
            Command: string;
            /**
             * Like nametag, but above command block; hovering text.
             */
            CustomName: string;
            /**
             * When {@link LPCommandMode} is set to cycled and conditions are done,
             * first command executes without {@link TickDelay}.
             */
            ExecuteOnFirstTick: boolean;
            /**
             * `0` means impulse (single activation), `1` chain (activation when pointed to chain command block executed) and `2` cycled (forever execution between delay with condition checking).
             */
            LPCommandMode: number;
            /**
             * `0` means statement, `1` doesn't care about result.
             */
            LPConditionalMode: number;
            /**
             * `0` means always active, `1` requires redstone.
             */
            LPRedstoneMode: number;
            /**
             * When last execution has been performed.
             */
            LastExecution: number;
            /**
             * Message recorded with last execution, requires {@link TrackOutput} to be set to `true`.
             */
            LastOutput: string;
            /**
             * Splitted to command parts without first slash (or symbol if slash is not provided), requires {@link TrackOutput} to be set to `true`.
             */
            LastOutputParams: string[];
            SuccessCount: number;
            /**
             * Delay in ticks between executions (cycled blocks) or before starting it.
             */
            TickDelay: number;
            /**
             * Save last execution command results.
             */
            TrackOutput: boolean;
            /**
             * Database tracking identifier (in 1.16 equals `13`).
             */
            Version: number;
            auto: number;
            /**
             * Condition right now is `true`?
             */
            conditionMet: boolean;
            /**
             * Redstone signal found?
             */
            powered: boolean;
        }
        /**
         * **Bed** with `ID = 27`.
         */
        interface BedBlockEntity extends IBlockEntity {
            id: "Bed";
            /**
             * Index of bed color, where `0` is white; block palettes are same.
             * @default 0
             */
            color: number;
        }
        interface BannerPatternEntry extends Scriptable {
            /**
             * Index of pattern color, where `0` is white; block palettes are same.
             * @default 0
             */
            Color: number;
            /**
             * Pattern shortcut name, such as `"gra"`, `"mc"`, etc.
             */
            Pattern: string;
        }
        /**
         * **Banner** with `ID = 28`.
         */
        interface BannerBlockEntity extends IBlockEntity {
            id: "Banner";
            /**
             * Index of banner color, where `0` is white; block palettes are same.
             * @default 0
             */
            Base: number;
            /**
             * @default 0
             */
            Type: number;
            /**
             * Patterns to be applied on {@link Base} color.
             */
            Patterns?: BannerPatternEntry[];
        }
        /**
         * **StructureBlock** (Structure Block) with `ID = 32`.
         */
        interface StructureBlockEntity extends IBlockEntity {
            id: "StructureBlock";
            /**
             * Mode of structure block; `0` means load, `1` data (consumed by pools), `2` save.
             */
            data: number;
            /**
             * Metadata to be passed when {@link data} is set to data mode.
             */
            dataField: string;
            /**
             * Load or save NBT data of entities contained in bounds, existing data will be omitted.
             */
            ignoreEntities: boolean;
            /**
             * Load or save NBT data of players contained in bounds.
             */
            includePlayers: boolean;
            /**
             * Lower values destructs more random selected blocks.
             */
            integrity: number;
            /**
             * Powered by redstone signal?
             */
            isPowered: boolean;
            /**
             * `0` means no mirroring, `1` mirror above x, `2` mirror above y, `3` mirror above z
             */
            mirror: number;
            /**
             * `0` means save signal power (lit lamps, redstone itself, etc.), `1` forget (unlit sources will be updated when structure is placed).
             */
            redstoneSaveMode: number;
            /**
             * Blocks will be merged (with structure air as real air) or pasted as-is.
             */
            removeBlocks: boolean;
            /**
             * `0` means no rotation, `1` 90 degress, `2` 180 degress, `3` 270 degress.
             */
            rotation: number;
            /**
             * Seed to be passed when configuring {@link integrity}
             */
            seed: number;
            /**
             * Display bounds of structure in-world, includes vertex frame above.
             */
            showBoundingBox: boolean;
            /**
             * Vanilla or behavior pack namespaced (first directory determines namespace, subfolders joined with `.`) relative path to structure, try something like `"minecraft:endcity.ship"`.
             */
            structureName: string;
            xStructureOffset: number, yStructureOffset: number, zStructureOffset: number;
            xStructureSize: number, yStructureSize: number, zStructureSize: number;
        }
        /**
         * **Jukebox** with `ID = 33`.
         */
        interface JukeboxBlockEntity extends IBlockEntity {
            id: "JukeboxBlock";
            /**
             * Record disc that will be played, what about `"minecraft:music_disc_strad"` (`name` property).
             */
            RecordItem?: Item;
        }
        /**
         * **ChemistryTable** (Chemistry Equipment) with `ID = 34`.
         */
        interface ChemistryTableBlockEntity extends IBlockEntity {
            id: "ChemistryTable";
            /**
             * Brewing item data, that will be transpiled into materials, such as `17`, etc.
             */
            itemAux?: number;
            /**
             * Brewing item numeric ID, that will be transpiled into materials, such as `583`, etc.
             */
            itemId?: number;
            /**
             * Brewing item count, that will be transpiled into materials, such as `1`, etc.
             */
            itemStack?: number;
        }
        /**
         * **Conduit** with `ID = 35`.
         */
        interface ConduitBlockEntity extends IBlockEntity {
            id: "Conduit";
            /**
             * Whether conduit constructed or not, underwater monument blocks come out to help.
             * @default false
             */
            Active: boolean;
            /**
             * Entity UID to protect players in water nearest, attacks monsters when fully constructed.
             */
            Target: number;
        }
        /**
         * **JigsawBlock** (Jigsaw Block) with `ID = 36`.
         */
        interface JigsawBlockEntity extends IBlockEntity {
            id: "JigsawBlock";
            /**
             * Typed block identifier (includes state support such as `[facing=east]`) to be replaced when jigsaw activated.
             * @default "minecraft:air"
             */
            final_state: string;
            /**
             * Connection between jigsaw nodes, as-is.
             * @default "rollable"
             */
            joint: "rollable" | "aligned";
            /**
             * Associated structure name, jigsaw identifier, such as `"template:bundle"`.
             * @default "minecraft:empty"
             */
            name: string;
            /**
             * Required structure subset to be aligned with, such as, such as `"template:pipe"`.
             * @default "minecraft:empty"
             */
            target: string;
            /**
             * Pool in which jigsaws will be connected with each others, such as `"template:bundle/pipe"`.
             * @default "minecraft:empty"
             */
            target_pool: string;
        }
        /**
         * **Lectern** with `ID = 37`.
         */
        interface LecternBlockEntity extends IBlockEntity {
            id: "Lectern";
            /**
             * Standing book item, tag determines book placement.
             */
            book?: Item<ItemWritableBookTag>;
            /**
             * If book is placed, observer detects changed block.
             */
            hasBook?: boolean;
            /**
             * Index of page opened on lectern, redstone comparator obtains power `page / totalPages * 15`.
             */
            page?: number;
            /**
             * Total pages counted in {@link book}.
             */
            totalPages?: number;
        }
        /**
         * **BlastFurnace** (Blast Furnace) with `ID = 38`.
         */
        interface BlastFurnaceBlockEntity extends IFurnaceBlockEntity {
            id: "BlastFurnace";
        }
        /**
         * **Smoker** with `ID = 39`.
         */
        interface SmokerBlockEntity extends IFurnaceBlockEntity {
            id: "Smoker";
        }
        /**
         * **Bell** with `ID = 40`.
         */
        interface BellBlockEntity extends IBlockEntity {
            id: "Bell";
            /**
             * There is 2 surface (such as `1`), 4 on side and 1 at top (`255`) locations.
             */
            Direction: number;
            /**
             * Whether sound is playing.
             */
            Ringing: boolean;
            /**
             * Ringing counter, determines animation of bell.
             */
            Ticks: number;
        }
        /**
         * **Campfire** (Campfire / Soul Campfire) with `ID = 41`.
         */
        interface CampfireBlockEntity extends IBlockEntity {
            id: "Campfire";
            /**
             * Ticks counter of smelting item.
             * @default 0
             */
            ItemTime1: number;
            /**
             * Item that will be smelted on campfire.
             */
            Item1?: Item;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.ItemTime1}
             */
            ItemTime2: number;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.Item1}
             */
            Item2?: Item;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.ItemTime1}
             */
            ItemTime3: number;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.Item1}
             */
            Item3?: Item;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.ItemTime1}
             */
            ItemTime4: number;
            /**
             * {@inheritDoc NBT.Templates.CampfireBlockEntity.Item1}
             */
            Item4?: Item;
        }
        /**
         * **Barrel** with `ID = 42`.
         */
        interface BarrelBlockEntity extends ILootableBlockEntity {
            id: "Barrel";
        }
        /**
         * **Beehive** (Beehive / Bee Nest) with `ID = 43`.
         */
        interface BeehiveBlockEntity extends IBlockEntity {
            id: "Beehive";
            /**
             * Naturally generated beehives summon bees inside, before player encounters them.
             * @default false
             */
            ShouldSpawnBees: boolean;
            /**
             * Bees. Theoretically, any entity may enter and leave onto beehive.
             */
            Occupants?: BeehiveBlockEntityOccupant[];
        }
        interface BeehiveBlockEntityOccupant extends Scriptable {
            /**
             * Typed entity identifier with tags, such as `"minecraft:bee<>"`.
             */
            ActorIdentifier: string;
            /**
             * Entity NBTs; properties, attributes, definitions, etc.
             */
            SaveData: Entity;
            /**
             * Countdown before entity left beehive in ticks.
             */
            TicksLeftToStay: number;
        }
        /**
         * **Lodestone** with `ID = 44`.
         */
        interface LodestoneBlockEntity extends IBlockEntity {
            id: "Lodestone";
            /**
             * Compass points to this lodestone.
             */
            trackingHandle: boolean;
        }
    }
}
/**
 * Interface providing access to native tile entities such as chests, hoppers, furnaces,
 * smelters, etc.
 * See full list of supported native tile entities in the {@link ETileEntityType} enum.
 */
declare interface NativeTileEntity {
    /**
     * @returns NativeTileEntity type constant, one of the {@link ETileEntityType}
     * constants.
     */
    getType(): number;
    /**
     * @returns Slots count for the specified NativeTileEntity.
     */
    getSize(): number;
    /**
     * @param slot slot number
     * @returns Item instance in the specified slot of item TE.
     */
    getSlot(slot: number): ItemInstance;
    /**
     * Sets the contents of a native tile entity's slot.
     * @param slot slot number
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra data
     */
    setSlot(slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Sets the contents of a native tile entity's slot.
     * @param slot slot number
     * @param item item information
     */
    setSlot(slot: number, item: ItemInstance): void;
    /**
     * @returns CompoundTag associated with specified native tile entity.
     * @since 2.0.5b44
     */
    getCompoundTag(): NBT.CompoundTag;
    /**
     * Sets compound tag for the specified tile entity.
     * @since 2.0.5b44
     */
    setCompoundTag(tag: NBT.CompoundTag): void;
}
/**
 * Module containing enums that can make user code more readable.
 * @deprecated Consider specified sub-enum to determine which
 * rellocation must be used.
 */
declare namespace Native {
    /**
     * Defines armor type and armor slot index in player's inventory.
     * @deprecated Use {@link EArmorType} instead.
     */
    enum ArmorType {
        boots = 3,
        chestplate = 1,
        helmet = 0,
        leggings = 2
    }
    /**
     * Defines item category in creative inventory.
     * @deprecated Use {@link EItemCategory} instead.
     */
    enum ItemCategory {
        DECORATION = 2,
        FOOD = 4,
        INTERNAL = 0,
        MATERIAL = 1,
        TOOL = 3
    }
    /**
     * Defines all existing vanilla particles.
     * @deprecated Use {@link EParticleType} instead.
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
        waterWake = 31
    }
    /**
     * Defines text colors and font styles for chat and tip messages.
     * @deprecated Use {@link EColor} instead.
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
        YELLOW = "§e"
    }
    /**
     * Defines all vanilla entity type IDs.
     * @deprecated Use {@link EEntityType} instead.
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
        ZOMBIE_VILLAGE_V2 = 116
    }
    /**
     * Defines vanilla mob render types.
     * @deprecated Use {@link EMobRenderType} instead.
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
        zombiePigman = 15
    }
    /**
     * Defines vanilla potion effects.
     * @deprecated Use {@link EPotionEffect} instead.
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
        wither = 20
    }
    /**
     * Defines the three dimensions currently available for player.
     * @deprecated Use {@link EDimension} instead.
     */
    enum Dimension {
        END = 2,
        NETHER = 1,
        NORMAL = 0
    }
    /**
     * Defines item animation types.
     * @deprecated Use {@link EItemAnimation} instead.
     */
    enum ItemAnimation {
        bow = 4,
        normal = 0
    }
    /**
     * Defines numeric representation for each block side.
     * @deprecated Use {@link EBlockSide} instead.
     */
    enum BlockSide {
        DOWN = 0,
        EAST = 5,
        NORTH = 2,
        SOUTH = 3,
        UP = 1,
        WEST = 4
    }
    /**
     * Defines numeric IDs of all vanilla enchantments.
     * @deprecated Use {@link EEnchantment} instead.
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
        VANISHING_CURSE = 28
    }
    /**
     * Defines what enchantments can or cannot be applied to every
     * instrument type.
     * @deprecated Use {@link EEnchantType} instead.
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
        weapon = 16
    }
    /**
     * Defines possible render layers (display methods) for blocks.
     * @deprecated Use {@link EBlockRenderLayer} instead.
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
        water = 7
    }
    /**
     * Defines possible game difficulty.
     * @deprecated Use {@link EGameDifficulty} instead.
     */
    enum GameDifficulty {
        PEACEFUL = 0,
        EASY = 1,
        NORMAL = 2,
        HARD = 3
    }
    /**
     * Defines possible game modes.
     * @deprecated Use {@link EGameMode} instead.
     */
    enum GameMode {
        SURVIVAL = 0,
        CREATIVE = 1,
        ADVENTURE = 2,
        SPECTATOR = 3
    }
    /**
     * Defines player's abilities.
     * @deprecated Use {@link EPlayerAbility} instead.
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
    /**
     * @deprecated Use {@link ETileEntityType} instead.
     */
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
    /**
     * @deprecated Use {@link ENbtDataType} instead.
     */
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
 * @since 2.2.1b85
 */
declare namespace ModPack {
    /**
     * Crutch to replace ModPackManifest.DeclaredDirectoryType enum:
     * + 0 - RESOURCE
     * + 1 - USER_DATA
     * + 2 - CONFIG
     * + 3 - CACHE
     * + 4 - INVALID
     */
    type ModPackDeclaredDirectoryType = number;
    /**
     * Crutch to replace ModPackDirectory.DirectoryType enum:
     * + 0 - MODS
     * + 1 - MOD_ASSETS
     * + 2 - ENGINE
     * + 3 - CONFIG
     * + 4 - CACHE
     * + 5 - RESOURCE_PACKS
     * + 6 - BEHAVIOR_PACKS
     * + 7 - TEXTURE_PACKS
     * + 8 - CUSTOM
     */
    type ModPackDirectoryType = number;
    interface ModPack {
        addDirectory(directory: ModPackDirectory): ModPack;
        getRootDirectory(): java.io.File;
        getManifestFile(): java.io.File;
        getIconFile(): java.io.File;
        /**
         * @since 2.3.1b116
         */
        getExternalServersFile(): java.io.File;
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
     * Interface representing ModPack.
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
declare namespace Mod {
    /**
     * + 0 - RELEASE
     * + 1 - DEVELOP
     */
    type BuildType = number;
    /**
     * + 0 - RESOURCE
     * + 1 - GUI
     */
    type ResourceDirType = number;
    /**
     * + 0 - PRELOADER
     * + 1 - LAUNCHER
     * + 2 - MOD
     * + 3 - CUSTOM
     * + 4 - LIBRARY
     */
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
        /**
         * @since 2.2.1b85
         */
        setModPackAndLocation(pack: ModPack.ModPack, locationName: string): void;
        /**
         * @since 2.2.1b85
         */
        getModPack(): ModPack.ModPack;
        /**
         * @since 2.2.1b85
         */
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
        getInfoProperty(name: string): string;
        RunPreloaderScripts(): void;
        RunLauncherScripts(): void;
        RunMod(additionalScope: any): void;
        configureMultiplayer(name: string, version: string, isClientOnly: boolean): void;
        runCustomSource(name: string, additionalScope: any): void;
        /**
         * Other methods and properties.
         */
        [key: string]: any
    }
}
/**
 * Module used to share mods' APIs.
 */
declare namespace ModAPI {
    /**
     * Registers new API for the mod and invokes mod API callback.
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
     * Gets API by it's name. The best approach is to call this method in the
     * function passed as the second parameter of {@link ModAPI.addAPICallback}.
     * @param name API name
     * @returns API object if an API with specified was previously registered,
     * `null` otherwise.
     * @example
     * Importing API registered by IndustrialCraft PE:
     * ```ts
     * let ICore = null;
     * ModAPI.addAPICallback("ICore", api => (ICore = api));
     * ```
     * When using ICore variable from the example, be sure to check it for `null`
     * because Industrial Craft PE may not be installed on the user's phone.
     */
    function requireAPI(name: string): Nullable<object>;
    /**
     * Executes string in Core Engine's global context. Can be used to get
     * functions and objects directly from Adapted Script.
     * @param name string to be executed in Core Engine's global context
     * @returns `null` if execution failed or appropriate variable same.
     */
    function requireGlobal(name: string): any;
    /**
     * @param name API name
     * @returns Documentation for the specified mod API.
     * @deprecated Writing documentation that way is not better.
     */
    function requireAPIdoc(name: string): ModDocumentation;
    /**
     * Fetches information about the method or property of mod API.
     * @param name API name
     * @param prop property or method name
     * @returns String description of the method or null if no description was
     * provided by API vendor.
     * @deprecated Writing documentation that way is not better.
     */
    function requireAPIPropertyDoc(name: string, prop: string): Nullable<string>;
    /**
     * @deprecated No longer supported.
     */
    function getModByName(modName: string): void;
    /**
     * @deprecated No longer supported.
     */
    function isModLoaded(modName: string): void;
    /**
     * Adds callback for the specified mod API.
     * @param apiName API name
     * @param func callback that is called when API is loaded
     */
    function addAPICallback(apiName: string, func: (
        /**
         * @param api shared mod API
         */
        api: object
    ) => void): void;
    /**
     * @deprecated No longer supported.
     */
    function addModCallback(modName: string, func: any): void;
    /**
     * @deprecated No longer supported.
     */
    function getModList(): void;
    /**
     * @deprecated No longer supported.
     */
    function getModPEList(): void;
    /**
     * @deprecated No longer supported.
     */
    function addTexturePack(path: any): void;
    /**
     * Recursively copies (duplicates) the value to the new one.
     * @param api an object to be copied
     * @param deep if `true`, copies the object recursively
     * @returns A copy of the object.
     */
    function cloneAPI<T>(api: T, deep?: boolean): T;
    /**
     * Ensures target object has all the properties the source object has, if
     * not, copies them from source to target object.
     * @param source object to copy missing values from
     * @param target object to copy missing values to
     */
    function inheritPrototypes<K extends object, T extends object>
        (source: K, target: T): K & T;
    /**
     * Recursively clones object to the new one counting call depth and
     * interrupting copying after 7th recursion call.
     * @param source an object to be cloned
     * @param deep if `true`, copies the object recursively
     * @param rec current recursion state, if > 6, recursion stops; default
     * value is 0
     * @returns Cloned object, all the properties that are less then then 8 in
     * depth, get copied.
     */
    function cloneObject<T extends object>(source: T, deep?: boolean, rec?: number): T;
    /**
     * Same as {@link ModAPI.cloneObject}, but if call depth is more then
     * 6, inserts `"stackoverflow"` string value otherwise.
     */
    function debugCloneObject<T>(source: T, deep?: boolean, rec?: number): T | string;
    /**
     * Objects used to represent mod API documentation.
     * @deprecated Writing documentation that way is not better.
     */
    interface ModDocumentation {
        /**
         * Full name of the API.
         */
        name: string,
        /**
         * Object containing descriptions of methods and properties of the API,
         * where keys are methods and properties names and values are their descriptions.
         */
        props: object
    }
    /**
     * Collects registered APIs objects, use {@link ModAPI.requireAPI}
     * to directly access required instance.
     * @internal
     */
    let modAPIs: { [name: string]: { api: string, descr: { name: object, props: object } } }
}
/**
 * Module used to log messages to Inner Core and internal log.
 */
declare namespace Logger {
    /**
     * Writes message to the log, using specified log prefix.
     * @param message message to be logged
     * @param prefix prefix of the message, can be used to filter log
     * @remarks
     * It will be writed to `[<prefix>/D] <message>` as-is,
     * where prefix will be **MOD** if it not specified.
     */
    function Log(message: string, prefix?: string): void;
    /**
     * Writes debugging message to log, using specified tag.
     * @remarks
     * It will be writed to `[<tag>/D] <message>` as-is.
     * @since 2.2.0b77
     */
    function debug(tag: string, message: string): void;
    /**
     * Writes information message to log, using specified tag.
     * @remarks
     * It will be writed to `[<tag>/I] <message>` as-is.
     * @since 2.2.0b77
     */
    function info(tag: string, message: string): void;
    /**
     * Writes error message to log, using specified tag.
     * If it writed before game startup finish, debugging
     * log with all messages will appear.
     * @remarks
     * It will be writed to `[<tag>/E] <message>` as-is.
     * If error also provided, it will be appended with
     * same tag above error message.
     * @since 2.2.0b77
     */
    function error(tag: string, message: string, error?: java.lang.Throwable): void;
    /**
     * Logs java Throwable with full stack trace to.
     * @param error java Throwable to be logged
     */
    function LogError(error: java.lang.Throwable): void;
    /**
     * Writes logger content to file and clears all buffers.
     */
    function Flush(): void;
}
declare namespace LiquidRegistry {
    function registerLiquid(key: string, name: string, uiTextures: string[], modelTextures?: string[]): void;
    function getLiquidData(key: string): any;
    function isExists(key: string): boolean;
    function getLiquidName(key: string): string;
    function getLiquidUITexture(key: string, width: number, height: number): string;
    function getLiquidUIBitmap(key: string, width: number, height: number): android.graphics.Bitmap;
    function registerBlock(liquid: string, blockId: number, isDynamic: boolean): void;
    function registerItem(liquid: string, empty: { id: number, data: number }, full: { id: number, data: number }): void;
    function getEmptyItem(id: number, data: number): { id: number, data: number, liquid: string };
    function getItemLiquid(id: number, data: number): string;
    function getFullItem(id: number, data: number, liquid: string): { id: number, data: number };
    class Storage {
        liquidAmounts: { [key: string]: number };
        liquidLimits: { [key: string]: number };
        tileEntity: TileEntity;
        constructor(tileEntity: TileEntity);
        setParent(tileEntity: TileEntity): void;
        getParent(): TileEntity;
        hasDataFor(liquid: string): boolean;
        setLimit(liquid: Nullable<string>, limit: number): void;
        getLimit(liquid: string): number;
        getAmount(liquid: string): number;
        getRelativeAmount(liquid: string): number;
        /**
         * @internal
         */
        _setContainerScale(container: UI.Container, scale: string, liquid: string, val: number): void;
        updateUiScale(scale: string, liquid: string, container?: UI.Container): void;
        setAmount(liquid: string, amount: number): void;
        getLiquidStored(): Nullable<string>;
        isFull(liquid?: string): boolean;
        isEmpty(liquid?: string): boolean;
        addLiquid(liquid: string, amount: number, onlyFullAmount?: boolean): number;
        getLiquid(liquid: string, amount: number, onlyFullAmount?: boolean): number;
    }
    /**
     * @returns String ID of a liquid for given block,
     * or `null`, if a block with given ID is not a liquid.
     */
    function getLiquidByBlock(id: number): Nullable<string>;
    /**
     * @param isStatic static liquid block ID will be returned, otherwise
     * the dynamic block ID will be returned
     * @returns Numeric ID of the liquid block by given {@link LiquidRegistry} string ID.
     * @remarks
     * This function will return `0` if no liquid with given string ID exists.
     */
    function getBlockByLiquid(liquidId: string, isStatic?: boolean): number;
}
/**
 * Namespace used to change item models in player's hand and/or inventory.
 * By default, if the block has an {@link ICRender}, it is automatically applied as item's model.
 * @since 2.0.2b20
 */
declare namespace ItemModel {
    /**
     * Gets {@link ItemModel} object for the specified ID and data.
     * @param id item or block ID
     * @param data item or block data
     * @returns Exist {@link ItemModel} object used to manipulate item's model.
     */
	function getFor(id: number, data: number): ItemModel;
    /**
     * Run it at start of your mod to create new group, it will
     * be applied to all models, created at the root of your mod
     * (including default mod).
     * @remarks
     * If specified version does not match cache version, whole
     * group will be re-created.
     * @since 2.1.0b56
     */
	function setCurrentCacheGroup(mod: string, version: string): void;
    /**
     * Gets {@link ItemModel} object for the specified ID and data. If no {@link ItemModel} for
     * specified data exist, uses default data `0`.
     * @returns Any {@link ItemModel} object used to manipulate item's model.
     */
    function getForWithFallback(id: number, data: number): ItemModel;
    /**
     * Creates a new standalone item model that is not connected with any item or block,
     * should be used in {@link ItemModel.setModelOverrideCallback}.
     * @since 2.0.5b45
     */
    function newStandalone(): ItemModel;
    /**
     * @returns A collection of all existing item models.
     */
    function getAllModels(): java.util.Collection<ItemModel>;
    /**
     * Releases some of the bitmaps to free up memory
     * by run garbage cleaner.
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
     * @returns Empty {@link RenderMesh} from the pool or creates an empty one. Used
     * to reduce constructors/destructors calls.
     */
    function getEmptyMeshFromPool(): RenderMesh;
    /**
     * Releases {@link RenderMesh} and returns it to the pool. Used to reduce
     * constructors/destructors calls.
     */
    function releaseMesh(mesh: RenderMesh): void;
    /**
     * @param randomize if true, item mesh position is randomized
     * @returns New {@link RenderMesh} generated for specified item.
     */
    function getItemRenderMeshFor(id: number, count: number, data: number, randomize: boolean): RenderMesh;
    /**
     * @param id item or block numeric ID
     * @param data item or block data
     * @returns Texture name for the specified item or block.
     */
    function getItemMeshTextureFor(id: number, data: number): string;
}
/**
 * Class representing item model in player's hand and/or inventory. To get an instance of this
 * class from your code, use {@link ItemModel.getFor} static function.
 * @remarks
 * The coordinates of the full block in player's hand or inventory is
 * (0, 0, 0), (1, 1, 1), so it is generally recommended to use the models
 * that fit that bound at least for the inventory.
 * @since 2.0.2b20
 */
declare interface ItemModel {
    /**
     * Item or block ID current {@link ItemModel} relates to.
     */
    readonly id: number;
    /**
     * Item or block data current {@link ItemModel} relates to.
     */
    readonly data: number;
    occupy(): ItemModel;
    isSpriteInUi(): boolean;
    isEmptyInUi(): boolean;
    isSpriteInWorld(): boolean;
    isEmptyInWorld(): boolean;
    /**
     * @returns `true`, if the model is empty.
     */
    isEmpty(): boolean;
    isNonExistant(): boolean;
    /**
     * @returns `true`, if this item model overrides the default model in player's hand.
     */
    overridesHand(): boolean;
    /**
     * @returns `true`, if this item model overrides the default model in player's inventory.
     */
    overridesUi(): boolean;
    getShaderUniforms(): ShaderUniformSet;
    setSpriteUiRender(isSprite: boolean): ItemModel;
    /**
     * Sets item's model to display both in the inventory and in hand.
     * @param model {@link RenderMesh}, {@link ICRender.Model} or {@link BlockRenderer.Model} to be used as item model
     * @param texture texture name to be used for the model (use `"atlas::terrain"` for block textures)
     * @param material material name to be used for the model
     */
    setModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;
    /**
     * Sets item's model to display only in player's hand.
     * @param model {@link RenderMesh}, {@link ICRender.Model} or {@link BlockRenderer.Model} to be used as item model
     * @param texture texture name to be used for the model (use `"atlas::terrain"` for block textures)
     * @param material material name to be used for the model
     */
    setHandModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;
    /**
     * Sets item's model to display only in player's inventory.
     * @param model {@link RenderMesh}, {@link ICRender.Model} or {@link BlockRenderer.Model} to be used as item model
     * @param texture texture name to be used for the model (use `"atlas::terrain"` for block textures)
     * @param material material name to be used for the model
     */
    setUiModel(model: RenderMesh | ICRender.Model | BlockRenderer.Model, texture?: string, material?: string): ItemModel;
    /**
     * Sets item model's texture in both player's inventory and in hand.
     * @param texture texture name to be used for the model (use `"atlas::terrain"` for block textures)
     */
    setTexture(texture: string): ItemModel;
    /**
     * Sets item model's texture only in player's hand.
     * @param texture texture name to be used for the model (use `"atlas::terrain"` for block textures)
     */
    setHandTexture(texture: string): ItemModel;
    /**
     * Sets item model's texture only in player's inventory.
     * @param texture texture name to be used for the model (use `"atlas::terrain" `for block textures)
     */
    setUiTexture(texture: string): ItemModel;
    /**
     * Sets item model's material in both player's inventory and in hand.
     * @param texture material name to be used for the model.
     */
    setMaterial(texture: string): ItemModel;
    /**
     * Sets item model's material only in player's hand.
     * @param texture material name to be used for the model
     */
    setHandMaterial(texture: string): ItemModel;
    /**
     * Sets item model's material only in player's inventory.
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
    /**
     * @since 2.0.5b45
     */
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
 * Class representing item extra data. Used to store additional information
 * about item other then just item ID and data.
 */
declare class ItemExtraData extends com.zhekasmirnov.innercore.api.NativeItemInstanceExtra {
	static class: java.lang.Class<ItemExtraData>;
	/**
	 * Creates an empty {@link ItemExtraData} instance.
	 */
	constructor();
	/**
	 * Creates a copy of current {@link ItemExtraData} instance with the same contents.
	 */
	constructor(extraData?: ItemExtraData);
}
/**
 * Backwards compatibility.
 */
declare type TransferPolicy = com.zhekasmirnov.apparatus.api.container.ItemContainerFuncs.TransferPolicy;
/**
 * Type of TileEntity container that supports multiplayer.
 */
declare class ItemContainer extends com.zhekasmirnov.apparatus.api.container.ItemContainer {
	static class: java.lang.Class<ItemContainer>;
	/**
	 * Constructs a new {@link ItemContainer} object.
	 */
	constructor();
	/**
	 * Constructs a new {@link ItemContainer} object from given deprecated {@link UI.Container} object.
	 */
	constructor(legacyContainer: UI.Container);
}
declare class ItemContainerSlot extends com.zhekasmirnov.apparatus.api.container.ItemContainerSlot {}
/**
 * Module used to define items and their properties.
 */
declare namespace Item {
    /**
     * @param id string ID of the item
     * @returns Item numeric ID by it's string ID or just returns it's numeric ID
     * if input was a numeric ID.
     */
    function getNumericId(id: string | number): number;
    /**
     * Gets NativeItem instance that can be used to apply some properties to the
     * item.
     * @param id string ID of the item
     * @returns NativeItem instance associated with this item.
     */
    function getItemById(id: string): NativeItem;
    /**
     * Object used in {@link Item.createItem} and {@link Item.createThrowableItem}
     * methods to specify general item parameters.
     */
    interface ItemParams {
        /**
         * Maximum item in stack size.
         * @default 64
         */
        stack?: number;
        /**
         * If true, the item will not be added to creative.
         * @default false
         */
        isTech?: boolean;
        /**
         * @since 2.2.0b76
         */
        category?: number;
    }
    /**
     * Creates new item using specified parameters.
     * @param nameID string ID of the item; you should register it via
     * {@link IDRegistry.genItemID} call first
     * @param name item name in English; add translations to the name using
     * {@link Translation} module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     */
    function createItem(nameID: string, name: string, texture: TextureData, params?: ItemParams): NativeItem;
    /**
     * Object used in {@link Item.createFoodItem} method
     * to specify general food item parameters.
     */
    interface FoodParams extends ItemParams {
        /**
         * Amount of hunger restored by this food in halfs.
         * @default 1 // 0.5 hunger unit
         */
        food?: number;
    }
    /**
     * Creates eatable item using specified parameters.
     * @param nameID string ID of the item. You should register it via
     * {@link IDRegistry.genItemID} call first
     * @param name item name in English; add translations to the name using
     * {@link Translation} module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     */
    function createFoodItem(nameID: string, name: string, texture: TextureData, params?: FoodParams): NativeItem;
    /**
     * @deprecated Use {@link Item.createItem} and {@link Recipes.addFurnaceFuel}
     * instead.
     * @throws Unsupported usage.
     */
    function createFuelItem(nameID: string, name: string, texture: TextureData, params?: ItemParams): void;
    /**
     * Object used in {@link Item.createArmorItem} method
     * to specify general armor item parameters.
     */
    interface ArmorParams {
        /**
         * If `true`, the item will not be added to creative.
         * @default false
         */
        isTech?: boolean,
        /**
         * Armor durability, the more it is, the more hits the armor will resist.
         * @default 1
         */
        durability?: number,
        /**
         * Armor protection.
         * @default 0
         */
        armor?: number,
        /**
         * Relative path to the armor model texture from the mod assets directory.
         * @default "textures/logo.png"
         */
        texture?: string,
        /**
         * Armor type, should be one of the `helmet`, `chestplate`, `leggings` or `boots`.
         */
        type: ArmorType,
        /**
         * Knockback resistance, that the player will have when wearing the following armor.
         * It must be value from 0 (no knockback resistance) to 1 (full knockback resistance).
         * @default 0
         */
        knockbackResist?: number;
    }
    /**
     * Creates armor item using specified parameters.
     * @param nameID string ID of the item; you should register it via
     * {@link IDRegistry.genItemID} call first
     * @param name item name in English; add translations to the name using
     * {@link Translation} module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params general armor item parameters object, the armor type there is required
     */
    function createArmorItem(nameID: string, name: string, texture: TextureData, params: ArmorParams): NativeItem;
    /**
     * Creates throwable item using specified parameters.
     * @param nameID string ID of the item; you should register it via
     * {@link IDRegistry.genItemID} call first
     * @param name item name in English; add translations to the name using
     * {@link Translation} module, all translation to the item and block names are
     * applied automatically
     * @param texture texture data used to create item
     * @param params additional item parameters
     */
    function createThrowableItem(nameID: string, name: string, texture: TextureData, params?: ItemParams): NativeItem;
    /**
     * @param id numeric item ID
     * @returns `true` if given item is vanilla item, `false` otherwise.
     */
    function isNativeItem(id: number): boolean;
    /**
     * @param id numeric item ID
     * @returns Maximum damage value for the specified item.
     */
    function getMaxDamage(id: number): number;
    /**
     * @param id numeric item ID
     * @returns Maximum stack size for the specified item.
     */
    function getMaxStack(id: number): number;
    /**
     * @param id numeric item ID
     * @param data item data
     * @returns Current item name.
     */
    function getName(id: number, data: number): string;
    /**
     * @param id numeric item ID
     * @param data item data
     * @param encode no longer supported, do not use this parameter
     * @returns Current item name.
     * @deprecated Use same method without last parameter.
     */
    function getName(id: number, data: number, encode: any): string;
    /**
     * Natural armor points, that also is displayed above hotbar.
     * @param id numeric item ID
     * @returns Natural armor half points.
     * @since 2.4.0b119
     */
    function getArmorValue(id: number): number;
    /**
     * @param id numeric item ID
     * @returns `true`, if an item with such ID exists, `false` otherwise.
     */
    function isValid(id: number): boolean;
    /**
     * @param id numeric item ID
     * @param data no longer supported, do not use this parameter
     * @returns `true`, if an item with such ID exists, `false` otherwise.
     * @deprecated Use same method without last parameter.
     */
    function isValid(id: number, data: number): boolean;
    /**
     * Adds item to creative inventory.
     * @param id string or numeric item ID
     * @param count amount of the item to be added, generally should be 1
     * @param data item data
     */
    function addToCreative(id: number | string, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Creates group of creative items.
     * @param name name of group
     * @param displayedName name of group in game
     * @param ids array of items in group
     */
    function addCreativeGroup(name: string, displayedName: string, ids: number[]): void
    /**
     * Applies several properties via one method call.
     * @param numericID numeric item ID
     * @deprecated Consider using appropriate setters instead.
     */
    function describeItem(numericID: number, description: object): void;
    /**
     * Sets item creative category.
     * @param id string or numeric item ID
     * @param category item category, should be one of the
     * {@link EItemCategory} values
     */
    function setCategory(id: number | string, category: number): void;
    /**
     * Specifies how the item can be enchanted.
     * @param id string or numeric item ID
     * @param enchant enchant type defining when enchants can or cannot be
     * applied to this item, one of the {@link EEnchantType}
     * @param value quality of the enchants that are applied, the higher this
     * value is, the better enchants you get with the same level
     */
    function setEnchantType(id: number | string, enchant: number, value: number): void;
    /**
     * Specifies what items can be used to repair this item in the anvil.
     * @param id string or numeric item ID
     * @param items array of numeric item IDs to be used as repair items
     */
    function addRepairItemIds(id: number | string, items: number[]): void;
    /**
     * Specifies how the player should hold the item.
     * @param id string or numeric item ID
     * @param enabled if true, player holds the item as a tool, not as a simple
     * item
     */
    function setToolRender(id: number | string, enabled: boolean): void;
    /**
     * Sets item maximum data value.
     * @param id string or numeric item ID
     * @param maxdamage maximum data value for the item
     */
    function setMaxDamage(id: number | string, maxdamage: number): void;
    /**
     * Sets item as glint (like enchanted tools or golden apple).
     * @param id string or numeric item ID
     * @param enabled if true, the item will be displayed as glint item
     */
    function setGlint(id: number | string, enabled: boolean): void;
    /**
     * Allows to click with item on liquid blocks.
     * @param id string or numeric item ID
     * @param enabled if true, liquid blocks can be selected on click
     */
    function setLiquidClip(id: number | string, enabled: boolean): void;
    function setArmorDamageable(damageable: boolean): void;
    /**
     * @deprecated No longer supported.
     */
    function setStackedByData(id: number | string, enabled: boolean): void;
    /**
     * Allows item to be put in offhand slot.
     * @param id string or numeric item ID
     * @since 2.0.4b35
     */
    function setAllowedInOffhand(id: number | string, allowed: boolean): void;
    /**
     *
     * @param id
     * @param should
     * @since 2.4.0b119
     */
    function setShouldDespawn(id: number | string, should: boolean): void;
    /**
     *
     * @param id
     * @param resistant
     * @since 2.4.0b119
     */
    function setFireResistant(id: number | string, resistant: boolean): void;
    /**
     *
     * @param id
     * @param explodable
     * @since 2.4.0b119
     */
    function setExplodable(id: number | string, explodable: boolean): void;
    /**
     * Sets additional properties for the item, uses Minecraft mechanisms to
     * set them. Full list of properties is currently unavailable.
     * @param id string or numeric item ID
     * @param props JSON string containing some of the properties
     */
    function setProperties(id: number | string, props: string): void;
    /**
     * Sets animation type for the item.
     * @param id string or numeric item ID
     * @param animType use animation type, one of the {@link EItemAnimation}
     * values
     */
    function setUseAnimation(id: number | string, animType: number): void;
    /**
     * Limits maximum use duration. This is useful to create such items as bows.
     * @param id string or numeric item ID
     * @param duration maximum use duration in ticks
     */
    function setMaxUseDuration(id: number | string, duration: number): void;
    /**
     * Same as {@link Item.registerUseFunction}, but supports numeric IDs only.
     */
    function registerUseFunctionForID(numericID: number, useFunc: Callback.ItemUseLocalFunction): void;
    /**
     * Registers function that is called when user touches some block in the
     * world with specified item.
     * @param nameID string or numeric ID of the item
     * @param useFunc function that is called when such an event occurs
     */
    function registerUseFunction(nameID: string | number, useFunc: Callback.ItemUseLocalFunction): void;
    /**
     * Same as {@link Item.registerThrowableFunction}, but supports numeric IDs only.
     */
    function registerThrowableFunctionForID(numericID: number, useFunc: Callback.ProjectileHitFunction): void;
    /**
     * Registers function that is called when throwable item with specified ID
     * hits block or entity.
     * @param nameID string or numeric ID of the item
     * @param useFunc function that is called when such an event occurs
     */
    function registerThrowableFunction(nameID: string | number, useFunc: Callback.ProjectileHitFunction): void;
    /**
     * Registers item ID as requiring item icon override and registers function
     * to perform such an override.
     * @param nameID string or numeric ID of the item
     * @param func function that is called to override item icon. Should return
     * {@link Item.TextureData} object to be used for the item. See
     * {@link Callback.ItemIconOverrideFunction} documentation for details
     */
    function registerIconOverrideFunction(nameID: string | number, func: Callback.ItemIconOverrideFunction): void;
    /**
     * Registers function to perform item name override.
     * @param nameID string or numeric ID of the item
     * @param func function that is called to override item name. Should return
     * string to be used as new item name
     */
    function registerNameOverrideFunction(nameID: string | number, func: Callback.ItemNameOverrideFunction): void;
    /**
     * Registers function to be called when player uses item in the air (not on
     * the block).
     * @param nameID string or numeric ID of the item
     * @param func function that is called when such an event occurs
     */
    function registerNoTargetUseFunction(nameID: string | number, func: Callback.ItemUseNoTargetFunction): void;
    /**
     * Registers function to be called when player doesn't complete using item
     * that has maximum use time set with {@link Item.setMaxUseDuration} function.
     * Vanilla bow uses this function with max use duration of 72000 ticks.
     * @param nameID string or numeric ID of the item
     * @param func function that is called when such an event occurs
     */
    function registerUsingReleasedFunction(nameID: string | number, func: Callback.ItemUsingReleasedFunction): void;
    /**
     * Registers function to be called when player completes using item
     * that has maximum use time set with {@link Item.setMaxUseDuration} function.
     * @param nameID string or numeric ID of the item
     * @param func function that is called when such an event occurs
     */
    function registerUsingCompleteFunction(nameID: string | number, func: Callback.ItemUsingCompleteFunction): void;
    /**
     * Registers function to be called when item is dispensed from dispenser.
     * @param nameID string or numeric ID of the item
     * @param func function that is called when such an event occurs
     */
    function registerDispenseFunction(nameID: string | number, func: Callback.ItemDispensedFunction): void;
    /**
     * @deprecated Should not be used in new mods, consider using {@link Item}
     * properties setters instead.
     */
    function setPrototype(nameID: any, prototype: any): void;
    /**
     * Invoke click on the block in world.
     * @param coords coords of click on the block
     * @param item item which used on the block
     * @param noModCallback if `true`, mod ItemUse callback will be not executed
     * @param entity player which clicked on the block
     * @internal
     */
    function invokeItemUseOn(coords: Callback.ItemUseCoordinates, item: ItemInstance, noModCallback: boolean, entity: number): void;
    /**
     * Invoke click on the block in world without target.
     * @param item item which used on the block
     * @param noModCallback if `true`, mod ItemUse callback will be not executed
     * @internal
     */
    function invokeItemUseNoTarget(item: ItemInstance, noModCallback: boolean): void;
    /**
     * Class representing item used to set it's properties.
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
        setProperties(props: string): void;
        setStackedByData(stacked: boolean): void;
        setUseAnimation(animation: number): void;
    }
    /**
     * Represents item texture data. For example, if *\/items-opaque* folder
     * contains file *nugget_iron_0.png*, you should pass `"nugget_iron"` as
     * texture name and `0` as texture index. *_N* suffix can be omitted, but it is
     * generally not recommended.
     */
    interface TextureData {
        /**
         * Texture name, name of the file stored in the *\/items-opaque* asset
         * folder without extension and *_N* suffixes.
         */
        name: string,
        /**
         * Texture index defined by *_N* texture suffix.
         * @default 0
         */
        data?: number,
        /**
         * @deprecated Same as data, so data is preferred in all cases.
         */
        meta?: number
    }
    /**
     * All items name override functions object.
     * @internal
     */
    var nameOverrideFunctions: { [key: number]: Callback.ItemNameOverrideFunction };
    /**
     * All items icon override functions object.
     * @internal
     */
    var iconOverrideFunctions: { [key: number]: Callback.ItemIconOverrideFunction };
}
/**
 * Module used to manage item and block IDs. Items and blocks have the same
 * underlying nature, so their IDs are interchangeable. Though, the blocks are
 * defined "twice", as an item (in player's hand or inventory) and as a tile
 * (a block placed in the world).
 */
declare namespace IDRegistry {
    /**
     * Defines the numeric ID of the first user-defined item.
     */
    const ITEM_ID_OFFSET: number;
    /**
     * Defines the numeric ID of the first user-defined block.
     */
    const BLOCK_ID_OFFSET: number;
    /**
     * Defines maximum item/block ID.
     */
    const MAX_ID: number;
    /**
     * Generates a new numeric block ID.
     * @param name string block ID. Used in {@link Block} module functions and
     * in some other block-related functions. Inner Core converts it to
     * block_<name> as minecraft vanilla block ID to avoid string ID clashes
     * @returns Numeric block ID.
     */
    function genBlockID(name: string): number;
    /**
     * Generates a new numeric item ID.
     * @param name string item ID. Used in {@link Item} module functions and
     * in some other item-related functions. Inner Core converts it to
     * item_<name> as minecraft vanilla item ID to avoid string ID clashes
     * @returns Numeric item ID.
     */
    function genItemID(name: string): number;
    /**
     * Gets item or block string ID by it's numeric ID.
     * @param id numeric item or block ID
     */
    function getNameByID(id: number): string;
    /**
     * Ensures given ID is a tile ID, not a block ID. It is generally recommended
     * to use {@link Block.convertItemToBlockId} since it performs less calculations.
     * @param id block or tile ID
     * @returns Tile ID.
     */
    function ensureBlockId(id: number): number;
    /**
     * Ensures given ID is a block ID, not a tile ID. It is generally recommended
     * to use {@link Block.convertBlockToItemId} since it performs less calculations.
     * @param id block or tile ID
     * @returns Block ID.
     */
    function ensureItemId(id: number): number;
    /**
     * @param id numeric item or block ID
     * @returns `true` if item is vanilla Minecraft item, `false` otherwise.
     */
    function isVanilla(id: number): boolean;
    /**
     * Gets type of item ("block" or "item") and it's string ID in Minecraft.
     * @param id numeric item or block ID
     * @returns String in format `"type:string_id"` or
     * `"type:string_id#extra_information"`.
     */
    function getIdInfo(id: number): string;
    /**
     * Gets type of item ("block" or "item") and it's string ID in Minecraft.
     * @param id numeric item or block ID
     * @returns String in format `"type:string_id"`.
     * @since 2.2.1b94
     */
    function getStringIdAndTypeForIntegerId(id: number): string;
    /**
     * Gets type of item ("block" or "item").
     * @param id numeric item or block ID
     * @returns Represent of type.
     * @since 2.2.1b94
     */
    function getTypeForIntegerId(id: number): string;
    /**
     * Gets item string ID in Minecraft.
     * @param id numeric item or block ID
     * @returns Represent of named identifier.
     * @since 2.2.1b94
     */
    function getStringIdForIntegerId(id: number): string;
}
/**
 * Class used to define block models that depend on surrounding blocks. Some
 * examples of such blocks are wires, pipes, block structure parts, etc.
 */
declare namespace ICRender {
	/**
	 * Used to specify that the block should be present to satisfy condition.
	 */
	const MODE_INCLUDE = 0;
	/**
	 * Used to specify that the block should be absent to satisfy condition.
	 */
	const MODE_EXCLUDE = 1;
	/**
	 * @param name group name
	 * @returns Block group by it's name, if no group with specified name exist,
	 * this function creates a new one.
	 */
	function getGroup(name: string): ICRender.Group;
	/**
	 * Creates a new group with a unique name.
	 */
	function getUnnamedGroup(): ICRender.Group;
	/**
	 * Groups (of blocks) are used to determine some render conditions; e.g.,
	 * if a block exists on some relative coordinates, display some part of the
	 * model.
	 */
	interface Group {
		/**
		 * @returns Group's name.
		 */
		getName(): string,
		name: string;
		/**
		 * Adds a block to the group.
		 * @param id block ID
		 * @param data block data or -1 to use with all registered data values
		 */
		add(id: number, data: number): void
	}
	class Model {
		/**
		 * Constructs a base model that will be displayed.
		 * @param model optional model to be added without additional conditions
		 */
		constructor(model?: BlockRenderer.Model);
		/**
		 * Adds block model as an entry to the {@link ICRender}. You can then call
		 * {@link ICRender.RenderEntry.asCondition RenderEntry.asCondition} to specify when to display the entry.
		 * @returns Created {@link ICRender.RenderEntry} object.
		 */
		addEntry(model?: BlockRenderer.Model): RenderEntry;
		/**
		 * Adds render mesh as an entry to the {@link ICRender}. You can then call
		 * {@link ICRender.RenderEntry.asCondition RenderEntry.asCondition} to specify when to display the entry.
		 * @returns Created {@link ICRender.RenderEntry} object.
		 */
		addEntry(mesh?: RenderMesh): RenderEntry;
	}
	/**
	 * Object representing render entry with it's displaying condition.
	 */
	interface RenderEntry {
		/**
		 * @returns Parent {@link ICRender.Model} object this entry belongs to.
		 */
		getParent(): Model;
		/**
		 * Sets {@link ICRender.BLOCK} condition with specified parameters. Uses coordinates
		 * that are relative to current block's ones.
		 * @param group group name or object
		 * @param mode one of the {@link ICRender.MODE_INCLUDE} and {@link ICRender.MODE_EXCLUDE} constants
		 * @returns Reference to itself to be used in sequential calls.
		 */
		asCondition(x: number, y: number, z: number, group: Group | string, mode: number): RenderEntry;
		/**
		 * Sets {@link ICRender.BLOCK} condition with specified parameters. Uses coordinates
		 * that are relative to current block's ones. Creates a new anonymous
		 * group with single block.
		 * @param id condition block ID
		 * @param data condition block data
		 * @param mode one of the {@link ICRender.MODE_INCLUDE} and {@link ICRender.MODE_EXCLUDE} constants
		 * @returns Reference to itself to be used in sequential calls.
		 */
		asCondition(x: number, y: number, z: number, id: number, data: number, mode: number): RenderEntry;
		/**
		 * Sets condition to be used for current entry.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		setCondition(condition: CONDITION): RenderEntry;
		/**
		 * Sets block model used for the entry, specifying it's coordinates.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		setModel(x: number, y: number, z: number, model: BlockRenderer.Model): RenderEntry;
		/**
		 * Sets block model used for the entry.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		setModel(model: BlockRenderer.Model): RenderEntry;
		/**
		 * Sets render mesh to be used for the entry.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		setMesh(mesh: RenderMesh): RenderEntry;
	}
	/**
	 * Class representing custom collision shapes used for block.
	 */
	class CollisionShape {
		/**
		 * Adds new entry to the collision shape. You can then call
		 * {@link ICRender.CollisionEntry.setCondition CollisionEntry.setCondition} to specify when to display the entry.
		 */
		addEntry(): CollisionEntry;
	}
	/**
	 * Object representing collision shape entry with it's displaying condition.
	 */
	interface CollisionEntry {
		/**
		 * Adds new collision box to collision entry.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): CollisionEntry;
		/**
		 * Sets condition, all the boxes of the entry work only if the condition is `true`.
		 * @returns Reference to itself to be used in sequential calls.
		 */
		setCondition(condition: CONDITION): CollisionEntry;
	}
	/**
	 * Common superclass for all condition classes.
	 * @internal
	 */
	class CONDITION {
		/**
		 * @since 2.3.1b116
		 */
		constructor(ptr: number);
	}
	/**
	 * Condition depending on random value.
	 * @since 2.0.2b23
	 */
	abstract class RANDOM_CONDITION implements CONDITION {
		/**
		 * Forces engine to treat blocks along some axis in same way if enabled
		 * parameter value is `false`.
		 * @param axis 0 fpr x, 1 for y, 2 for z axis
		 */
		setAxisEnabled(axis: number, enabled: boolean): RANDOM_CONDITION;
	}
	/**
	 * Constructs new {@link ICRender.RANDOM_CONDITION} condition.
	 * @param value value that a generated random integer number should be for the
	 * condition to evaluate as true
	 * @param max maximum value for the generator
	 * @param seed seed to be used for random numbers generation
	 * @since 2.0.2b23
	 */
	function RANDOM(value: number, max: number, seed?: number): RANDOM_CONDITION;
	/**
	 * Constructs new {@link ICRender.RANDOM} condition with default seed and `0` as
	 * desired random value.
	 * @param max maximum value for the generator
	 * @since 2.0.2b23
	 */
	function RANDOM(max: number): RANDOM_CONDITION;
	/**
	 * Constructs new {@link ICRender.BLOCK} condition.
	 * @param x is relative x coordinate
	 * @param y is relative y coordinate
	 * @param z is relative z coordinate
	 * @param group blocks group to check the condition for
	 * @param exclude if true, the blocks from the group make the condition
	 * evaluate as false, as true otherwise
	 */
	function BLOCK(x: number, y: number, z: number, group: ICRender.Group, exclude: boolean): CONDITION;
	/**
	 * Constructs new {@link ICRender.NOT} condition.
	 * @param condition condition to be inverted
	 */
	function NOT(condition: CONDITION): CONDITION;
	/**
	 * Constructs new {@link ICRender.OR} condition.
	 */
	function OR(...conditions: CONDITION[]): CONDITION;
	/**
	 * Constructs new {@link ICRender.AND} condition.
	 */
	function AND(...conditions: CONDITION[]): CONDITION;
	/**
	 * Constructs new {@link ICRender.BlockState} condition that uses
	 * block state data (it must match the value) to display.
	 * @param x is relative x coordinate
	 * @param y is relative y coordinate
	 * @param z is relative z coordinate
	 * @param state one of {@link EBlockStates} values of relative block
	 * @param value value to match selected state
	 * @since 2.3.1b116
	 */
	function BlockState(x: number, y: number, z: number, state: number, value: number): CONDITION;
	/**
	 * Constructs new {@link ICRender.BlockState} condition that uses
	 * block state data (it must match the value) to display.
	 * @param state one of {@link EBlockStates} values
	 * @param value value to match selected state
	 * @since 2.3.1b116
	 */
	function BlockState(state: number, value: number): CONDITION;
}
/**
 * Method provided to log inherited Rhino class type and
 * determine which instance is used.
 * @returns Something like {@link java.lang.Class.getName}().
 * @internal
 */
declare function __debug_typecheck__(obj: any): string;
/**
 * Runs custom source in the specified context by it's name. Define custom
 * sources using *"sourceType": "custom"* for the source in your *build.config*.
 * @param name path to the executable; can be built the way built-in source
 * types are built
 * @param scope additional scope to be added to the current context
 */
declare function runCustomSource(name: string, scope?: object): void;
/**
 * Object containing custom block string IDs  as keys and their numeric
 * IDs as values.
 */
declare const BlockID: { [key: string]: number };
/**
 * Object containing custom item string IDs as keys and their numeric
 * IDs as values.
 */
declare const ItemID: { [key: string]: number };
/**
 * Module containing {@link ItemID} and {@link BlockID} values.
 * @internal
 */
declare namespace IDData {
	/**
	 * Object containing custom item string IDs as keys and their numeric
	 * IDs as values.
	 */
	const item: { [key: string]: number };
	/**
	 * Object containing custom block string IDs as keys and their numeric
	 * IDs as values.
	 */
	const block: { [key: string]: number };
}
/**
 * Same as {@link IMPORT}, consider using {@link IMPORT} instead.
 */
declare function importLib(name: string, value?: string): void;
/**
 * Imports library dependency. Libraries should be stored in the *"libraryDir"*
 * directory, specified in your *build.config*. You can either import the whole
 * library or single function/value using value parameter.
 * @param name library name specified in the library's EXPORT declaration
 * @param value name of the function or value you wish to import, or "*" to
 * import the whole library. Defaults to importing the whole library
 */
declare function IMPORT(name: string, value?: string): void;
/**
 * Injects methods from C++ into the target object to use in the mod.
 * @param name name of the module, as registered from native code
 * @param target target object, where all the methods from native module will be
 * injected
 */
declare function IMPORT_NATIVE(name: string, target: object): any;
/**
 * Allows to create new JS modules imported from C++ code and use it in the mod.
 * @param name name of the module, as registered from native code
 * @returns JS module, implemented in native (C++) code.
 */
declare function WRAP_NATIVE<T = any>(name: string): T;
/**
 * Allows to create new JS modules imported from Java code and use it in the mod.
 * @param name name of the module, as registered from Java code
 * @returns JS module, implemented in Java code.
 */
declare function WRAP_JAVA<T = any>(name: string): T;
/**
 * @returns Current Core Engine API level (12).
 */
declare function getCoreAPILevel(): number;
/**
 * Runs specified function in the main thread.
 * @param func function to be run in the main thread
 */
declare function runOnMainThread(func: () => void): void;
/**
 * Runs specified function in the client thread.
 * Same as {@link runOnMainThread}, but for the client side.
 * @param func function to be run in the client thread
 * @since 2.2.1b96
 */
declare function runOnClientThread(func: () => void): void;
/**
 * @returns Minecraft version information in several variants.
 */
declare function getMCPEVersion(): {
	/**
	 * String version representation, three dot-separated numbers.
	 * @default "1.16.201" or "1.11.4"
	 */
	str: string,
	/**
	 * Array containing three version numbers.
	 * @default [1, 16, 201] or [1, 11, 4]
	 */
	array: number[],
	/**
	 * Version number.
	 * @default 16 or 11
	 */
	main: number
};
/**
 * Displays android.widget.Toast with specified message. If this function is called
 * more then once, messages are stacked and displayed together.
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
	 * mods have the same library installed.
	 */
	name: string,
	/**
	 * Library version, used to load the latest library version
	 * if different mods have different library version installed.
	 */
	version: number,
	/**
	 * API name.
	 */
	api: "CoreEngine" | "AdaptedScript" | "PrefsWinAPI" | "Preloader",
	/**
	 * If set to `true`, the context of the library is shared between mods to
	 * allow for better integration.
	 */
	shared: boolean,
	/**
	 * List of names of libraries that should be loaded before the current library is loaded.
	 * Every entry should be either just a library name or library name and version
	 * separated by a column (":").
	 */
	dependencies?: string[]
}): void;
/**
 * Exports object from library using specified name.
 * @param name object name to be used when calling {@link IMPORT}.
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
 * Function that must be written in launcher.js to enable multiplayer configuration.
 * Client mods must not affect on the world.
 * They will not be taken into account in mod synchronization during the connection.
 */
declare function ConfigureMultiplayer(args: {
	/**
	 * Unique readable network name of the mod.
	 * @remarks
	 * Value `"auto"` here means determine *mod.info*
	 * property, which is preferred in most cases.
	 * @default "auto"
	 */
	name?: string,
	/**
	 * Mod version.
	 * @remarks
	 * Value `"auto"` here means determine *mod.info*
	 * property, which is preferred in most cases.
	 * @default "auto"
	 */
	version?: string,
	/**
	 * If `true`, mod is only client.
	 */
	isClientOnly: boolean
}): void;
/**
 * String types of armor to be specified when calling {@link Item.createArmorItem}.
 */
declare type ArmorType = "helmet" | "chestplate" | "leggings" | "boots";
/**
 * Default render templates used inside of Inner Core,
 * currently there are only default armor models.
 */
declare type DefaultRenderTemplate = ArmorType;
/**
 * Module used to simplify generation tasks in mods logic.
 */
declare namespace GenerationUtils {
    /**
     * @param id numeric tile ID
     * @returns `true` if block is solid and light blocking block, `false` otherwise.
     */
    function isTerrainBlock(id: number): boolean;
    /**
     * @param id numeric tile ID
     * @returns `true` if block is transparent, `false` otherwise.
     */
    function isTransparentBlock(id: number): boolean;
    /**
     * @returns `true`, if one can see sky from the specified position, `false`
     * otherwise.
     */
    function canSeeSky(x: number, y: number, z: number): boolean;
    /**
     * Generates random x and z coordinates inside specified chunk.
     * @param cx chunk x coordinate
     * @param cz chunk z coordinate
     */
    function randomXZ(cx: number, cz: number): { x: number, z: number };
    /**
     * Generates random coordinates inside specified chunk.
     * @param cx chunk x coordinate
     * @param cz chunk z coordinate
     * @param lowest lowest possible y coordinate. Default is 0
     * @param highest highest possible y coordinate. Default is 128
     */
    function randomCoords(cx: number, cz: number, lowest?: number, highest?: number): Vector;
    /**
     * Finds nearest to the specified y coordinate empty space on the specified
     * x and z coordinates.
     */
    function findSurface(x: number, y: number, z: number): Vector;
    /**
     * Finds nearest to y=128 coordinate empty space on the specified x and z
     * coordinates.
     */
    function findHighSurface(x: number, z: number): Vector;
    /**
     * Finds nearest to y=64 coordinate empty space on the specified x and z
     * coordinates.
     */
    function findLowSurface(x: number, z: number): Vector;
    function lockInBlock(id: number, data: number, checkerTile: any, checkerMode: any): void;
    function setLockedBlock(x: number, y: number, z: number): void;
    /**
     * Generates ore vein on the specified coordinates using specified params.
     * @param params generation params
     * @deprecated Consider using {@link GenerationUtils.generateOre} instead.
     */
    function genMinable(x: number, y: number, z: number, params: {
        /**
         * Ore tile ID.
         */
        id: number,
        /**
         * Ore data.
         */
        data: number,
        /**
         * If `true`, no check for stone is performed so the ore may be
         * generated in the air. Use this to debug ore generation in
         * the superflat worlds.
         */
        noStoneCheck?: number,
        /**
         * Amount of the ore to be generated.
         */
        amount?: number,
        /**
         * If amount is not specified, used to calculate amount.
         */
        ratio?: number,
        /**
         * If amount is not specified, used to calculate amount,
         * using simple formula `size * ratio * 3`.
         */
        size?: number
    }): void;
    /**
     * Generates ore vein on the specified coordinates.
     * @param id ore tile ID
     * @param data ore data
     * @param amount ore amount, use number at least 6 to be able to find
     * generated ore; note that amount doesn't mean blocks count, it is just an
     * input value for generation algorithm
     * @param noStoneCheck if `true`, no check for stone is performed so the ore
     * may be generated in the air. Use this to debug ore generation in the
     * superflat worlds
     * @param seed random generation seed
     */
    function generateOre(x: number, y: number, z: number, id: number, data: number, amount: number, noStoneCheck: boolean, seed?: number): void;
    /**
     * Generates ore with custom whitelist/blacklist.
     * @param mode if true, specified block IDs are used as whitelist for generation
     * (only the IDs from the list can be replaced with ores), if false - specified
     * block IDs are used as a blacklist (only the IDs from the list canNOT be
     * replaced with ores)
     * @param listOfIds array of block IDs to be used as whitelist or blacklist
     * See {@link GenerationUtils.generateOre} for details.
     * @since 2.0.1b17
     */
    function generateOreCustom(x: number, y: number, z: number, id: number, data: number, amount: number, mode: boolean, listOfIds: number[], seed?: number): void;
    /**
     * Retrieves perlin noise value at the specified coordinates.
     * @param seed integer random generator seed. If not specified or set to 0, the default
     * constant value is used
     * @param scale noise size, to set the main octave size, use *1 / octave size*
     * @param numOctaves number of octaves, the more octaves you use, the more
     * detailed is the generated noise. The next octave is two times smaller then
     * the previous one
     * @since 2.0.1b11
     */
    function getPerlinNoise(x: number, y: number, z: number, seed?: number, scale?: number, numOctaves?: number): number;
}
/**
 * Class used to create and manipulate game objects. Game objects are {@link Updatable Updatables}
 * that are being saved between game launches.
 */
declare class GameObject<T extends GameObjectPrototype> {
    /**
     * Constructs a new {@link GameObject} with given params.
     * @param type unique name for the game object type. Use package-like names to
     * ensure your game object name is unique
     * @param prototype
     */
    constructor(type: string, prototype: T);
    /**
     * Original value passed to {@link GameObject.constructor}.
     */
    readonly originalName: string;
    readonly gameobjectName: string;
    readonly isInstance: boolean;
    /**
     * `true` if current GameObject was deployed, `false` otherwise.
     */
    readonly isDeployed: boolean;
    readonly Prototype: T;
    /**
     * Creates a new game object with specified params and registers it for saving
     * and as an {@link Updatable}.
     * @param args any arguments that are passed to {@link GameObjectPrototype.init}
     * function
     * @returns Instantiated game object.
     */
    deploy(...args: any): GameObject<T>;
    /**
     * Destroys current game object.
     */
    destroy(): void;
}
interface GameObjectPrototype extends Updatable {
    /**
     * Function that is called when a new instance of {@link GameObject} is created,
     * the engine passes all the arguments of {@link GameObject.deploy} function to
     * this function.
     */
    init?: (...args: any) => void,
    /**
     * Function that is called when a {@link GameObject} is loaded.
     */
    loaded?: () => void,
    /**
     * Any other user-defined methods and properties.
     */
    [key: string]: any
}
declare namespace GameObjectRegistry {
    /**
     * Gets an array of {@link GameObject GameObjects} of specified type.
     * @param type unique {@link GameObject} type to get all the instances of
     * @param clone if true, a new array is created to ensure the original
     * engine's data safety.
     */
    function getAllByType<T extends GameObjectPrototype>(type: string, clone: boolean): GameObject<T>[];
    /**
     * Calls function of the {@link GameObject} of specified type with specified
     * parameters.
     * @param type unique {@link GameObject} type to get all the instances of
     * @param func function name as defined in {@link GameObjectPrototype} passed to
     * {@link GameObject.constructor}
     * @param params parameters to be passed to the function
     */
    function callForType(type: string, func: string, ...params: any): any;
    /**
     * Same as {@link GameObjectRegistry.callForType}, though a new array is created
     * before calling functions on the game objects to ensure the original engine's
     * data safety.
     */
    function callForTypeSafe(type: string, func: string, ...params: any): any;
}
/**
 * Methods for manipulating player with world,
 * use callbacks of callbacks in their implementation.
 * @since 2.4.0b120
 */
declare namespace GameController {
	/**
	 * @remarks Can break a block that breaks instantly.
	 */
	function startDestroyBlock(x: number, y: number, z: number, side: number): boolean;
	/**
	 * Triggers client-side "DestroyBlockContinue" and "DestroyBlockStart" (on zero progress).
	 */
	function continueDestroyBlock(x: number, y: number, z: number, side: number): boolean;
	/**
	 * Interrupts destruction animation.
	 */
	function stopDestroyBlock(x: number, y: number, z: number): void;
	/**
	 */
	function startBuildBlock(x: number, y: number, z: number, side: number): void;
	/**
	 */
	function continueBuildBlock(x: number, y: number, z: number, side: number): void;
	/**
	 */
	function stopBuildBlock(): void;
	/**
	 * Triggers server-side "BreakBlock" and "DestroyBlock" (if not prevented).
	 */
	function destroyBlock(x: number, y: number, z: number, side: number): void;
	/**
	 * Triggers server-side "BuildBlock".
	 */
	function buildBlock(x: number, y: number, z: number, side: number): void;
	/**
	 * Triggers server-side "ItemUse" and "ItemUseServer"
	 * with client-side "ItemUseLocal" and "ItemUseLocalServer".
	 */
	function onItemUse(x: number, y: number, z: number, side: number): void;
	/**
	 * Triggers server-side "PlayerAttack" and "EntityHurt".
	 */
	function attack(entityUid: number): void;
	/**
	 * Triggers server-side "EntityInteract".
	 */
	function interact(entityUid: number, x: number, y: number, z: number): void;
	/**
	 */
	function releaseUsingItem(): void;
}
/**
 * Module that provides some general game-related functions.
 */
declare namespace Game {
    /**
     * Allows you to determine whether current instance of game has
     * a client or not (clientless game requires a server core, e.g.
     * [Zote Core (GitHub)](https://github.com/reider745/zotecoreloader)).
     * @since 2.3.1b116
     */
    function isDedicatedServer(): boolean;
    /**
     * Prevents current callback function from being called in Minecraft.
     * For most callbacks it prevents default game behavior.
     */
    function prevent(): void;
    /**
     * @returns `true` if the current callback function has already been
     * prevented from being called in Minecraft using {@link Game.prevent},
     * `false `otherwise.
     */
    function isActionPrevented(): boolean;
    /**
     * Writes message to the chat.
     * Message can be formatted using {@link EColor} values.
     * @param message message to be displayed
     */
    function message(message: string): void;
    /**
     * Writes message above the hot bar.
     * Message can be formatted using {@link EColor} values.
     * @param message message to be displayed
     */
    function tipMessage(message: string): void;
    /**
     * Displays {@link android.app.AlertDialog} with given message and dialog title.
     * Message can be mixed with {@link android.text.Html.fromHtml HTML-like} formatting,
     * for example `<b>I'm a bold</b><br/><i>I'm a italic</i>`.
     * @param message message to be displayed
     * @param title title before message
     */
    function dialogMessage(message: string, title: string): void;
    /**
     * Sets game difficulty, one of {@link EGameDifficulty} values.
     * @param difficulty game difficulty to be set
     */
    function setDifficulty(difficulty: number): void;
    /**
     * @returns Current game difficulty, one of the {@link EGameDifficulty} values.
     */
    function getDifficulty(): number;
    /**
     * Sets current level game mode.
     * @param gameMode new game mode, should be one of the {@link EGameMode}
     * values
     */
    function setGameMode(gameMode: number): void;
    /**
     * @returns Current level game mode, one of the {@link EGameMode} values.
     */
    function getGameMode(): number;
    /**
     * @returns String containing current Minecraft version.
     */
    function getMinecraftVersion(): string;
    /**
     * @returns String containing current Core Engine version (2.1).
     */
    function getEngineVersion(): string;
    /**
     * `true` if developer mode was enabled in Inner Core config.
     * @internal
     */
    let isDeveloperMode: boolean;
    /**
     * `true` if Inner Core config allows spending items in creative.
     * @internal
     */
    let spendItemsInCreative: boolean;
    /**
     * @returns `true` if item spending allowed (player must be in creative).
     */
    function isItemSpendingAllowed(playerUid?: number): boolean;
    /**
     * @since 2.0.4b35
     */
    function simulateBackPressed(): void;
}
/**
 * Module that provides methods to work with file system.
 */
declare namespace FileTools {
    /**
     * Defines path to mounted devices directory (e.g. *\/mnt*).
     */
    const mntdir: string;
    /**
     * Defines external user directory path with trailing slash (e.g. *\/sdcard\/*, *\/storage\/emulated\/0\/*).
     */
    const root: string;
    /**
     * Defines in-pack directory where modders alives with trailing slash (e.g. *\/storage\/emulated\/0\/games\/horizon\/packs\/Inner_Core_Test\/innercore\/mods\/*, *\/storage\/emulated\/0\/Android\/data\/com.zheka.horizon\/files\/games\/horizon\/packs\/Inner_Core_Test\/innercore\/mods\/*).
     */
    const moddir: string;
    /**
     * Creates directory by it's home-relative or absolute path, if one of the
     * parent directories doesn't exist, creates them.
     * @param dir path to the new directory
     */
    function mkdir(dir: string): void;
    /**
     * Creates Core Engine working directories.
     * @internal
     */
    function mkworkdirs(): void;
    /**
     * Converts home-relative path to absolute.
     * @param path input path
     * @returns Same string if input string is an absolute path, an absolute
     * path if input string is a home-relative path.
     */
    function getFullPath(path: string): string;
    /**
     * Verifies if specified home-relative or absolute path exists.
     * @param path path to be verified
     * @returns `true`, if specified path exists, `false` otherwise.
     */
    function isExists(path: string): boolean;
    /**
     * Writes text to the file.
     * @param file home-relative or absolute path to the file
     * @param text text to be written to the file
     * @param add if `true`, appends text to the file, overrides it otherwise
     * @default add: false
     */
    function WriteText(file: string, text: string, add?: boolean): void;
    /**
     * Reads text as-is from file, append `?.trim()` to drop trailing newlines.
     * @param file home-relative or absolute path to the file
     * @returns File contents or `null` if file does not exist or not accessible.
     */
    function ReadText(file: string): Nullable<string>;
    /**
     * Writes bitmap to PNG (lossless and transparent extension) file.
     * @param file home-relative or absolute path to the file
     * @param bitmap {@link android.graphics.Bitmap} to be written to the file
     */
    function WriteImage(file: string, bitmap: android.graphics.Bitmap): void;
    /**
     * Reads high-resolution (as-is) bitmap from file.
     * @param file home-relative or absolute path to the file
     * @returns object of the bitmap that was read from
     * file or null if file does not exist or is not accessible.
     */
    function ReadImage(file: string): Nullable<android.graphics.Bitmap>;
    /**
     * Reads string from asset by it's full name.
     * @param name asset name
     * @returns Asset contents or `null` if asset doesn't exist.
     */
    function ReadTextAsset(name: string): string;
    /**
     * Reads high-resolution (as-is) bitmap from asset by it's full name.
     * @param name asset name
     * @returns Object of the bitmap that was read from
     * asset or null, if asset doesn't exist.
     */
    function ReadImageAsset(name: string): Nullable<android.graphics.Bitmap>;
    /**
     * Reads bytes array from assets.
     * @param name asset name
     * @returns JArray of bytes read from assets or null if asset doesn't exist.
     */
    function ReadBytesAsset(name: string): native.Array<jbyte>;
    /**
     * Lists children directories for the specified path.
     * @param path home-relative or absolute path to the file
     * @returns JArray of {@link java.io.File} instances of listed directories.
     */
    function GetListOfDirs(path: string): java.io.File[];
    /**
     * Lists files in the specified directory.
     * @param path path to directory to look for files in
     * @param ext extension of the files to include to the output
     * @returns JArray of {@link java.io.File} instances that match specified extension.
     */
    function GetListOfFiles(path: string, ext?: string): java.io.File[];
    /**
     * Reads file as `<key>:<value>` pairs.
     * @param dir home-relative or absolute path to the file
     * @param specialSeparator separator between key and value, ":" by default
     * @returns Object containing `<key>:<value>` pairs from file.
     */
    function ReadKeyValueFile(dir: string, specialSeparator?: string): {
        [key: string]: string
    };
    /**
     * Writes `<key>:<value>` pairs to the file.
     * @param dir home-relative or absolute path to the file
     * @param data object to be written to the file as a set of key:value pairs
     * @param specialSeparator separator between key and value, ":" by default
     */
    function WriteKeyValueFile(dir: string, data: object, specialSeparator?: string): void;
    /**
     * Reads JSON file without comments as object.
     * @param dir home-relative or absolute path to the file
     * @returns Object represents JSON value read from JSON file.
     */
    function ReadJSON(dir: string): any;
    /**
     * Writes object to file as JSON.
     * @param dir home-relative or absolute path to the file
     * @param obj object to be written to the file as JSON
     * @param beautify if true, output JSON is beautified with tabs
     */
    function WriteJSON(dir: string, obj: any, beautify: boolean): void;
}
/**
 * Defines armor type and armor slot index in player's inventory.
 * @since 2.2.1b89
 */
declare enum EArmorType {
    HELMET = 0,
    CHESTPLATE = 1,
    LEGGINGS = 2,
    BOOTS = 3
}
/**
 * Defines possible render layers (display methods) for blocks.
 * @since 2.2.1b89
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
 * Defines numeric representation for each block side.
 * @since 2.2.1b89
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
 * Defines numeric representation for each vanilla block state.
 * @since 2.2.1b89
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
 * Defines text colors and font styles for chat and tip messages.
 * @since 2.2.1b89
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
 * Defines numeric representation for three vanilla dimensions.
 * @since 2.2.1b89
 */
declare enum EDimension {
    NORMAL = 0,
    NETHER = 1,
    END = 2
}
/**
 * Defines what enchantments can or cannot be applied to every instrument type.
 * @since 2.2.1b89
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
 * Defines numeric IDs of all vanilla enchantments.
 * @since 2.2.1b89
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
 * Defines all vanilla entity type numeric IDs.
 * @since 2.2.1b89
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
 * Defines possible game difficulties.
 * @since 2.2.1b89
 */
declare enum EGameDifficulty {
    PEACEFUL = 0,
    EASY = 1,
    NORMAL = 2,
    HARD = 3
}
/**
 * Defines possible game modes.
 * @since 2.2.1b89
 */
declare enum EGameMode {
    SURVIVAL = 0,
    CREATIVE = 1,
    ADVENTURE = 2,
    SPECTATOR = 3
}
/**
 * Defines item animation types.
 * @since 2.2.1b89
 */
declare enum EItemAnimation {
    NORMAL = 0,
    BOW = 4
}
/**
 * Defines vanilla item categories in creative inventory.
 * @since 2.2.1b89
 */
declare enum EItemCategory {
    INTERNAL = 0,
    MATERIAL = 1,
    DECORATION = 2,
    TOOL = 3,
    FOOD = 4
}
/**
 * Defines vanilla mob render types.
 * @since 2.2.1b89
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
 * Defines numeric representation for each NBT data type.
 * @since 2.2.1b89
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
 * Defines all existing vanilla particles.
 * @since 2.2.1b89
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
 * Defines player's abilities.
 * @since 2.2.1b89
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
 * Defines vanilla potion effects.
 * @since 2.2.1b89
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
 * Use {@link NativeTileEntity} class to work with them.
 * @since 2.2.1b89
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
 * Class used to create new entity AI types.
 */
declare class EntityAIClass implements EntityAIClass.EntityAIPrototype {
    /**
     * Creates new entity AI type.
     * @param customPrototype AI type prototype
     */
    constructor(customPrototype: EntityAIClass.EntityAIPrototype);
    /**
     * Sets execution timer time in ticks. AI will be executed specified
     * number of ticks.
     * @param timer execution time in ticks
     */
    setExecutionTimer(timer: number): void;
    /**
     * Resets execution timer so that AI is executed with no time limits.
     */
    removeExecutionTimer(): void;
    /**
     * If set to true, it is an instance of AI type, else the pattern
     * (pattern should not be modified directly, AI controller calls
     * instantiate to create instances of AI type).
     *
     * @todo Add link to AI controller type.
     */
    isInstance: boolean;
    /**
     * @todo Determine type.
     */
    parent: any;
    /**
     * Id of the entity that uses this AI type instance or `null` if it is
     * the pattern.
     */
    entity?: number;
    /**
     * Method that is called to create AI type instance using current
     * instance as pattern.
     */
    instantiate(parent: any, name: string): EntityAIClass;
    /**
     * Occurs when entity this instance is assigned to this AI type
     * instance, if you override this method, be sure to assign entity
     * to {@link EntityAIClass.EntityAIPrototype}.
     */
    aiEntityChanged(entity: number): void;
    /**
     * Finishes AI execution and disables it in parent controller.
     */
    finishExecution(): void;
    /**
     * Changes own priority in parent's controller.
     */
    changeSelfPriority(priority: number): void;
    /**
     * Enables any AI by it's name in the controller.
     * @param name AI name to be enables
     * @param priority priority to be set to the enabled AI
     * @param extra some extra data passed to
     */
    enableAI(name: string, priority: number, extra: any): void;
    /**
     * Disables any AI by it's name in the controller.
     * @param name AI name to be disabled
     */
    disableAI(name: string): void;
    /**
     * Sets any AI priority by it's name in the controller.
     * @param name AI name to change priority
     * @param priority priority to be set to the AI
     */
    setPriority(name: string, priority: number): void;
    /**
     * Gets any AI object by it's name from the current controller.
     * @param name AI name
     */
    getAI(name: string): EntityAIClass;
    /**
     * Gets any AI priority from the current controller by AI name.
     * @param name AI name
     */
    getPriority(name: string): number;
    /**
     * @returns AI type's default name.
     */
    setParams(params: object): void;
    /**
     * All the parameters of the AI instance.
     */
    params: object;
    /**
     * Object containing the state of the AI type.
     */
    data: object;
}
declare namespace EntityAIClass {
    /**
     * Object used to register entity AI prototypes.
     */
    interface EntityAIPrototype {
        /**
         * @returns AI type's default priority.
         */
        getDefaultPriority?(): number,
        /**
         * @returns AI type's default name.
         */
        getDefaultName?(): string,
        /**
         * Default parameters set.
         */
        params?: object,
        /**
         * Called when AI type execution starts.
         * @param extra additional data passed from {@link EntityAIClass.enableAI}
         * method
         */
        executionStarted?(extra?: any): void,
        /**
         * Called when AI type execution ends.
         */
        executionEnded?(): void,
        /**
         * Called when AI type execution is paused.
         */
        executionPaused?(): void,
        /**
         * Called when AI type execution is resumed.
         */
        executionResumed?(): void,
        /**
         * Defines main logic of the AI type.
         */
        execute?(): void,
        /**
         * Object containing the state of the AI type.
         */
        data?: object,
        /**
         * Called when entity is attacked by player.
         * @param attacker player that attacked this entity
         */
        attackedBy?(attacker: number): void;
        /**
         * Called when entity gets hurt.
         * @param attacker entity that damaged this entity, or -1 if damage
         * source is not an entity
         * @param damage amount of damage
         */
        hurtBy?(attacker: number, damage: number): void;
        /**
         * Called when a projectile hits the entity.
         * @param projectile projectile entity ID
         */
        projectileHit?(projectile: number): void;
        /**
         * Called when entity is dead.
         * @param attacker entity that damaged this entity, or -1 if damage
         * source is not an entity
         */
        death?(attacker: number): void;
    }
    /**
     * Object used to register entity AI prototypes.
     */
    interface WanderLikeAIPrototype extends EntityAIPrototype {
        /**
         * Entity movement speed when AI is executed.
         */
        speed?: number;
        /**
         * Entity speed when turning.
         */
        angular_speed?: number;
    }
}
/**
 * A set of predefined entity AI types.
 */
declare namespace EntityAI {
    /**
     * Simple Idle AI type, entity just does nothing.
     */
    class Idle extends EntityAIClass {
        /**
         * Creates Idle entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.EntityAIPrototype);
    }
    /**
     * Follow AI type, entity follows it's target. Use another AI type to set
     * target for this AI type.
     */
    class Follow extends EntityAIClass {
        /**
         * Creates follow entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.EntityAIPrototype & {
            /**
             * Entity movement speed when AI is executed.
             * @default 0.2
             */
            speed?: number;
            /**
             * Jump (y) velocity.
             * @default 0.45
             */
            jumpVel?: number;
            /**
             * Entity rotation speed.
             * @default 0.4
             */
            rotateSpeed?: number;
            /**
             * How long will be the rotation path.
             * @default 0.5
             */
            rotateRatio?: number;
            /**
             * If `true`, entity turns it's head to the target.
             * @default true
             */
            rotateHead?: boolean;
            /**
             * If `true`, entity won't change it's Y velocity.
             * @default true
             */
            denyY?: boolean;
            /**
             * Coordinates used as a target.
             */
            target?: Vector;
            /**
             * Entity used as a target; when specified, target data is ignored.
             */
            targetEntity?: number;
        });
    }
    /**
     * Panic AI type, entity just rushes around.
     */
    class Panic extends EntityAIClass {
        /**
         * Creates panic entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.WanderLikeAIPrototype);
    }
    /**
     * Wander AI type, entity walks around making pauses.
     */
    class Wander extends EntityAIClass {
        /**
         * Creates wander entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.WanderLikeAIPrototype & {
            /**
             * Part of the time entity is making pause.
             * @default 0.3
             */
            delay_weight?: number;
        });
    }
    /**
     * Attack AI type, entity causes damage to the target entity.
     */
    class Attack extends EntityAIClass {
        /**
         * Creates attack entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.EntityAIPrototype & {
            /**
             * Damage amount.
             * @default 5
             */
            attack_damage?: number;
            /**
             * Damage radius.
             * @default 2.5
             */
            attack_range?: number;
            /**
             * Time between to attacks in ticks.
             * @default 12
             */
            attack_rate?: number;
            /**
             * Target entity.
             * @default null
             */
            target?: Nullable<number>;
        });
    }
    /**
     * Swim AI type, if the entity is in water, it swims.
     */
    class Swim extends EntityAIClass {
        /**
         * Creates swim entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.EntityAIPrototype & {
            /**
             * Swimming speed.
             * @default 0.2
             */
            velocity?: number;
        });
    }
    /**
     * Panic AI watcher type, controls entity panic behavior after getting hurt.
     */
    class PanicWatcher extends EntityAIWatcher {
        /**
         * Creates panic watcher entity AI type.
         * @param customPrototype AI type prototype
         */
        constructor(customPrototype: EntityAIClass.EntityAIPrototype & {
            /**
             * Time the entity will be in panic.
             * @default 200
             */
            panic_time?: number;
            /**
             * Panic AI priority when entity should be in panic.
             * @default 5
             */
            priority_panic?: number;
            /**
             * Panic AI priority when entity should not be in panic.
             * @default 1
             */
            priority_default?: number;
            /**
             * Panic AI priority when entity should not be in panic
             * @default "panic"
             */
            name?: string;
        });
    }
}
/**
 * Parent class for {@link EntityAI.PanicWatcher}, does nothing
 * like {@link EntityAI.Idle}.
 */
declare class EntityAIWatcher extends EntityAIClass {
    /**
     * Creates watcher entity AI type.
     * @param customPrototype AI type prototype
     */
    constructor(customPrototype: EntityAIClass.EntityAIPrototype);
}
/**
 * Module used to manipulate entities (mobs, drop, arrows, etc.) in the world.
 * Every entity has it's unique numeric ID which is often used across this module
 * as the first function parameter.
 */
declare namespace Entity {
    /**
     * @returns An array of all server entities UIDs.
     */
    function getAll(): number[];
    /**
     * @returns An array of all server entities UIDs.
     * @deprecated Consider using {@link Entity.getAll} instead.
     */
    function getAllJS(): number[];
    /**
     * @returns An array of all client entities UIDs.
     * @since 2.4.0b120
     */
    function getAllLocal(): number[];
    /**
     * @deprecated Use attributes instead, or {@link Saver}.
     */
    function getExtra(entityUid: number, name: string): null;
    /**
     * @deprecated Use attributes instead, or {@link Saver}.
     */
    function putExtra(entityUid: number, name: string, extra?: object): void;
    /**
     * @deprecated Use attributes instead, or {@link Saver}.
     */
    function getExtraJson(entityUid: number, name: string): object;
    /**
     * @deprecated Use attributes instead, or {@link Saver}.
     */
    function putExtraJson(entityUid: number, name: string, obj: object): void;
    /**
     * Adds an effect to entity.
     * @param effectId effect ID, should be one one of {@link EPotionEffect} values
     * @param effectData effect amplifier
     * @param effectTime effect time in ticks
     * @param ambience if true, particles are ambient
     * @param particles if true, particles are not displayed
     */
    function addEffect(entityUid: number, effectId: number, effectData: number, effectTime: number, ambience?: boolean, particles?: boolean): void;
    /**
     * Adds an effect to entity.
     * @param effectId effect ID, should be one one of {@link EPotionEffect} values
     * @param effectData effect amplifier
     * @param effectTime effect time in ticks
     * @param ambience if true, particles are ambient
     * @param particles if true, particles are not displayed
     * @param effectAnimation if true, flashing are displayed
     * @since 2.3.1b116
     */
    function addEffect(entityUid: number, effectId: number, effectData: number, effectTime: number, ambience: boolean, particles: boolean, effectAnimation: boolean): void;
    /**
     * @param effectId numeric ID of the potion effect,
     * one of {@link EPotionEffect} values
     * @returns Whether the given entity is affected by the potion effect with given numeric ID.
     * @since 2.2.1b102
     */
    function hasEffect(entity: number, effectId: number): boolean;
    /**
     * @returns Object with duration and level of the potion effect with given numeric ID
     * on the given entity. These fields are set to 0, if the given effect doesn't affect
     * the given entity at the moment.
     * @since 2.2.1b102
     */
    function getEffect(entity: number, effectId: number): EffectInstance;
    interface EffectInstance {
        level: number;
        duration: number;
    }
    /**
     * Clears effect, applied to the mob.
     * @param id effect ID, should be one of the {@link EPotionEffect}
     */
    function clearEffect(entityUid: number, id: number): void;
    /**
     * Clears all effects of the mob.
     */
    function clearEffects(entityUid: number): void;
    enum DamageSources {
        /**
         * `"death.attack.generic"`
         * @remarks
         * Default damage source if anything else not found.
         */
        GENERIC = 0,
        /**
         * `"death.attack.cactus"` (only when standing on cactus)
         */
        CACTUS = 1,
        /**
         * `"death.attack.mob"`
         */
        MOB = 2,
        IMPACT = 3,
        /**
         * `"death.attack.inWall"`
         */
        IN_WALL = 4,
        /**
         * `"death.attack.fall"` and `"death.fell.accident.generic"`
         */
        FALL = 5,
        /**
         * `"death.attack.inFire"`
         */
        IN_FIRE = 6,
        /**
         * `"death.attack.onFire"`
         */
        ON_FIRE = 7,
        /**
         * `"death.attack.lava"`
         */
        LAVA = 8,
        /**
         * `"death.attack.drown"`
         */
        DROWN = 9,
        /**
         * `"death.attack.explosion"`
         */
        EXPLOSION = 10,
        /**
         * `"death.attack.explosion"`
         */
        EXPLOSION_PLAYER = 11,
        /**
         * `"death.attack.outOfWorld"`
         */
        OUT_OF_WORLD = 12,
        COMMAND = 13,
        /**
         * `"death.attack.magic"`
         */
        MAGIC = 14,
        /**
         * `"death.attack.wither"`
         */
        WITHER = 15,
        /**
         * `"death.attack.starve"`
         */
        STARVE = 16,
        /**
         * `"death.attack.anvil"`
         */
        ANVIL = 17,
        /**
         * `"death.attack.thorns"`
         */
        THORNS = 18,
        PROJECTILE = 19,
        /**
         * `"death.attack.fallingBlock"`
         */
        FALLING_BLOCK = 20,
        /**
         * `"death.attack.flyIntoWall"`
         */
        FLY_INTO_WALL = 21,
        /**
         * `"death.attack.magma"`
         */
        MAGMA = 22,
        /**
         * `"death.attack.fireworks"`
         */
        FIREWORKS = 23,
        /**
         * `"death.attack.lightningBolt"`
         */
        LIGHTNING_BOLT = 24,
        OVER_TIME = 4294967295
    }
    /**
     * Damages entity.
     * @param damage damage value in half-hearts
     * @param cause existing damage source or any inclusive value between 25 and 32
     * @param properties additional damage source properties
     * @param properties.attacker entity that caused damage, determines actor of damage source
     * @param properties.bool1 if `true`, damage can be reduced by armor
     */
    function damageEntity(entityUid: number, damage: number, cause?: DamageSources | number, properties?: { attacker?: number, bool1?: boolean }): void;
    /**
     * Adds specified health amount to the entity.
     * @param heal health to be added to entity, in half-hearts
     */
    function healEntity(entityUid: number, heal: number): void;
    /**
     * @returns Numeric entity type, one of the {@link EEntityType}.
     */
    function getType(entityUid: number): number;
    /**
     * @returns String entity type, like `minecraft:chicken<>` (`<namespace>:<identifier>[<attributes>]`).
     */
    function getTypeName(entityUid: number): string;
    /**
     * @returns String type for entities defined via add-ons or numeric type for
     * all the other entities.
     */
    function getTypeUniversal(entityUid: number): number | string;
    /**
     * @returns String type for entities defined via add-ons, otherwise `null`.
     * @remarks
     * Includes only entities spawned locally (with {@link Entity.spawnAddon}),
     * test entities manually with {@link Entity.getTypeName} or use {@link BlockSource.listEntitiesInAABB}
     * with appropriate arguments.
     */
    function getTypeAddon(entityUid: number): Nullable<string>;
    /**
     * @returns Compound tag for the specified entity.
     * @since 2.0.5b44
     */
    function getCompoundTag(entityUid: number): Nullable<NBT.CompoundTag>;
    /**
     * Sets compound tag for the specified entity.
     * @since 2.0.5b44
     */
    function setCompoundTag(entityUid: number, tag: NBT.CompoundTag): void;
    /**
     * Sets hitbox to the entity. Hitboxes defines entity collisions
     * between terrain and themselves (e.g. physics).
     * @param w hitbox width and length
     * @param h hitbox height
     */
    function setHitbox(entityUid: number, w: number, h: number): void;
    /**
     * @returns `true` if specified entity is loaded within any player chunks
     * (not despawned or unloaded) and identifier is valid.
     */
    function isExist(entityUid: number): boolean;
    /**
     * @returns Current dimension numeric ID, one of the {@link EDimension}
     * values or custom dimension ID.
     * @since 2.0.4b35
     */
    function getDimension(entityUid: number): number;
    /**
     * Spawns vanilla entity on the specified coordinates.
     * @param type numeric entity type, one of the {@link EEntityType}
     * @param skin skin to set for the entity. Leave empty or null to use
     * default skin of the mob
     * @returns Numeric ID of spawn entity or -1 if entity was not created.
     * @remarks
     * Local method, use {@link BlockSource.spawnEntity} instead.
     */
    function spawn(x: number, y: number, z: number, type: number, skin?: Nullable<string>): number;
    /**
     * Same as {@link Entity.spawn}, but uses {@link Vector} object to represent
     * coordinates.
     * @remarks
     * Local method, use {@link BlockSource.spawnEntity} instead.
     */
    function spawnAtCoords(coords: Vector, type: number, skin?: string): void;
    /**
     * Spawns custom entity on the specified coords. Allows to pass some values
     * to controllers via extra param.
     * @param name custom entity string ID
     * @param extra object that contains some data for the controllers
     * @deprecated You've should implement addon entity and spawn it with
     * {@link BlockSource.spawnEntity} instead.
     */
    function spawnCustom(name: string, x: number, y: number, z: number, extra?: object): CustomEntity;
    /**
     * Same as {@link Entity.spawnCustom}, but uses {@link Vector} object to represent
     * coordinates.
     * @deprecated You've should implement addon entity and spawn it with
     * {@link BlockSource.spawnEntity} instead.
     */
    function spawnCustomAtCoords(name: string, coords: Vector, extra?: any): CustomEntity;
    /**
     * Spawns custom entity defined in behavior packs or game itself.
     * @returns Instance to performing commands on entity.
     * @remarks
     * Local method, use {@link BlockSource.spawnEntity} instead.
     */
    function spawnAddon(x: number, y: number, z: number, name: string): AddonEntityRegistry.AddonEntity;
    /**
     * Same as {@link Entity.spawnAddon}, but uses {@link Vector} object to represent
     * coordinates.
     * @returns Instance to performing commands on entity.
     * @remarks
     * Local method, use {@link BlockSource.spawnEntity} instead.
     */
    function spawnAddonAtCoords(coords: Vector, name: string): AddonEntityRegistry.AddonEntity;
    /**
     * @returns Instance to performing commands on requested addon
     * entity if it spawned by Inner Core or `null` instead.
     * @remarks
     * Includes only entities spawned locally (with {@link Entity.spawnAddon}).
     */
    function getAddonEntity(entity: number): Nullable<AddonEntityRegistry.AddonEntity>;
    /**
     * Removes entity from the world.
     */
    function remove(entityUid: number): void;
    /**
     * @returns Custom entity object by it's numeric entity UID.
     * @deprecated Not supported anymore, use behavior packs.
     */
    function getCustom(entityUid: number): CustomEntity;
    /**
     * @deprecated Use attributes instead.
     */
    function getAge(entityUid: number): number;
    /**
     * @deprecated Use attributes instead.
     */
    function setAge(entityUid: number, age: number): void;
    /**
     * @deprecated Use NBT instead.
     */
    function getSkin(entityUid: number): string;
    /**
     * Sets mob skin.
     * @param skin skin name, full path in the resourcepack (mod assets)
     * @deprecated Use NBT or resource packs instead.
     */
    function setSkin(entityUid: number, skin: string): void;
    /**
     * Sets mob skin, uses {@link Texture} object.
     * @deprecated Use NBT or resource packs instead.
     */
    function setTexture(entityUid: number, texture: Texture): void;
    /**
     * @returns Entity render type, should be one of the
     * {@link EMobRenderType} values.
     */
    function getRender(entityUid: number): number;
    /**
     * Sets entity render type.
     * @param render entity render type, should be one of the
     * {@link EMobRenderType} values
     */
    function setRender(entityUid: number, render: number): void;
    /**
     * Makes rider ride entity.
     * @param entityUid ridden entity
     * @param riderUid rider entity
     */
    function rideAnimal(entityUid: number, riderUid: number): void;
    /**
     * @returns Entity name tag or player name.
     */
    function getNameTag(entityUid: number): string;
    /**
     * Sets custom entity name tag. Custom entity tags are
     * displayed above the entities and can be set by player
     * using label.
     * @param tag name tag to be set to the entity
     */
    function setNameTag(entityUid: number, tag: string): void;
    /**
     * Gets the attack target of current entity.
     * @returns Target entity's unique ID.
     */
    function getTarget(entityUid: number): number;
    /**
     * Sets the attack target for current entity. Works only for mobs that
     * actually can attack.
     * @param targetUid target entity's unique ID
     */
    function setTarget(entityUid: number, targetUid: number): void;
    /**
     * @returns `true`, if entity was immobilized.
     * @since 2.3.1b116-3
     */
    function getMobile(entityUid: number): boolean;
    /**
     * Sets entity's immobile state.
     * @param mobile if `true`, entity can move, otherwise it is immobilized
     */
    function setMobile(entityUid: number, mobile: boolean): void;
    /**
     * @returns `true` if entity is sneaking, `false` otherwise.
     */
    function getSneaking(entityUid: number): boolean;
    /**
     * Sets entity's sneaking state, supported slightly
     * entities, resource pack render controlling it.
     * @param sneak if `true`, entity becomes sneaking, else not
     */
    function setSneaking(entityUid: number, sneak: boolean): void;
    /**
     * @returns Entity that is riding the specified entity.
     */
    function getRider(entityUid: number): number;
    /**
     * @returns Entity that is ridden by specified entity.
     */
    function getRiding(entityUid: number): number;
    /**
     * Puts entity on fire.
     * @param fire duration (in ticks) of the fire
     * @param force should always be true
     */
    function setFire(entityUid: number, fire: number, force: boolean): void;
    /**
     * @returns An object that allows to manipulate entity health.
     * @deprecated Consider using {@link Entity.getHealth}, {@link Entity.setHealth},
     * {@link Entity.getMaxHealth} and {@link Entity.setMaxHealth} instead.
     */
    function health(entityUid: number): EntityHealth;
    /**
     * Class used to manipulate entity's health.
     * @deprecated Consider using {@link Entity.getHealth}, {@link Entity.setHealth},
     * {@link Entity.getMaxHealth} and {@link Entity.setMaxHealth} instead.
     */
    class EntityHealth {
        /**
         * @returns Entity's current health value.
         * @throws No such method.
         */
        get(): number;
        /**
         * Sets entity's current health value.
         * @param health health value to be set
         * @throws No such method.
         */
        set(health: number): void;
        /**
         * @returns Entity's maximum health value.
         * @throws No such method.
         */
        getMax(): number;
        /**
         * Sets entity's maximum health value.
         * @throws No such method.
         */
        setMax(maxHealth: number): void;
    }
    /**
     * @returns Entity's current health value.
     */
    function getHealth(entityUid: number): number;
    /**
     * Sets entity's current health value.
     * @param health health value to be set
     */
    function setHealth(entityUid: number, health: number): void;
    /**
     * @returns Entity's maximum health value.
     */
    function getMaxHealth(entityUid: number): number;
    /**
     * Sets entity's maximum health value.
     */
    function setMaxHealth(entityUid: number, health: number): void;
    /**
     * Sets the specified coordinates as a new position for the entity.
     * No checks are performed.
     */
    function setPosition(entityUid: number, x: number, y: number, z: number): void;
    /**
     * @returns Entity position.
     */
    function getPosition(entityUid: number): Vector;
    /**
     * Updates current entity position by specified coordinates.
     */
    function addPosition(entityUid: number, x: number, y: number, z: number): void;
    /**
     * Set current entity's velocity using velocity vector.
     */
    function setVelocity(entityUid: number, x: number, y: number, z: number): void;
    /**
     * Get current entity's velocity using velocity vector.
     * @returns Containing current entity's velocity.
     */
    function getVelocity(entityUid: number): Vector;
    /**
     * Updates current entity's velocity by specified value.
     */
    function addVelocity(entityUid: number, x: number, y: number, z: number): void;
    /**
     * @returns Distance in blocks between the two coordinate sets.
     */
    function getDistanceBetweenCoords(coords1: Vector, coords2: Vector): number;
    /**
     * @returns Distance between specified entity and a fixed coordinate set.
     */
    function getDistanceToCoords(entityUid: number, coords: Vector): number;
    /**
     * @returns Distance in blocks between two entities.
     */
    function getDistanceToEntity(ent1: number, ent2: number): number;
    /**
     * @returns Distance between player and entity, counting only x and z values
     * (y value is ignored).
     */
    function getXZPlayerDis(entityUid: number): number;
    /**
     * @returns Entity's look angle in radians.
     */
    function getLookAngle(entityUid: number): LookAngle;
    /**
     * Sets specified pitch and yaw as look angle for the entity.
     * @param yaw look angle yaw in radians
     * @param pitch look angle pitch in radians
     */
    function setLookAngle(entityUid: number, yaw: number, pitch: number): void;
    /**
     * Transforms look angle into look vector.
     * @param angle look angle to transform into {@link Vector}
     * @returns Transformation result.
     */
    function getLookVectorByAngle(angle: LookAngle): Vector;
    /**
     * @returns Look vector for the entity.
     */
    function getLookVector(entityUid: number): Vector;
    /**
     * @returns Look angle between entity and static coordinates.
     */
    function getLookAt(entityUid: number, x: number, y: number, z: number): LookAngle;
    /**
     * Sets entity look angle to look at specified coordinates.
     */
    function lookAt(entityUid: number, x: number, y: number, z: number): void;
    /**
     * Same as {@link Entity.lookAt} but uses Vector as param type.
     * @param coords
     */
    function lookAtCoords(entityUid: number, coords: Vector): void;
    /**
     * Makes entity move to the target coordinates.
     * @param params additional move parameters
     */
    function moveToTarget(entityUid: number, target: Vector, params: MoveParams): void;
    /**
     * Makes entity move using pitch/yaw angle to determine direction.
     * @param angle angle to define entity's direction
     * @param params additional move parameters
     */
    function moveToAngle(entityUid: number, angle: LookAngle, params: MoveParams): void;
    /**
     * Makes entity move towards it's current look angle.
     * @param params additional move parameters
     */
    function moveToLook(entityUid: number, params: MoveParams): void;
    /**
     * Interface used to specify how entity should move.
     */
     interface MoveParams {
        /**
         * Movement speed.
         */
        speed?: number,
        /**
         * If `true`, entity won't change it's Y velocity.
         */
        denyY?: boolean,
        /**
         * Y velocity (jump speed).
         */
        jumpVel?: number
    }
    /**
     * Retrieves entity's current movement information.
     * @returns Object that contains normalized moving vector, moving speed and
     * moving xz speed (with no Y coordinate).
     */
    function getMovingVector(entityUid: number): MovingVector;
    /**
     * Interface used to return entity's current moving vector and some
     * additional data.
     */
     interface MovingVector {
        /**
         * Normalized vector X coordinate.
         */
        x: number,
        /**
         * Normalized vector Y coordinate.
         */
        y: number,
        /**
         * Normalized vector Z coordinate.
         */
        z: number,
        /**
         * Vector real length.
         */
        size: number,
        /**
         * Vector real length excluding Y coordinate.
         */
        xzsize: number
    }
    /**
     * Retrieves entity look angle in the form of pitch/yaw angle. No other
     * information included to the resulting object.
     */
    function getMovingAngle(entityUid: number): LookAngle;
    /**
     * @deprecated Nothing to perform here anymore.
     */
    function getMovingAngleByPositions(pos1: any, pos2: any): undefined;
    /**
     * Retrieves nearest to the coordinates entity of the specified entity type.
     * @param coords search range center coordinates
     * @param type entity type ID. Parameter is no longer supported and should
     * be 0 in all cases
     * @param maxRange if specified, determines search radius
     * @remarks
     * Overheating method, capture entities by {@link BlockSource.fetchEntitiesInAABB} \
     * and pass over them by checking radius between coords and entity.
     */
    function findNearest(coords: Vector, type?: number, maxRange?: number): Nullable<number>;
    /**
     * Returns array of all entities numeric IDs in given range in blocks.
     * @param coords search range center coordinates
     * @param maxRange determines search radius
     * @param type entity type ID
     * @remarks
     * Overheating method, capture entities by {@link BlockSource.fetchEntitiesInAABB} \
     * and pass over them by checking radius between coords and entity.
     */
    function getAllInRange(coords: Vector, maxRange: number, type?: number): number[];
    /**
     * @deprecated Consider use {@link Entity.getCarriedItem} instead.
     */
    function getInventory(entityUid: number, handleNames?: boolean, handleEnchant?: boolean): void;
    /**
     * @param slot armor slot index, should be one of the {@link EArmorType}
     * values
     * @returns Armor slot contents for entity.
     */
    function getArmorSlot(entityUid: number, slot: number): ItemInstance;
    /**
     * Sets armor slot contents for the entity.
     * @param slot armor slot index, should be one of the {@link EArmorType}
     * values
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setArmorSlot(entityUid: number, slot: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns Entity's current carried item information.
     */
    function getCarriedItem(entityUid: number): ItemInstance;
    /**
     * Sets current carried item for the entity.
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setCarriedItem(entityUid: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @returns Entity's current offhand item information.
     */
    function getOffhandItem(entityUid: number): ItemInstance;
    /**
     * Sets current offhand item for the entity.
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setOffhandItem(entityUid: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * Gets item from specified drop entity
     * @returns Instance that is in the dropped item.
     */
    function getDroppedItem(entityUid: number): ItemInstance;
    /**
     * Sets item to the specified drop entity
     * @param id item ID
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    function setDroppedItem(entityUid: number, id: number, count: number, data: number, extra?: ItemExtraData): void;
    /**
     * @deprecated Use callbacks and {@link Entity.getAll} instead.
     */
    function getProjectileItem(projectile: number): ItemInstance;
    enum Attributes {
        FOLLOW_RANGE = "minecraft:follow_range",
        LUCK = "minecraft:luck",
        LAVA_MOVEMENT = "minecraft:lava_movement",
        UNDERWATER_MOVEMENT = "minecraft:underwater_movement",
        MOVEMENT = "minecraft:movement",
        KNOCKBACK_RESISTANCE = "minecraft:knockback_resistance",
        ABSORPTION = "minecraft:absorption",
        HEALTH = "minecraft:health",
        ATTACK_DAMAGE = "minecraft:attack_damage",
        JUMP_STRENGTH = "minecraft:jump_strength"
    }
    /**
     * Creates an object used to change entity's attributes.
     * @param entity entity uid
     * @param attribute one of {@link Attributes} or your custom one
     * @returns Object used to manipulate entity's attributes.
     * @since 2.0.3b33
     */
    function getAttribute(entityUid: number, attribute: Attributes | string): AttributeInstance;
    /**
     * Interface used to modify attribute values.
     */
    interface AttributeInstance {
        /**
         * @returns Current attribute's value.
         */
        getValue(): number;
        /**
         * @returns Attribute's maximum value.
         */
        getMaxValue(): number;
        /**
         * @returns Attribute's minimum value.
         */
        getMinValue(): number;
        /**
         * @returns Attribute's default value
         */
        getDefaultValue(): number;
        /**
         * Sets current attribute's value.
         */
        setValue(value: number): void;
        /**
         * Sets attribute's maximum value.
         */
        setMaxValue(value: number): void;
        /**
         * Sets attribute's minimum value.
         */
        setMinValue(value: number): void;
        /**
         * Sets attribute's default value.
         */
        setDefaultValue(value: number): void;
    }
    /**
     * Creates or gets an existing {@link Entity.PathNavigation} instance for the specified mob
     * @returns Navigation used to control entity's target position and
     * the way to get there.
     * @since 2.0.3b33
     */
    function getPathNavigation(entityUid: number): PathNavigation;
    /**
     * Object used to build path and move mobs to the required coordinates using
     * specified parameters. All the setters return current {@link Entity.PathNavigation}
     * instance to be able to produce chained calls.
     * @since 2.0.3b33
     */
    interface PathNavigation {
        /**
         * Builds path to the specified coordinates.
         * @param speed entity movement speed
         */
        moveToCoords(x: number, y: number, z: number, speed: number): PathNavigation;
        /**
         * Builds path to the specified entity. Note that current coordinates of
         * entity are used, and are not updated.
         * @param speed entity movement speed
         */
        moveToEntity(entity: number, speed: number): PathNavigation;
        /**
         * Sets function to be notified when path navigation is finished or aborted.
         * @param callback function to be called when navigation is finished or aborted
         */
        setResultFunction(callback: PathNavigationResultFunction): PathNavigation;
        /**
         * @returns Whether the entity can pass doors.
         */
        canPassDoors(): boolean;
        /**
         * Sets entity's door passing ability.
         */
        setCanPassDoors(value: boolean): PathNavigation;
        isRiverFollowing(): boolean;
        setIsRiverFollowing(value: boolean): PathNavigation;
        /**
         * @returns Whether the entity can open doors.
         */
        canOpenDoors(): boolean;
        /**
         * Sets entity's door opening ability.
         */
        setCanOpenDoors(value: boolean): PathNavigation;
        /**
         * Sets entity's sun avoiding.
         */
        setAvoidSun(value: boolean): PathNavigation;
        /**
         * @returns Whether the entity avoids water.
         */
        getAvoidWater(): boolean;
        /**
         * Sets entity's water avoiding.
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
         * @returns Whether entity can jump.
         */
        getCanJump(): boolean;
        /**
         * Enables or disables entity's jumping ability.
         */
        setCanJump(value: boolean): PathNavigation;
        /**
         * @returns Entity's speed value.
         */
        getSpeed(): number;
        /**
         * Sets entity's speed value.
         */
        setSpeed(value: number): PathNavigation;
    }
    /**
     * Occurs when path navigation is finished or aborted.
     * @param navigation {@link Entity.PathNavigation} that the handler is attached to
     * @param result result code, one of the following:
     *
     * 0 - success; you can call {@link Entity.PathNavigation.moveToCoords},
     * {@link Entity.PathNavigation.moveToEntity} methods to resume path
     *
     * 2 - entity was removed from the world
     *
     * 4 - player left the world
     */
    interface PathNavigationResultFunction {
        (navigation: PathNavigation, result: number): void
    }
    /**
     * Returns array of all entities numeric IDs in given range in blocks.
     * @param coords1 start search range coordinates
     * @param coords2 end search range coordinates
     * @param type entity type ID
     * @default type: 255, flag: true
     * @since 2.0.4b35
     * @remarks
     * Local method, use {@link BlockSource.listEntitiesInAABB} instead.
     */
    function getAllInsideBox(coords1: Vector, coords2: Vector, type?: number, flag?: boolean): number[];
}
/**
 * Namespace used to create and manipulate custom dimensions.
 */
declare namespace Dimensions {
    /**
     * Class representing custom dimension.
     */
    class CustomDimension {
        /**
         * Constructs a new dimension with specified name and preferred ID.
         * @param name dimension name, can be used to get dimension via
         * {@link Dimensions.getDimensionByName} call
         * @param preferredId preferred dimension ID. If ID is already occupied
         * by some another dimension, constructor will look for the next empty
         * dimension ID and assign it to the current dimension
         */
        constructor(name: string, preferredId: number);
        /**
         * Custom dimension ID.
         */
        id: number;
        /**
         * Sets custom landscape generator.
         * @param generator custom landscape generator used for current
         * dimension
         * @returns Reference to itself to be used in sequential calls.
         */
        setGenerator(generator: CustomGenerator): CustomDimension;
        /**
         * Specifies whether the sky produces light (like in overworld) or not
         * (like in the End or Nether).
         * @param hasSkyLight if true, the sky produces light in the dimension
         * @returns Reference to itself to be used in sequential calls.
         * @default true
         */
        setHasSkyLight(hasSkyLight: boolean): CustomDimension;
        /**
         * @returns Whether the sky produces light in the current dimension.
         */
        hasSkyLight(): boolean;
        /**
         * Sets sky color for the dimension in the RGB format. Default
         * color is as in the Overworld.
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns Reference to itself to be used in sequential calls.
         */
        setSkyColor(r: number, g: number, b: number): CustomDimension;
        /**
         * Resets sky color to the default value.
         * @returns Reference to itself to be used in sequential calls.
         */
        resetSkyColor(): CustomDimension;
        /**
         * Sets fog color for the dimension in the RGB format. Default
         * color is as in the Overworld.
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns Reference to itself to be used in sequential calls.
         */
        setFogColor(r: number, g: number, b: number): CustomDimension;
        /**
         * Resets fog color to the default value.
         * @returns Reference to itself to be used in sequential calls.
         */
        resetFogColor(): CustomDimension;
        /**
         * Sets clouds color for the dimension in the RGB format. Default
         * color is as in the Overworld.
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns Reference to itself to be used in sequential calls.
         */
        setCloudColor(r: number, g: number, b: number): CustomDimension;
        /**
         * Resets clouds color to the default value.
         * @returns Reference to itself to be used in sequential calls.
         */
        resetCloudColor(): CustomDimension;
        /**
         * Sets sunset sky color for the dimension in the RGB format. Default
         * color is as in the Overworld.
         * @param r red color component, value from 0 to 1
         * @param g green color component, value from 0 to 1
         * @param b blue color component, value from 0 to 1
         * @returns Reference to itself to be used in sequential calls.
         */
        setSunsetColor(r: number, g: number, b: number): CustomDimension;
        /**
         * Resets sunset sky color to the default value.
         * @returns Reference to itself to be used in sequential calls.
         */
        resetSunsetColor(): CustomDimension;
        /**
         * Sets fog displaying distance.
         * @param start nearest fog distance
         * @param end farthest fog distance
         * @returns Reference to itself to be used in sequential calls.
         * @since 2.0.2b20
         */
        setFogDistance(start: number, end: number): CustomDimension;
        /**
         * Resets fog displaying distance.
         * @returns Reference to itself to be used in sequential calls.
         * @since 2.0.2b20
         */
        resetFogDistance(): CustomDimension;
    }
    /**
     * Class representing landscape generator used for the dimension.
     */
    class CustomGenerator {
        /**
         * Creates a new {@link Dimensions.CustomGenerator} instance using specified base type.
         * @param baseType base generator type constant, can be from 0 to 4. 0
         * and 1 represent overworld generator, 2 represents flat world
         * generator, 3 represents nether generator and 4 represents end
         * generator
         */
        constructor(baseType: number);
        /**
         * Creates a new {@link Dimensions.CustomGenerator} instance using specified base type.
         * @param baseType base generator type constant, can be one of the
         * following: "overworld", "overworld1", "flat", "nether", "end"
         */
        constructor(baseType: string);
        /**
         * Specifies whether to use vanilla biome surface cover blocks (grass,
         * sand, podzol, etc.).
         * @param value if `true`, vanilla surface will be generated
         * @default false
         * @returns Reference to itself to be used in sequential calls.
         */
        setBuildVanillaSurfaces(value: boolean): CustomGenerator;
        /**
         * Specifies whether to generate minecraft vanilla structures.
         * @param value if `true`, vanilla structures will be generated
         * @default false
         * @returns Reference to itself to be used in sequential calls.
         */
        setGenerateVanillaStructures(value: boolean): CustomGenerator;
        /**
         * Specifies whether to use mod's generation callbacks.
         * @param value if `true`, mod generation will be used
         * @default true
         * @returns Reference to itself to be used in sequential calls.
         */
        setGenerateModStructures(value: boolean): CustomGenerator;
        /**
         * Sets terrain generator object used for the landscape generation.
         * @param generator terrain generator to be used with current landscape
         * generator or removes terrain generator, if the value is null
         * @returns Reference to itself to be used in sequential calls.
         */
        setTerrainGenerator(generator: Nullable<AbstractTerrainGenerator>): CustomGenerator;
        /**
         * Specifies which of the generation {@link Callback Callbacks} to call, `-1` to call
         * no mods generation, `0` to call overworld generation callback, `1` for nether,
         * `2` for end generation callbacks.
         * @param id generation callback to call
         * @returns Reference to itself to be used in sequential calls.
         */
        setModGenerationBaseDimension(id: number): CustomGenerator;
        /**
         * Disables mods generation in current generator.
         * @returns Reference to itself to be used in sequential calls.
         */
        removeModGenerationBaseDimension(): CustomGenerator;
    }
    /**
     * Interface representing terrain generator. All terrain generators found
     * in Inner Core API implement this interface.
     */
    interface AbstractTerrainGenerator {}
    /**
     * Class representing terrain that consists of single biome.
     */
    class MonoBiomeTerrainGenerator implements AbstractTerrainGenerator {
        /**
         * Constructs new {@link Dimensions.MonoBiomeTerrainGenerator MonoBiomeTerrainGenerator}
         * instance with no terrain layers.
         */
        constructor();
        addTerrainLayer(minY: number, maxY: number): TerrainLayer;
        /**
         * Sets base biome for the current terrain.
         * @param id ID of the biome to be used as a single biome of the terrain
         * layer
         */
        setBaseBiome(id: number): MonoBiomeTerrainGenerator;
    }
    /**
     * Class representing single terrain layer that may consist of several noise
     * layers.
     */
    interface TerrainLayer {
        addNewMaterial(generator: NoiseGenerator, priority: number): TerrainMaterial;
        setHeightmapNoise(generator: NoiseGenerator): TerrainLayer;
        setMainNoise(generator: NoiseGenerator): TerrainLayer;
        setYConversion(conversion: NoiseConversion): TerrainLayer;
        getMainMaterial(): TerrainMaterial;
    }
    /**
     * Class representing material that is used to generate terrain layer.
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
     * linearly.
     */
    class NoiseConversion {
        constructor();
        /**
         * Adds a new node to the noise conversion function.
         * @param x value from 0 to 1 representing the height of the block in the
         * terrain layer
         * @param y landscape density at a given height, generally can be between
         * -0.5 and 0.5. Values between nodes are interpolated linearly
         */
        addNode(x: number, y: number): NoiseConversion;
    }
    /**
     * Class representing multi-layer noise generator.
     */
    class NoiseGenerator {
        constructor();
        addLayer(layer: NoiseLayer): NoiseGenerator;
        setConversion(conversion: NoiseConversion): NoiseGenerator;
    }
    /**
     * Class representing single noise layer.
     */
    class NoiseLayer {
        constructor();
        addOctave(octave: NoiseOctave): NoiseLayer;
        setConversion(conversion: NoiseConversion): NoiseLayer;
    }
    type NoiseOctaveStringType = "perlin" | "gray" | "chess" | "sine_x" | "sine_y" | "sine_z" | "sine_xy" | "sine_yz" | "sine_xz" | "sine_xyz";
    /**
     * Class representing noise octave. Each noise layer consists of multiple
     * noise octaves of different scale and weight.
     */
    class NoiseOctave {
        /**
         * Creates a new noise octave of specified type.
         * @param type numeric type constant or one of the following strings:
         *
         * **"perlin"** (0) is a general-purpose noise generator.
         *
         * Used to generate noise of completely random nature
         * **"gray"** (1)
         * **"chess"** (2)
         *
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
     * Overrides default generator of vanilla dimension.
     * @param id vanilla dimension ID, one of the {@link EDimension}
     * values
     * @param generator custom landscape generator used for vanilla
     * dimension
     */
    function overrideGeneratorForVanillaDimension(id: number, generator: CustomGenerator): void;
    /**
     * @param name dimension name
     * @returns Dimension by it's string name specified in
     * {@link Dimensions.CustomDimension CustomDimension} constructor.
     */
    function getDimensionByName(name: string): CustomDimension;
    /**
     * @param id dimension ID
     * @returns Custom dimension by it's numeric ID.
     */
    function getDimensionById(id: number): CustomDimension;
    /**
     * @param id dimension ID
     * @returns `true`, if dimension is a limbo dimension; limbo dimension is
     * created by Horizon automatically if you try to teleport the player to
     * non-existing dimension
     */
    function isLimboId(id: number): boolean;
    /**
     * Transfers specified entity to the dimension with specified ID.
     * @param entity numeric ID of the
     * @param dimensionId numeric ID of the dimension to transfer the entity to
     */
    function transfer(entity: number, dimensionId: number): void;
    /**
     * @returns JS object instance, containing all registered custom biomes.
     * @since 2.2.1b93
     */
    function getAllRegisteredCustomBiomes(): { [key: string]: CustomBiome };
    /**
     * Function used to simplify the creation of terrain generator by passing
     * a json-like structure as a single generator parameter.
     * @param description object containing all the required generator information
     */
    function newGenerator(description: {
        /**
         * Specifies base generator, see {@link Dimensions.CustomGenerator CustomGenerator}
         * constructor for details.
         */
        base?: number | string,
        /**
         * Specifies whether to use vanilla biome surface cover blocks
         * (grass, sand, podzol, etc.).
         *
         * See {@link Dimensions.CustomGenerator.setBuildVanillaSurfaces setBuildVanillaSurfaces} for details.
         */
        buildVanillaSurfaces?: boolean,
        /**
         * Specifies whether to generate minecraft vanilla structures.
         *
         * See {@link Dimensions.CustomGenerator.setGenerateVanillaStructures setGenerateVanillaStructures} for details.
         */
        generateVanillaStructures?: boolean,
        /**
         * Can be either string for an existing dimensions (**"overworld"**,
         * **"nether"**, **"end"**) or -1 to disable mods generation.
         *
         * See {@link Dimensions.CustomGenerator.setModGenerationBaseDimension setModGenerationBaseDimension} for details.
         */
        modWorldgenDimension?: number | string,
        /**
         * Specifies what generator type to use. Default and the only currently
         * available option is "mono", that is equivalent to creating a
         * {@link MonoBiomeTerrainGenerator}.
         */
        type?: string,
        /**
         * Sets base biome for the current terrain, applicable only to **"mono"**.
         */
        biome?: number,
        /**
         * An array of terrain layers descriptions, each one representing it's
         * own terrain layer.
         *
         * See {@link Dimensions.MonoBiomeTerrainGenerator.addTerrainLayer MonoBiomeTerrainGenerator.addTerrainLayer} for details.
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
         * Noise octave type, see {@link Dimensions.NoiseOctave} for details.
         * @default "perlin"
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
 * Defines some useful methods for debugging.
 */
declare namespace Debug {
    /**
     * @returns Current system time in milliseconds.
     */
    function sysTime(): number;
    /**
     * Spawns vanilla debug particle on the specified coordinates.
     * @param id particle type ID, should be one of the {@link EParticleType}
     * @param vx x velocity
     * @param vy y velocity
     * @param vz y velocity
     * @param data additional particles data
     */
    function addParticle(id: number, x: number, y: number, z: number, vx: number, vy: number, vz: number, data: number): void;
    /**
     * Writes general debug message (in green) to local player in chat.
     * @param message message to be displayed
     */
    function message(message: string): void;
    /**
     * Writes warning debug message (in gold) to local player in chat.
     * @param message message to be displayed
     */
    function warning(message: string): void;
    /**
     * Writes error debug message (in red) to local player in chat.
     * @param message message to be displayed
     */
    function error(message: string): void;
    /**
     * Writes several comma-separated values to local player in chat as
     * a general debug message, serializing javascript objects if possible.
     * @param args messages to be displayed
     * @since 2.0.5b44
     */
    function m(...args: any[]): void;
    /**
     * Displays an {@link android.app.AlertDialog} with given title and bitmap.
     * @param bitmap android.graphics.Bitmap object of the bitmap to be
     * displayed
     * @param title title of the AlertDialog
     */
    function bitmap(bitmap: android.graphics.Bitmap, title: string): void;
    /**
     * Writes several values in JSON format to the selectable
     * alert window text view, serializing javascript objects if possible.
     * @param args messages to be displayed
     * @since 2.0.5b44
     */
    function big(...args: any[]): void;
}
/**
 * @deprecated Use behavior packs to creating entities.
 */
declare namespace MobRegistry {
    function registerEntity(name: any): CustomEntity;
    function registerUpdatableAsEntity(updatable: any): void;
    function spawnEntityAsPrototype(typeName: any, coords: any, extraData: any): CustomEntity;
    function getEntityUpdatable(entity: number): CustomEntity;
    /**
     * @deprecated Not implemented yet.
     */
    function registerNativeEntity(entity: number): undefined;
    function registerEntityRemove(entity: number): void;
    function resetEngine(): void;
}
/**
 * @deprecated Use behavior packs to register spawning
 * entities in server or use callbacks.
 */
declare namespace MobSpawnRegistry {
    function registerSpawn(entityType: number, rarity: number, condition?: () => boolean, denyNaturalDespawn?: boolean): void;
    interface SpawnInterface {
        type: number, rarity: number, condition: Nullable<() => boolean>, denyNaturalDespawn: boolean;
    }
    function getRandomSpawn(rarityMultiplier: number): any;
    function getRandPosition(): { x: number, z: number };
    function executeSpawn(spawn: SpawnInterface, position: { x: number, z: number }): void;
}
/**
 * @deprecated Use behavior packs instead.
 */
declare class CustomEntity {
    readonly nameId: string;
    readonly isInstance: boolean;
    readonly entity: Nullable<number>;
    addController(name: string, basicPrototype: any): CustomEntity;
    customizeController(name: string, customPrototype: object): void;
    /**
     * Customizes controller "event".
     */
    customizeEvents(custom: object): void;
    /**
     * Customizes controller "description".
     */
    customizeDescription(custom: object): void;
    /**
     * Customizes controller "visual".
     */
    customizeVisual(custom: object): void;
    /**
     * Customizes controller "AI".
     */
    customizeAI(custom: object): void;
    setBaseType(type: number): void;
    callControllerEvent(event: string, ...params: any[]): void;
    setNativeEntity(entity: number): void;
    recreateEntity(): void;
    getPlayerDistance(): number;
    denyDespawn(): void;
    allowNaturalDespawn(): void;
    destroy(): void;
}
/**
 * @deprecated Use resource packs or {@link Render} instead.
 */
declare class EntityModel {
    constructor(parentModel?: EntityModel);
    readonly isAnimated: boolean;
    readonly animator: any;
    /**
     * @internal
     */
    applyTextureResolution(): void;
    setTexture(texture: Texture): EntityModel;
    getTextureObj(): Texture;
    getTexture(): string;
    getTextureResolution(): number;
    setRender(render: Render): void;
    createAnimation(ticks: number, func: (tick: number, self: EntityModel) => Nullable<Render>, delay: number): EntityModel;
    resetAnimation(token: number): void;
    getTextureAndRender(token: number): { texture: Texture, render: number };
}
/**
 * @deprecated Use resource packs to customize entities
 * appearance or {@link Render} with {@link AttachableRender}.
 */
declare class EntityModelWatcher {
    constructor(entity: number, model: EntityModel);
    readonly model: EntityModel;
    readonly entity: number;
    readonly token: number;
    update(): void;
    resetAnimation(): void;
    destroy(): void;
}
/**
 * Module to create custom enchantments.
 * @since 2.2.1b105
 */
declare namespace CustomEnchant {
    /**
     * Object returned by {@link CustomEnchant.newEnchant} method.
     * Used to configure different custom enchantment behaviors.
     */
    interface EnchantSetupInterface {
        /**
         * The numeric ID of the following enchantment
         * to be used in different operations.
         * This ID will not change after the first generation,
         * same as it works with blocks' and items' IDs.
         */
        readonly id: number;
        /**
         * Sets the following enchantment frequency, possibly used in treasures.
         * @default 3
         * @returns Reference to itself to be used in sequential calls.
         */
        setFrequency(freq: number): EnchantSetupInterface;
        /**
         * Sets whether the following enchantment will be able
         * to be found in dungeon chests or not.
         * @default true
         * @returns Reference to itself to be used in sequential calls.
         */
        setIsLootable(lootable: boolean): EnchantSetupInterface;
        /**
         * Sets whether the following enchantment will be able
         * to be received on the enchanting table or not.
         * @default true
         * @returns Reference to itself to be used in sequential calls.
         */
        setIsDiscoverable(discoverable: boolean): EnchantSetupInterface;
        /**
         * Sets whether the following enchantment will be able
         * to be caught during fishing as a treasure, or not.
         * @default false
         * @returns Reference to itself to be used in sequential calls.
         */
        setIsTreasure(treasure: boolean): EnchantSetupInterface;
        /**
         * Sets the mask of items, that the following enchantment can be applied to,
         * paired parameter for item is enchant slot.
         * @returns Reference to itself to be used in sequential calls.
         * @default -1 = 0xFFFFFFFF // all
         */
        setMask(mask: number): EnchantSetupInterface;
        /**
         * Sets minimum and maximum level, that the following enchantment
         * will be able to have in legal conditions.
         * @default min: 1, max: 5
         * @returns Reference to itself to be used in sequential calls.
         */
        setMinMaxLevel(min: number, max: number): EnchantSetupInterface;
        /**
         * Sets linear dependency of enchant cost by level,
         * the formula is `level * b + c`.
         * @returns Reference to itself to be used in sequential calls.
         */
        setMinMaxCost(bMin: number, cMin: number, bMax: number, cMax: number): EnchantSetupInterface;
        /**
         * Defines the function that will be called, when item with following enchantment is used for attack.
         * The function must return bonus damage dealt to the victim.
         * @returns Reference to itself to be used in sequential calls.
         * @beta This method is highly experimental right now.
         */
        setAttackDamageBonusProvider(func: AttackDamageBonusProvider): EnchantSetupInterface;
        /**
         * Defines the function that will be called after the item with following enchantment is used for attack.
         * @returns Reference to itself to be used in sequential calls.
         * @beta This method is highly experimental right now.
         */
        setPostAttackCallback(func: DamageCallback): EnchantSetupInterface;
        /**
         * Defines the function that will be called, when the entity wearing item
         * with following enchantment, is hit.
         * The function must return bonus protection value.
         * @returns Reference to itself to be used in sequential calls.
         * @beta This method is highly experimental right now.
         */
        setProtectionBonusProvider(func: ProtectionBonusProvider): EnchantSetupInterface;
        /**
         * Defines the function that will be called, when the entity wearing item
         * with following enchantment, is hit.
         * @returns Reference to itself to be used in sequential calls.
         * @beta This method is highly experimental right now.
         */
        setPostHurtCallback(func: DamageCallback): EnchantSetupInterface;
    }
    /**
     * Registers new custom enchantment from given name ID and displayed name.
     * @param nameID internal string ID of the enchantment
     * @param displayedName enchantment name that will be displayed in the
     * tooltips of the items having this enchant.
     * Use {@link Translation} module to make localization of the displayed name
     * @returns Object to work with different enchantment behaviors.
     */
    function newEnchant(nameID: string, displayedName: string): EnchantSetupInterface;
    /**
     * Function interface used in
     * {@link CustomEnchant.EnchantSetupInterface.setAttackDamageBonusProvider EnchantSetupInterface.setAttackDamageBonusProvider} method.
     */
    interface AttackDamageBonusProvider {
        (damage: number, entity: number): number;
    }
    /**
     * Function interface used in
     * {@link CustomEnchant.EnchantSetupInterface.setPostAttackCallback EnchantSetupInterface.setPostAttackCallback} and
     * {@link CustomEnchant.EnchantSetupInterface.setPostHurtCallback EnchantSetupInterface.setPostHurtCallback} methods.
     */
    interface DamageCallback {
        (item: ItemInstance, damage: number, entity1: number, entity2: number): void;
    }
    /**
     * Function interface used in
     * {@link CustomEnchant.EnchantSetupInterface.setProtectionBonusProvider EnchantSetupInterface.setProtectionBonusProvider} method.
     */
    interface ProtectionBonusProvider {
        (damage: number, damageType: number, entity: number): number;
    }
}
/**
 * Class used to create custom biomes. Note that Minecraft has a limit of 256 biomes
 * and there are already more than 100 vanilla biomes, so do not overuse
 * this functionality.
 */
declare class CustomBiome {
    /**
     * @returns Object instance, with all custom
     * biomes registered by every mod.
     */
    static getAllCustomBiomes(): java.util.Map<String, CustomBiome>;
    /**
     * @returns Whether biome is invalid.
     */
    isInvalid(): boolean;
    /**
     * Crates a new custom biome with specified string identifier.
     * @param name string identifier of the biome
     */
    constructor(name: string);
    /**
     * custom biome numeric ID.
     */
    readonly id: number;
    /**
     * Custom biome name.
     */
    readonly name: string;
    /**
     * Pointer to biome's native object,
     * represented as long number.
     */
    readonly pointer: number;
    /**
     * Sets biome's grass color. Grass color is interpolated on the bounds of
     * the biome.
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns Reference to itself to be used in sequential calls.
     */
    setGrassColor(r: number, g: number, b: number): CustomBiome;
    /**
     * Sets biome's grass color. Grass color is interpolated on the bounds of
     * the biome.
     * @param color integer color value (you can specify it using hex value)
     * @returns Reference to itself to be used in sequential calls.
     */
    setGrassColor(color: number): CustomBiome;
    /**
     * Sets biome's sky color.
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns Reference to itself to be used in sequential calls.
     * @since 2.4.0b120
     */
    setSkyColor(r: number, g: number, b: number): CustomBiome;
    /**
     * Sets biome's sky color.
     * @param color integer color value (you can specify it using hex value)
     * @returns Reference to itself to be used in sequential calls.
     */
    setSkyColor(color: number): CustomBiome;
    /**
     * Sets biome's foliage color.
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns Reference to itself to be used in sequential calls.
     */
    setFoliageColor(r: number, g: number, b: number): CustomBiome;
    /**
     * Sets biome's foliage color.
     * @param color integer color value (you can specify it using hex value)
     * @returns Reference to itself to be used in sequential calls.
     */
    setFoliageColor(color: number): CustomBiome;
    /**
     * Sets biome's water color.
     * @param r red color component, value from 0 to 1
     * @param g green color component, value from 0 to 1
     * @param b blue color component, value from 0 to 1
     * @returns Reference to itself to be used in sequential calls.
     */
    setWaterColor(r: number, g: number, b: number): CustomBiome;
    /**
     * Sets biome's water color.
     * @param color integer color value (you can specify it using hex value)
     * @returns Reference to itself to be used in sequential calls.
     */
    setWaterColor(color: number): CustomBiome;
    /**
     * Sets biome's temperature and downfall.
     * @param temperature temperature value, from 0 to 1
     * @param downfall downfall value, from 0 to 1
     * @returns Reference to itself to be used in sequential calls.
     */
    setTemperatureAndDownfall(temperature: number, downfall: number): CustomBiome;
    /**
     * Specifies the block that will cover the biome; e.g., most of the biomes
     * use grass as cover block, though some of the biomes use other blocks
     * (sand, ice, etc.).
     * @param id block's tile ID
     * @param data block data
     * @returns Reference to itself to be used in sequential calls.
     */
    setCoverBlock(id: number, data: number): CustomBiome;
    /**
     * Specifies the block that will be under the covering block of the biome;
     * e.g., most of the biomes use dirt as cover block,
     * though some of the biomes use other blocks.
     * @param id block's tile ID
     * @param data block data
     * @returns Reference to itself to be used in sequential calls.
     */
    setSurfaceBlock(id: number, data: number): CustomBiome;
    /**
     * Sets the block that fills the terrain. Vanilla biomes use stone filling.
     * @param id block's tile ID
     * @param data block data
     * @returns Reference to itself to be used in sequential calls.
     */
    setFillingBlock(id: number, data: number): CustomBiome;
    /**
     * Sets the block that fills the floor at the bottom of the sea or the ocean.
     * Vanilla biomes use gravel or stone filling.
     * @param id block's tile ID
     * @param data block data
     * @returns Reference to itself to be used in sequential calls.
     */
    setSeaFloorBlock(id: number, data: number): CustomBiome;
    /**
     * Specifies the block that will cover the biome. E.g. most of the biomes
     * use grass as cover block, though some of the biomes use other blocks
     * (sand, ice, etc.).
     * @param id block's tile ID
     * @param data block data
     * @returns Reference to itself to be used in sequential calls.
     * @deprecated Use {@link CustomBiome.setSurfaceBlock} instead.
     */
    setAdditionalBlock(id: number, data: number): CustomBiome;
    /**
     * Sets the average depth of the sea floor in this biome.
     * @param depth depth of the see floor by Y-axis.
     * @returns Reference to itself to be used in sequential calls.
     */
    setSeaFloorDepth(depth: number): CustomBiome;
    /**
     * Sets the average depth of the something in this biome.
     * @param param some integer parameter.
     * @returns Reference to itself to be used in sequential calls.
     * @default 7
     * @deprecated Use {@link CustomBiome.setSeaFloorDepth} instead.
     */
    setSurfaceParam(param: number): CustomBiome;
    /**
     * Defines the server-side biome params from given JSON string.
     * @returns Reference to itself to be used in sequential calls.
     * @throws {@link java.lang.IllegalArgumentException} if the string cannot be parsed.
     * @example
     * Many thanks to DansZbar2 for the example!
     * ```js
     * const CHERRY_BIOME = new CustomBiome("environmental_cherry");
     * CHERRY_BIOME.setServerJson(JSON.stringify({
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
     *            [ "warm", 35 ]
     *        ]
     *     }
     * }));
     * ```
     */
    setServerJson(json: string): CustomBiome;
    /**
     * Defines the client-side biome params from given JSON string.
     * @returns Reference to itself to be used in sequential calls.
     * @throws {@link java.lang.IllegalArgumentException} if the string cannot be parsed.
     * @example
     * Many thanks to DansZbar2 for the example!
     * ```js
     * const CHERRY_BIOME = new CustomBiome("environmental_cherry");
     * CHERRY_BIOME.setClientJson(JSON.stringify({
     *     "water_surface_color": "#d176e1",
     *     "water_fog_color": "#a35dc2",
     *     "water_surface_transparency": 0.7,
     *     "water_fog_distance": 11,
     *     // custom fog defined in the addon
     *     "fog_identifier": "environmental:environmental_cherry"
     * }));
     * ```
     */
    setClientJson(json: string): CustomBiome;
}
/**
 * Json configuration file reading/writing utility.
 */
declare class Config extends com.zhekasmirnov.innercore.mod.build.Config {
    static class: java.lang.Class<Config>;
}
declare namespace Config {
    /**
     * Class representing config value with it's path withing Config object.
     */
    class ConfigValue extends com.zhekasmirnov.innercore.mod.build.Config.ConfigValue {
        static class: java.lang.Class<ConfigValue>;
    }
}
/**
 * Namespace used to manipulate Minecraft commands.
 */
declare namespace Commands {
    /**
     * Executes specified command.
     * @param command command to be executed
     * @returns Error message or null if the command was run successfully.
     */
    function exec(command: string): Nullable<string>;
    /**
     * Executes specified command using specified coordinates as command
     * location for all relative calculations.
     * @param command command to be executed
     * @returns Error message or null if the command was run successfully.
     */
    function execAt(command: string, x: number, y: number, z: number): Nullable<string>;
}
/**
 * Module used to handle callbacks. Investigate details about the
 * callback mechanism and the list of pre-defined callbacks.
 */
declare namespace Callback {
    /**
     * Adds callback function for the specified callback name. Most of native
     * events can be prevented using {@link Game.prevent} call.
     * @param name callback name, should be one of the pre-defined or a custom
     * name if invoked via {@link Callback.invokeCallback}
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
    function addCallback(name: "PreLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "APILoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "ModsLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "PostLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "PreBlocksDefined", func: { (): void }, priority?: number): void;
    function addCallback(name: "BlocksDefined", func: { (): void }, priority?: number): void;
    function addCallback(name: "AddRuntimePacks", func: { (): void }, priority?: number): void;
    function addCallback(name: "LevelSelected", func: LevelSelectedFunction, priority?: number): void;
    /**
     * @since 2.0.4b37
     */
    function addCallback(name: "DimensionLoaded", func: DimensionLoadedFunction, priority?: number): void;
    function addCallback(name: "DestroyBlock", func: DestroyBlockFunction, priority?: number): void;
    function addCallback(name: "DestroyBlockStart", func: DestroyBlockFunction, priority?: number): void;
    function addCallback(name: "DestroyBlockContinue", func: DestroyBlockContinueFunction, priority?: number): void;
    function addCallback(name: "BuildBlock", func: BuildBlockFunction, priority?: number): void;
    function addCallback(name: "BlockChanged", func: BlockChangedFunction, priority?: number): void;
    /**
     * @since 2.2.0b83
     */
    function addCallback(name: "BreakBlock", func: BreakBlockFunction, priority?: number): void;
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
    /**
     * @since 2.2.1b93
     */
    function addCallback(name: "EntityAddedLocal", func: EntityAddedFunction, priority?: number): void;
    /**
     * @since 2.2.1b93
     */
    function addCallback(name: "EntityRemovedLocal", func: EntityRemovedFunction, priority?: number): void;
    function addCallback(name: "EntityDeath", func: EntityDeathFunction, priority?: number): void;
    function addCallback(name: "EntityHurt", func: EntityHurtFunction, priority?: number): void;
    function addCallback(name: "EntityInteract", func: EntityInteractFunction, priority?: number): void;
    function addCallback(name: "ExpOrbsSpawned", func: ExpOrbsSpawnedFunction, priority?: number): void;
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
    /**
     * @since 2.2.1b105
     */
    function addCallback(name: "EnchantPostAttack", func: CustomEnchant.DamageCallback, priority?: number): void;
    /**
     * @since 2.2.1b105
     */
    function addCallback(name: "EnchantGetProtectionBonus", func: CustomEnchant.ProtectionBonusProvider, priority?: number): void;
    /**
     * @since 2.2.1b105
     */
    function addCallback(name: "EnchantGetDamageBonus", func: CustomEnchant.AttackDamageBonusProvider, priority?: number): void;
    /**
     * @since 2.2.1b105
     */
    function addCallback(name: "EnchantPostHurt", func: CustomEnchant.DamageCallback, priority?: number): void;
    function addCallback(name: "GenerateChunk", func: GenerateChunkFunction, priority?: number): void;
    /**
     * @deprecated Use "GenerateChunk" with condition instead.
     */
    function addCallback(name: "GenerateChunkUnderground", func: GenerateChunkFunction, priority?: number): void;
    function addCallback(name: "GenerateNetherChunk", func: GenerateChunkFunction, priority?: number): void;
    function addCallback(name: "GenerateEndChunk", func: GenerateChunkFunction, priority?: number): void;
    function addCallback(name: "GenerateChunkUniversal", func: GenerateChunkFunction, priority?: number): void;
    /**
     * @since 2.0.1b11
     */
    function addCallback(name: "GenerateBiomeMap", func: GenerateChunkFunction, priority?: number): void;
    /**
     * @since 2.2.0b84
     */
    function addCallback(name: "PreProcessChunk", func: GenerateChunkFunction, priority?: number): void;
    /**
     * @since 2.2.0b84
     */
    function addCallback(name: "PostProcessChunk", func: GenerateChunkFunction, priority?: number): void;
    function addCallback(name: "ReadSaves", func: SavesFunction, priority?: number): void;
    function addCallback(name: "WriteSaves", func: SavesFunction, priority?: number): void;
    function addCallback(name: "CustomBlockTessellation", func: CustomBlockTessellationFunction, priority?: number): void;
    function addCallback(name: "LocalPlayerTick", func: PlayerTickFunction, priority?: number): void;
    function addCallback(name: "ServerPlayerTick", func: PlayerTickFunction, priority?: number): void;
    function addCallback(name: "CustomDimensionTransfer", func: CustomDimensionTransferFunction, priority?: number): void;
    function addCallback(name: "BlockEventEntityInside", func: Block.EntityInsideFunction, priority?: number): void;
    function addCallback(name: "BlockEventEntityStepOn", func: Block.EntityStepOnFunction, priority?: number): void;
    function addCallback(name: "BlockEventNeighbourChange", func: Block.NeighbourChangeFunction, priority?: number): void;
    function addCallback(name: "PopBlockResources", func: PopBlockResourcesFunction, priority?: number): void;
    /**
     * @since 2.1.0b57
     */
    function addCallback(name: "ConnectingToHost", func: ConnectingToHostFunction, priority?: number): void;
    /**
     * @since 2.0.4b37
     */
    function addCallback(name: "DimensionUnloaded", func: DimensionUnloadedFunction, priority?: number): void;
    function addCallback(name: "LevelPreLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "GameLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "LevelLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "LocalLevelLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "LocalLevelPreLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "ServerLevelLeft", func: { (): void }, priority?: number): void;
    function addCallback(name: "ServerLevelPreLeft", func: { (): void }, priority?: number): void;
    /**
     * @since 2.1.0b57
     */
    function addCallback(name: "ItemUseLocal", func: ItemUseLocalFunction, priority?: number): void;
    function addCallback(name: "SystemKeyEventDispatched", func: SystemKeyEventDispatchedFunction, priority?: number): void;
    function addCallback(name: "NavigationBackPressed", func: { (): void }, priority?: number): void;
    function addCallback(name: "LevelCreated", func: { (): void }, priority?: number): void;
    function addCallback(name: "LevelDisplayed", func: { (): void }, priority?: number): void;
    function addCallback(name: "LevelPreLoaded", func: LevelLoadedFunction, priority?: number): void;
    function addCallback(name: "LevelLoaded", func: LevelLoadedFunction, priority?: number): void;
    function addCallback(name: "LocalLevelLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "RemoteLevelLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "RemoteLevelPreLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "ServerLevelLoaded", func: { (): void }, priority?: number): void;
    function addCallback(name: "ServerLevelPreLoaded", func: { (): void }, priority?: number): void;
    /**
     * @deprecated Use `LocalTick` instead.
     */
    function addCallback(name: "tick", func: { (): void }, priority?: number): void;
    function addCallback(name: "LocalTick", func: { (): void }, priority?: number): void;
    function addCallback(name: "AppSuspended", func: { (): void }, priority?: number): void;
    function addCallback(name: "EntityPickUpDrop", func: EntityPickUpDropFunction, priority?: number): void;
    function addCallback(name: "LocalPlayerLoaded", func: PlayerFunction, priority?: number): void;
    function addCallback(name: "ServerPlayerLoaded", func: PlayerFunction, priority?: number): void;
    function addCallback(name: "ServerPlayerLeft", func: PlayerFunction, priority?: number): void;
    function addCallback(name: "LocalPlayerChangedDimension", func: PlayerChangedDimensionFunction, priority?: number): void;
    function addCallback(name: "PlayerChangedDimension", func: PlayerChangedDimensionFunction, priority?: number): void;
    function addCallback(name: "LocalPlayerEat", func: PlayerEatFunction, priority?: number): void;
    function addCallback(name: "ServerPlayerEat", func: PlayerEatFunction, priority?: number): void;
    function addCallback(name: "GenerateCustomDimensionChunk", func: GenerateCustomDimensionChunkFunction, priority?: number): void;
    function addCallback(name: "TileEntityAdded", func: TileEntityAddedFunction, priority?: number): void;
    function addCallback(name: "TileEntityRemoved", func: TileEntityRemovedFunction, priority?: number): void;
    /**
     * Invokes callback with any name and up to 10 additional parameters. You
     * should not generally call pre-defined callbacks until you really need to
     * do so. If you want to trigger some event in your mod, use your own
     * callback names.
     * @param name callback name
     */
    function invokeCallback(name: string, o1?: any, o2?: any, o3?: any, o4?: any, o5?: any, o6?: any, o7?: any, o8?: any, o9?: any, o10?: any): void;
    /**
     * Function used in "CraftRecipePreProvided" callback.
     * @param recipe object containing recipe information
     * @param field object containing crafting field information
     */
    interface CraftRecipePreProvidedFunction {
        (recipe: Recipes.WorkbenchRecipe, field: Recipes.WorkbenchField): void
    }
    /**
     * Function used in "CraftRecipeProvided" callback.
     * @param recipe object containing recipe information
     * @param field object containing crafting field information
     * @param isPrevented if true, recipe was prevented by craft function
     */
    interface CraftRecipeProvidedFunction {
        (recipe: Recipes.WorkbenchRecipe, field: Recipes.WorkbenchField, isPrevented: boolean): void
    }
    /**
     * Function used in "VanillaWorkbenchCraft" and "VanillaWorkbenchPostCraft"
     * callbacks.
     * @param result recipe result item
     * @param workbenchContainer workbench container instance
     */
    interface VanillaWorkbenchCraftFunction {
        (result: ItemInstance, workbenchContainer: UI.Container, player: number): void
    }
    /**
     * Function used in "VanillaWorkbenchRecipeSelected" callback.
     * @param recipe object containing recipe information
     * @param result recipe result item
     * @param workbenchContainer workbench container instance
     */
    interface VanillaWorkbenchRecipeSelectedFunction {
        (recipe: Recipes.WorkbenchRecipe, result: ItemInstance, workbenchContainer: UI.Container)
    }
    /**
     * Function used in "ContainerClosed" callback.
     * @param container container that was closed
     * @param window window that was loaded in the container
     * @param byUser if true, container was closed by user, from the code
     * otherwise
     */
    interface ContainerClosedFunction {
        (container: UI.Container, window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow, byUser: boolean): void
    }
    /**
     * Function used in "ContainerOpened" callback.
     * @param container container that was opened
     * @param window window that was loaded in the container
     */
    interface ContainerOpenedFunction {
        (container: UI.Container, window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow | UI.WindowGroup): void
    }
    /**
     * Function used in "CustomWindowOpened" callback.
     * @param window window that was opened
     */
    interface CustomWindowOpenedFunction {
        (window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow): void;
    }
    /**
     * Function used in "CustomWindowClosed" callback.
     * @param window window that was closed
     */
    interface CustomWindowClosedFunction {
        (window: com.zhekasmirnov.innercore.api.mod.ui.window.IWindow): void;
    }
    /**
     * Function used in "CoreConfigured" callback.
     * @param config Inner Core default config instance
     */
    interface CoreConfiguredFunction {
        (config: Config): void;
    }
    /**
     * Function used in "LevelSelected" callback.
     * @param worldName name of the selected world
     * @param worldDir name of the directory where the world is stored. Worlds
     * directories are located at games/horizon/minecraftWorlds/
     */
    interface LevelSelectedFunction {
        (worldName: string, worldDir: string): void
    }
    /**
     * Function used in "DimensionLoaded" callback.
     * @param currentId vanilla dimension ID, one of the {@link EDimension}
     * values, or custom dimension ID
     * @param lastId previous unloaded dimension ID
     */
    interface DimensionLoadedFunction {
        (currentId: number, lastId: number): void
    }
    /**
     * Function used in "LocalPlayerChangedDimension" and "PlayerChangedDimension" callback.
     * @param player player entity unique numeric ID
     * @param currentId vanilla dimension ID, one of the {@link EDimension}
     * values, or custom dimension ID
     * @param lastId previous unloaded dimension ID
     */
    interface PlayerChangedDimensionFunction {
        (player: number, currentId: number, lastId: number): void
    }
    /**
     * Function used in "DestroyBlock" and "DestroyBlockStart" callbacks.
     * @param coords coordinates where the block is destroyed and side from
     * where it is destroyed
     * @param block block that is destroyed
     * @param player player entity unique numeric ID
     */
    interface DestroyBlockFunction {
        (coords: ItemUseCoordinates, block: Tile, player: number): void
    }
    /**
     * Function used in "DestroyBlockContinue" callback.
     * @param coords coordinates where the block is destroyed and side from
     * where it is destroyed
     * @param block block that is destroyed
     * @param progress current fraction of breaking progress
     */
    interface DestroyBlockContinueFunction {
        (coords: ItemUseCoordinates, block: Tile, progress: number): void
    }
    /**
     * Function used in "BuildBlock" callback.
     * @param coords coordinates where the block is placed and side from
     * where it is placed
     * @param block block that is placed
     * @param player player entity unique numeric ID
     */
    interface BuildBlockFunction {
        (coords: ItemUseCoordinates, block: Tile, player: number): void
    }
    /**
     * Function used in "BlockChanged" callback.
     * @param coords coordinates where block change occurred
     * @param oldBlock the block that is being replaced
     * @param newBlock replacement block
     * @param region BlockSource object
     */
    interface BlockChangedFunction {
        (coords: Vector, oldBlock: Tile, newBlock: Tile, region: BlockSource): void
    }
    /**
     * Function used in "BreakBlock" callback.
     * @param region BlockSource object
     * @param coords coordinates where the block is placed and side from
     * where it is placed
     * @param block block that is placed
     * @param player player entity unique numeric ID
     * @param item item that was in the player's hand when it breaked the block
     */
    interface BreakBlockFunction {
        (region: BlockSource, coords: ItemUseCoordinates, block: Tile, dropAllowed: boolean, player: number, item: ItemInstance): void
    }
    /**
     * Function used in "ItemUse" and "ItemUseLocalServer" callbacks.
     * @param coords set of all coordinate values that can be useful to write
     * custom use logics
     * @param item item that was in the player's hand when it touched the block
     * @param block block that was touched
     * @param isExternal
     * @param player player entity UID
     */
    interface ItemUseFunction {
        (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number): void
    }
    /**
     * Function used in "ItemUseLocal" callback, and also in
     * {@link Item.registerUseFunction} and {@link Item.registerUseFunctionForID} methods.
     * @param coords set of all coordinate values that can be useful to write
     * custom use logics
     * @param item item that was in the player's hand when it touched the block
     * @param block block that was touched
     * @param player player entity UID
     */
    interface ItemUseLocalFunction {
        (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void
    }
    /**
     * Function used in "Explosion" callback.
     * @param coords coordinates of the explosion
     * @param params additional explosion data
     * @param params.power explosion power
     * @param params.entity if explosion is produced by an entity, entity unique
     * ID, -1 otherwise
     * @param onFire if true, explosion produced the fire
     * @param someBool some boolean value
     * @param someFloat some floating point value
     */
    interface ExplosionFunction {
        (coords: Vector, params: { power: number, entity: number, onFire: boolean, someBool: boolean, someFloat: number }): void
    }
    /**
     * Function used in the "FoodEaten" callback. You can use
     * {@link Entity.getCarriedItem} to get info about food item.
     * @param food food amount produced by eaten food
     * @param ratio saturation ratio produced by food
     * @param player player entity UID
     */
    interface FoodEatenFunction {
        (food: number, ratio: number, player: number): void
    }
    /**
     * Function used in the "LocalPlayerEat" and "ServerPlayerEat" callback.
     * You can use {@link Entity.getCarriedItem} to get info about food item.
     * @param player player entity UID
     * @param food food amount produced by eaten food
     * @param ratio saturation ratio produced by food
     */
    interface PlayerEatFunction {
        (player: number, food: number, ratio: number): void
    }
    /**
     * Function used in "ExpAdd" callback.
     * @param exp amount of experience to be added
     * @param player player's uID
     */
    interface ExpAddFunction {
        (exp: number, player: number): void
    }
    /**
     * Function used in "ExpLevelAdd" callback.
     * @param level amount of levels to be added
     * @param player player's uID
     */
    interface ExpLevelAddFunction {
        (level: number, player: number): void
    }
    /**
     * Function used in "ExpOrbsSpawned" callback.
     * @param region BlockSource object
     * @param amount amount of experience to be added
     * @param coords dropped orbs entity coordinates
     * @param player player entity unique numeric ID
     */
    interface ExpOrbsSpawnedFunction {
        (region: BlockSource, amount: number, coords: Vector, player: number): void
    }
    /**
     * Function used in "NativeCommand" callback.
     * @param command command that was entered or null if no command was
     * provided
     */
    interface NativeCommandFunction {
        (command: Nullable<string>): void
    }
    /**
     * Function used in "TileEntityAdded" callback.
     */
     interface TileEntityAddedFunction {
        (updatable: Updatable | TileEntity, isTileEntity: boolean): void
    }
    /**
     * Function used in "TileEntityRemoved" callback.
     */
     interface TileEntityRemovedFunction {
        (updatable: Updatable | TileEntity): void
    }
    /**
     * Function used in "PlayerAttack" callback.
     * @param attacker player entity unique ID
     * @param victim attacked entity unique ID
     */
    interface PlayerAttackFunction {
        (attacker: number, victim: number): void
    }
    /**
     * Function used in "EntityAdded" callback.
     * @param entity entity unique ID
     */
    interface EntityAddedFunction {
        (entity: number): void
    }
    /**
     * Function used in "EntityRemoved" callback.
     * @param entity entity unique ID
     */
    interface EntityRemovedFunction {
        (entity: number): void
    }
    /**
     * Function used in "EntityDeath" callback.
     * @param attacker entity that caused damage, determines actor of damage source, `-1` otherwise
     * @param damageType existing damage source or any inclusive value between 25 and 32
     */
    interface EntityDeathFunction {
        (entity: number, attacker: number, damageType: Entity.DamageSources | number): void
    }
    /**
     * Function used in "EntityHurt" callback.
     * @param attacker entity that caused damage, determines actor of damage source, `-1` otherwise
     * @param damageValue produced damage value in half-hearts
     * @param damageType existing damage source or any inclusive value between 25 and 32
     * @param armorReducesDamage if `true`, damage can be reduced by armor
     */
    interface EntityHurtFunction {
        (attacker: number, entity: number, damageValue: number, damageType: Entity.DamageSources | number, armorReducesDamage: boolean): void
    }
    /**
     * Function used in "EntityInteract" callback.
     * @param entity entity unique ID
     * @param player player entity unique ID
     */
    interface EntityInteractFunction {
        (entity: number, player: number, coords: Vector): void
    }
    /**
     * Function used in "ProjectileHit" callback.
     * @param projectile projectile entity unique ID
     * @param item projectile item
     * @param target object containing hit coordinates and information about
     * hit entity/block
     */
    interface ProjectileHitFunction {
        (projectile: number, item: ItemInstance, target: ProjectileHitTarget): void
    }
    /**
     * Function used in "RedstoneSignal" callback.
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
     * Function used in "PopBlockResources" callback.
     * @param coords coordinates of the block that was broken
     * @param block information about the block that was broken
     * @param i unknown parameter, supposed to always be zero
     */
    interface PopBlockResourcesFunction {
        (coords: Vector, block: Tile, explosionRadius: number, i: number, region: BlockSource): void
    }
    /**
     * Function used in "ItemIconOverride" callback.
     * @param item information about item that is used in override function
     * @param isModUi whether icon override is working in mod ui or in vanilla one
     * @returns Nothing if used in callback, {@link Item.TextureData} if used in item
     * override function to return texture that will be used for the item.
     */
    interface ItemIconOverrideFunction {
        (item: ItemInstance, isModUi: boolean): void | Item.TextureData
    }
    /**
     * Function used in "ItemNameOverride" callback.
     * @param item information about item that is used in override function
     * @param translation translated item name
     * @param name original item name
     * @returns Nothing if used in callback, string if used in item override
     * function to return new name that will be displayed.
     */
    interface ItemNameOverrideFunction {
        (item: ItemInstance, translation: string, name: string): void | string;
    }
    /**
     * Function used in "ItemUseNoTarget" callback.
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks player kept touching screen
     */
    interface ItemUseNoTargetFunction {
        (item: ItemInstance, player: number): void
    }
    /**
     * Function used in "ItemUsingReleased" callback.
     * @param item item that was in the player's hand when the event occurred
     * @param ticks amount of ticks left to the specified max use duration value
     */
    interface ItemUsingReleasedFunction {
        (item: ItemInstance, ticks: number, player: number): void
    }
    /**
     * Function used in "ItemUsingComplete" callback.
     * @param item item that was in the player's hand when the event occurred
     */
    interface ItemUsingCompleteFunction {
        (item: ItemInstance, player: number): void
    }
    /**
     * Function used in "ItemDispensed" callback.
     * @param coords full coords object, where the main coords are the position of the dispenser block,
     * `relative` ones are the position of the block to which the dispenser is pointed,
     * and `vec` are the coords for the item to be dropped at
     * @param item item that was dispensed
     * @param region BlockSource object
     * @param slot numeric ID of the slot from which the item was dispensed
     */
    interface ItemDispensedFunction {
        (coords: Callback.ItemUseCoordinates, item: ItemInstance, region: BlockSource, slot: number): void
    }
    /**
     * Function used in "NativeGuiChanged" callback.
     * @param screenName current screen name
     * @param lastScreenName previous screen name
     * @param isPushEvent if true, the new screen was pushed on the Minecraft
     * screens stack, popped from the stack otherwise
     */
    interface NativeGuiChangedFunction {
        (screenName: string, lastScreenName: string, isPushEvent: boolean): void
    }
    /**
     * Function used in all generation callbacks.
     * @param chunkX chunk X coordinate. Multiply by 16 to receive corner block
     * coordinates
     * @param chunkY chunk Y coordinate. Multiply by 16 to receive corner block
     * coordinates
     * @param random java.util.Random object that should be used for generation
     * process. Already seeded by appropriate values
     * @param dimensionId current dimension's numeric ID
     * @param chunkSeed chunk-specific seed to use in chunk random generation
     * @param chunkSeed world-specific seed to use in chunk generation
     * @param dimensionSeed dimension-specific seed to use in chunk generation
     */
    interface GenerateChunkFunction {
        (chunkX: number, chunkZ: number, random: java.util.Random,
            dimensionId: number, chunkSeed: number, worldSeed: number, dimensionSeed: number): void
    }
    /**
     * Function used in "ReadSaves" and "WriteSaves" callbacks.
     * Avoid modifying values directly, consider using {@link Saver} instead.
     */
    interface SavesFunction {
        (globalScope: object): void
    }
    /**
     * Function used in "CustomBlockTessellation" callback.
     * @param api object used to manipulate block rendering process
     * @param coords rendering block coordinates
     * @param block block information
     * @param b unused Boolean parameter
     */
    interface CustomBlockTessellationFunction {
        (api: BlockRenderer.RenderAPI, coords: Vector, block: Tile, b: boolean): void
    }
	/**
     * Function used in "LocalPlayerTick" and "ServerPlayerTick" callback.
     * @param playerUid player entity unique ID
     * @param isPlayerDead is following player dead
     */
    interface PlayerTickFunction {
        (playerUid: number, isPlayerDead?: boolean): void
    }
    /**
     * Function used in "CustomDimensionTransfer" callback.
     * @param entity entity that was transferred between dimensions
     * @param from ID of the dimension the entity was transferred from
     * @param to ID of the dimension the entity was transferred to
     */
    interface CustomDimensionTransferFunction {
    	(entity: number, from: number, to: number): void
    }
    /**
     * Function used in "ConnectingToHost" callback.
     */
    interface ConnectingToHostFunction {
        (host: string, minecraftPort: number, moddedPort: number): void
    }
    /**
     * Function used in "DimensionUnloaded" callback.
     */
    interface DimensionUnloadedFunction {
        (dimensionId: number): void
    }
    /**
     * Function used in "SystemKeyEventDispatched" callback.
     * @param key key code in Java
     */
    interface SystemKeyEventDispatchedFunction {
        (key: number, state: number): void
    }
    /**
     * Function used in "LevelLoaded" and "LevelPreLoaded" callbacks.
     * @todo understand param's meaning
     */
    interface LevelLoadedFunction {
        (isServer: boolean): void
    }
    /**
     * Function used in "EntityPickUpDrop" callback.
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
     * Function used in "LocalPlayerLoaded", "ServerPlayerLoaded" and "ServerPlayerLeft" callback.
     * @param player unique ID of the player entity, that has been connected to server
     */
    interface PlayerFunction {
        (player: number): void
    }
    /**
     * Function used in "GenerateCustomDimensionChunk" callback.
     */
    interface GenerateCustomDimensionChunkFunction {
        (chunkX: number, chunkZ: number, random: java.util.Random, dimensionId: number): void
    }
    /**
     * Object containing hit coordinates and information about hit entity/block.
     */
    interface ProjectileHitTarget {
        /**
         * Exact hit position x.
         */
        x: number,
        /**
         * Exact hit position y.
         */
        y: number,
        /**
         * Exact hit position z.
         */
        z: number,
        /**
         * If an entity was hit, entity unique ID, `-1` otherwise.
         */
        entity: number,
        /**
         * Coordinates and side of the hit block or null if an entity was hit.
         */
        coords: Nullable<ItemUseCoordinates>
    }
    /**
     * Object used in some callbacks for coordinate set with side information
     * and relative coordinates set.
     */
    interface ItemUseCoordinates extends BlockPosition {
        /**
         * Relative coordinates, coordinates of the block to the specified side
         * of current block.
         */
        relative: Vector,
        /**
         * Exact touch point, absolute point coordinates. Used only in "ItemUse"
         * callback.
         */
        vec?: Vector
    }
}
/**
 * Class to work with vanilla blocks parameters.
 */
declare class BlockState implements Tile {
    /**
     * Data of the block.
     */
    readonly data: number;
    /**
     * Numeric ID of the block.
     */
    readonly id: number;
    /**
     * Constructs new BlockState object
     * from given ID and data.
     */
    constructor(id: number, data: number);
    /**
     * Constructs new BlockState object
     * from given ID and states object.
     */
    constructor(id: number, scriptable: {[key: number]: number});
    /**
     * @returns ID of the block.
     */
    getId(): number;
    /**
     * @returns Data of the block.
     */
    getData(): number;
    /**
     * @returns ID of the blockstate in runtime.
     */
    getRuntimeId(): number;
    /**
     * @returns Whether the state is valid.
     */
    isValidState(): boolean;
    /**
     * @returns State of the given number
     * if it's present in the following object.
     */
    getState(state: number): number;
    /**
     * @returns Whether the state by given number
     * is present in the following object.
     */
    hasState(state: number): boolean;
    /**
     * Adds state to the following object.
     * @returns BlockState object itself.
     */
    addState(state: number, value: number): BlockState;
    /**
     * Adds states to the following object
     * from given map instance.
     * @returns BlockState object itself.
     */
    addStates(states: java.util.Map<unknown, number>): BlockState;
    /**
     * Adds states to the following object
     * from given JS object instance.
     * @returns BlockState object itself.
     * @since 2.2.1b102
     */
    addStates(states: object): BlockState;
    /**
     * @returns All states from following object
     * in {@link java.util.Map} instance.
     */
    getStates(): java.util.Map<number, number>;
    /**
     * @returns All NAMED states from following object
     * in {@link java.util.Map} instance.
     */
    getNamedStates(): java.util.Map<string, number>;
    /**
     * @returns All states from following object
     * in JS object instance.
     */
    getStatesScriptable(): { [key: string]: number };
    /**
     * @returns All NAMED states from following object
     * in JS object instance.
     */
    getNamedStatesScriptable(): {[key: string]: number};
    /**
     * @returns String representation of the following object.
     */
    toString(): string;
    /**
     * @returns Whether the following object is equal to given,
     * according to different parameters.
     */
    equals(object: any): boolean;
}
declare namespace BlockSource {
	interface BlockBreakResult {
		items: ItemInstance[];
		experience: number;
	}
}
/**
 * New class to work with world instead of some methods from {@link World} module.
 */
declare class BlockSource {
	/**
	 * @returns Interface to given dimension by default
	 * (`null` if given dimension is not loaded and this interface
	 * was not created yet).
	 */
	static getDefaultForDimension(dimension: number): Nullable<BlockSource>;
	/**
	 * @returns Interface to the dimension where the given entity is
	 * (`null` if given entity does not exist or the dimension is not loaded
	 * and interface was not created).
	 */
	static getDefaultForActor(entityUid: number): Nullable<BlockSource>;
	/**
	 * @returns BlockSource for world generation.
	 */
	static getCurrentWorldGenRegion(): Nullable<BlockSource>;
	/**
	 * @returns BlockSource for the current client.
	 * @since 2.1.0b57
	 */
	static getCurrentClientRegion(): Nullable<BlockSource>;
	/**
	 *
	 * @param pointer
	 */
	static getFromCallbackPointer(pointer: number): Nullable<BlockSource>;
	/**
	 *
	 * @param pointer
	 */
	static getFromServerCallbackPointer(pointer: number): Nullable<BlockSource>;
	/**
	 *
	 */
	static resetDefaultBlockSources(): void;
	/**
	 *
	 */
	getPointer(): number;
	/**
	 *
	 * @param allowed
	 */
	setBlockUpdateAllowed(allowed: boolean): void;
	/**
	 *
	 */
	getBlockUpdateAllowed(): boolean;
	/**
	 *
	 * @param type
	 */
	setBlockUpdateType(type: number): void;
	/**
	 *
	 */
	getBlockUpdateType(): number;
	/**
	 * Whether or not particles must be emitted when destroying
	 * blocks with this source.
	 * @default true
	 * @since 2.2.1b102
	 */
	setDestroyParticlesEnabled(enabled: boolean): void;
	/**
	 *
	 */
	getDestroyParticlesEnabled(): boolean;
	/**
	 * @returns Block's ID at coords.
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 */
	getBlockId(x: number, y: number, z: number): number;
	/**
	 * @returns Block's ID at coords.
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 */
	getBlockID(x: number, y: number, z: number): number;
	/**
	 * @returns Block's data at coords.
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 */
	getBlockData(x: number, y: number, z: number): number;
	/**
	 * @param x X coord of the block
	 * @param y Y coord of the block
	 * @param z Z coord of the block
	 * @returns Object of the block on given coords
	 * or {@link Tile} object in Legacy pack.
	 * @since 2.1.0b59
	 */
	getBlock(x: number, y: number, z: number): BlockState | Tile;
	/**
	 * @returns Object of the extra block on given coords.
	 * @since 2.2.1b95
	 */
	getExtraBlock(x: number, y: number, z: number): BlockState;
	/**
	 * Sets block on coords.
	 * @param id ID of the block to set
	 * @param data data of the block to set
	 */
	setBlock(x: number, y: number, z: number, id: number, data?: number): void;
	/**
	 * Sets block by given {@link BlockState} on coords.
	 */
	setBlock(x: number, y: number, z: number, state: BlockState): void;
	/**
	 * Sets extra block (for example, water inside another blocks),
	 * on given coords by given ID and data.
	 * @since 2.2.1b95
	 */
	setExtraBlock(x: number, y: number, z: number, id: number, data?: number): void;
	/**
	 * Sets extra block (for example, water inside another blocks),
	 * on given coords by given {@link BlockState}.
	 * @since 2.2.1b95
	 */
	setExtraBlock(x: number, y: number, z: number, state: BlockState): void;
	/**
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @param state
	 * @param delay
	 * @param todo
	 */
	addToTickingQueue(x: number, y: number, z: number, state: BlockState, delay: number, todo: number): void;
	/**
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @param delay
	 * @param todo
	 */
	addToTickingQueue(x: number, y: number, z: number, delay: number, todo: number): void;
	/**
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @param state
	 * @param delay
	 */
	addToTickingQueue(x: number, y: number, z: number, state: BlockState, delay: number): void;
	/**
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @param delay
	 */
	addToTickingQueue(x: number, y: number, z: number, delay: number): void;
	/**
	 *
     * @since 2.4.0b119
	 */
	getRainLevel(): number;
	/**
	 *
	 * @param level
     * @since 2.4.0b119
	 */
	setRainLevel(level: number): void;
	/**
	 *
     * @since 2.4.0b119
	 */
	getLightningLevel(): number;
	/**
	 *
	 * @param level
     * @since 2.4.0b119
	 */
	setLightningLevel(level: number): void;
	/**
	 * Destroys block on coords producing appropriate drop
	 * and particles. Do not use for massive tasks due to particles being
	 * produced.
	 * @param drop whether to provide drop for the block or not
	 */
	destroyBlock(x: number, y: number, z: number, drop?: boolean): void;
	/**
	 * Destroys block on coords by entity using specified item or without it.
	 * @param allowDrop whether to provide drop for the block or not
	 * @param entityUid entity ID or -1 ID if entity is not specified
	 * @param item tool which broke block
	 * @since 2.2.0b83
	 */
	breakBlock(x: number, y: number, z: number, allowDrop: boolean, entityUid?: number, item?: ItemInstance): void;
	/**
	 * Destroys block on coords by entity using specified item.
	 * @param allowDrop whether to provide drop for the block or not
	 * @param entityUid entity ID or -1 ID if entity is not specified
	 * @since 2.2.0b83
	 */
	breakBlock(x: number, y: number, z: number, allowDrop: boolean, item: ItemInstance): void;
	/**
	 * Same as breakBlock, but returns object containing drop and experience.
	 * @param entityUid entity ID or -1 ID if entity is not specified
	 * @param item tool which broke block
	 * @since 2.2.0b83
	 */
	breakBlockForJsResult(x: number, y: number, z: number, entityUid?: number, item?: ItemInstance): BlockSource.BlockBreakResult;
	/**
	 * Same as breakBlock, but returns object containing drop and experience.
	 * @param item tool which broke block
	 * @since 2.2.0b83
	 */
	breakBlockForJsResult(x: number, y: number, z: number, item: ItemInstance): BlockSource.BlockBreakResult;
	 /**
	  * Creates an explosion on coords.
	  * @param power defines how many blocks can the explosion destroy and what
	  * blocks can or cannot be destroyed
	  * @param fire if true, puts the crater on fire
	  */
	explode(x: number, y: number, z: number, power: number, fire: boolean): void;
	/**
	 *
	 * @param x1
	 * @param y1
	 * @param z1
	 * @param x2
	 * @param y2
	 * @param z2
	 * @param mode
	 * @param output
	 * @returns Entity
	 */
	clip(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, mode: number, output: number[]): number;
	/**
	 * @returns Dimension ID to which the following object belongs.
	 */
	getDimension(): number;
	/**
	 * @returns Interface to the vanilla TileEntity (chest, furnace, etc.)
	 * on the coords, and null if it's not found.
	 */
	getBlockEntity(x: number, y: number, z: number): Nullable<NativeTileEntity>;
	/**
	 * @param x X coord of the block
	 * @param z Z coord of the block
	 * @returns Biome ID.
	 */
	getBiome(x: number, z: number): number;
	/**
	 * Sets biome ID by coords.
	 * @param biomeID ID of the biome to set
	 */
	setBiome(chunkX: number, chunkZ: number, biomeID: number): void;
	/**
	 * @returns Temperature of the biome on coords.
	 */
	getBiomeTemperatureAt(x: number, y: number, z: number): number;
	/**
	 * @returns Downfall of the biome on coords.
	 * @since 2.2.1b96
	 */
	getBiomeDownfallAt(x: number, y: number, z: number): number;
	/**
	 * @returns Grass color on chunk coords.
	 */
	getGrassColor(x: number, z: number): number;
	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns `true` if chunk is loaded, `false` otherwise.
	 */
	isChunkLoaded(chunkX: number, chunkZ: number): boolean;
	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns `true` if chunk on the position is loaded, `false` otherwise.
	 */
	isChunkLoadedAt(x: number, z: number): boolean;
	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns Loading state of the chunk by chunk coords.
	 */
	getChunkState(chunkX: number, chunkZ: number): number;
	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns Loading state of the chunk by coords.
	 */
	getChunkStateAt(x: number, z: number): number;
	/**
     * @returns Light level on the specified coordinates, from 0 to 15.
	 * @since 2.1.0b69
     */
	getLightLevel(x: number, y: number, z: number): number;
	/**
	 * @returns Whether the sky can be seen from coords.
	 */
	canSeeSky(x: number, y: number, z: number): boolean;
	/**
	 * @returns Iterator of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is `false`,
	 * and all except the entities of the given type, if blacklist value is `true`.
	 */
	fetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type?: number, blacklist?: boolean): number[];
	/**
	 * @param namespace entity namespace, e.g. "minecraft"
	 * @param type entity type, e.g. "chicken"
	 * @returns Iterator of entity IDs in given box, that are equal to the given type.
	 */
	fetchEntitiesOfTypeInAABBfetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, namespace: string, type: string): number[];
	/**
	 * @param type namespaced entity type, e.g. "minecraft:chicken"; if there is
	 * no namespace, default "minecraft" will be used instead, e.g. "chicken"
	 * @returns Iterator of entity IDs in given box, that are equal to the given type.
	 */
	fetchEntitiesOfTypeInAABBfetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: string): number[];
	/**
	 * @returns List of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is `false`,
	 * and all except the entities of the given type, if blacklist value is `true`.
	 * @since 2.2.1b100
	 */
	listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type?: number, blacklist?: boolean): number[];
	/**
	 * @param namespace entity namespace, e.g. "minecraft"
	 * @param type entity type, e.g. "chicken"
	 * @returns List of entity IDs in given box, that are equal to the given type.
	 */
	listEntitiesOfTypeInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, namespace: string, type: string): number[];
	/**
	 * @param type namespaced entity type, e.g. "minecraft:chicken"; if there is
	 * no namespace, default "minecraft" will be used instead, e.g. "chicken"
	 * @returns List of entity IDs in given box, that are equal to the given type.
	 */
	listEntitiesOfTypeInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: string): number[];
	/**
	  * Spawns entity of given numeric or namespaced type on coords.
	  * @param type numeric entity type, e.g. `EEntityType.CHICKEN` or
	  * namespaced type with possible ommitions, e.g. "minecraft:chicken:",
	  * "minecraft:chicken", "chicken" does same
	  * @example
	  * ```ts
	  * Callback.addCallback("ItemUse", (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number) =>
	  * 	BlockSource.getDefaultForActor(player)?.spawnEntity(coords.relative.x, coords.relative.y, coords.relative.z, EEntityType.CHICKEN));
	  * ```
	  */
	spawnEntity(x: number, y: number, z: number, type: number | string): number;
	/**
	  * Spawns entity of given namespace by string type on coords
	  * with optional spawn events data.
	  * @example
	  * ```ts
	  * Callback.addCallback("ItemUse", (coords: ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, player: number) =>
	  * 	BlockSource.getDefaultForActor(player)?.spawnEntity(coords.relative.x, coords.relative.y, coords.relative.z, "minecraft", "chicken", ""));
	  * ```
	  */
	spawnEntity(x: number, y: number, z: number, namespace: string, type: string, initData?: string): number;
	/**
	 * Creates dropped item and returns entity ID.
	 * @param id ID of the item to drop
	 * @param count count of the item to drop
	 * @param data data of the item to drop
	 * @param extra extra of the item to drop
	 * @returns Drop entity ID.
	 */
	spawnDroppedItem(x: number, y: number, z: number, id: number, count: number, data: number, extra?: ItemExtraData): number;
	/**
	  * Spawns experience orbs on coords.
	  * @param amount experience amount
	  */
	spawnExpOrbs(x: number, y: number, z: number, amount: number): void;
}
/**
 * Module used to create blocks with any custom model.
 */
declare namespace BlockRenderer {
    /**
     * Class representing model used by {@link BlockRenderer}.
     */
    class Model {
        /**
         * Creates a new empty model.
         */
        constructor();
        /**
         * Constructs new model using specified {@link RenderMesh}.
         */
        constructor(mesh: RenderMesh);
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
         * The width of the full block is 1x1x1 units. Uses block ID and data to
         * determine texture.
         * @param id sample block ID
         * @param data sample block data
         */
        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number);
        /**
         * Constructs new block model with single box of the normal block size.
         * The width of the full block is 1x1x1 units. Uses block ID and data to
         * determine texture.
         * @param id
         * @param data
         */
        constructor(id: number, data: number);
        /**
         * Adds new box to the model using specified block's textures.
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;
        /**
         * Adds new box to the model using specified textures for the six sides
         * of the box.
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, descr: ModelTextureSet): void;
        /**
         * Adds new box to the model using specified block texture name and ID.
         */
        addBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, texName: string, texId: number): void;
        /**
         * Adds new block with specified block's textures.
         */
        addBox(id: number, data?: number): void;
        /**
         * Adds new {@link RenderMesh} to the model.
         */
        addMesh(mesh: RenderMesh): void;
    }
    /**
     * Type used to describe a new model for {@link BlockRenderer}.
     */
    type ModelTextureSet =
        [string, number][];
    /**
     * Creates a new empty block model.
     * @returns Empty block model.
     */
    function createModel(): BlockRenderer.Model;
    /**
     * Constructs new block model of specified simple block shape with specified
     * textures.
     * @param descr texture set used for the box
     */
    function createTexturedBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, descr: ModelTextureSet): BlockRenderer.Model;
    /**
     * Constructs new block model of specified simple block of the normal block
     * size shape with specified textures.
     * @param descr texture set used for the box
     */
    function createTexturedBlock(descr: ModelTextureSet): BlockRenderer.Model;
    /**
     * Adds "CustomBlockTessellation" callback function for specified block ID.
     * @param id block ID
     * @param callback function to be called when the event occurs
     */
    function addRenderCallback(id: number, callback: Callback.CustomBlockTessellationFunction): void;
    /**
     * Forces block renders to be rebuilt immediately.
     * @param mode if 0 is passed, only the specified block gets rebuilt, if
     * 1 is passed, all the blocks along y axes are rebuilt
     */
    function forceRenderRebuild(x: number, y: number, z: number, mode: number): void;
    /**
     * Specifies custom collision shape for the block.
     * @param id block ID
     * @param data block data
     * @param shape {@link ICRender.CollisionShape} object to be used as
     * default collision shape for the specified block
     * @since 2.1.0b59
     */
    function setCustomCollisionShape(id: number, data: number, shape: ICRender.CollisionShape): void;
    /**
     * Specifies custom raycast shape for the block.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     * @param shape {@link ICRender.CollisionShape} object to be used as
     * default raycast shape for the specified block
     * @since 2.1.0b59
     */
    function setCustomRaycastShape(id: number, data: number, shape: ICRender.CollisionShape): void;
    /**
     * Specifies custom collision and raycast shape for the block.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     * @param shape {@link ICRender.CollisionShape} object to be used as
     * default collision and raycast shape for the specified block
     * @since 2.1.0b59
     */
    function setCustomCollisionAndRaycastShape(id: number, data: number, shape: ICRender.CollisionShape): void;
    /**
     * Enables custom rendering for the specified block.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     */
    function enableCustomRender(id: number, data: number): void;
    /**
     * Disables custom rendering for the specified block.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     */
    function disableCustomRender(id: number, data: number): void;
    /**
     * Sets static ICRender model as block render shape.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     * @param icRender {@link ICRender.Model} object to be used as static block shape
     */
    function setStaticICRender(id: number, data: number, icRender: ICRender.Model): void;
    /**
     * Enables block mapping for the specified block.
     * @param id block ID
     * @param data block data or -1 to map all the data values
     * @param icRender default model for the block
     */
    function enableCoordMapping(id: number, data: number, icRender: ICRender.Model): void;
    /**
     * Changes shape of the block on the specified coordinates.
     * @param icRender {@link ICRender.Model} object to be displayed at the coordinates
     * @param preventRebuild if false or not specified, rebuild is performed immediately
     */
    function mapAtCoords(x: number, y: number, z: number, icRender: ICRender.Model, preventRebuild?: boolean): void;
    /**
     * Resets shape of the block to default on the specified coordinates.
     * @param preventRebuild if false or not specified, rebuild is performed immediately
     */
    function unmapAtCoords(x: number, y: number, z: number, preventRebuild?: boolean): void;
    /**
     * Changes collision shape of the block on given coords in given dimension.
     * @param shape {@link ICRender.CollisionShape} object to be used as new collision shape
     * @since 2.1.0b59
     */
    function mapCollisionModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;
    /**
     * Changes raycast shape of the block on given coords in given dimension.
     * @param shape {@link ICRender.CollisionShape} object to be used as new raycast shape
     * @since 2.1.0b59
     */
    function mapRaycastModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;
    /**
     * Changes both collision and raycast shape of the block on given coords in given dimension.
     * @param shape {@link ICRender.CollisionShape} object to be used as new collision and raycast shape
     * @since 2.1.0b59
     */
    function mapCollisionAndRaycastModelAtCoords(dimension: number, x: number, y: number, z: number, shape: ICRender.CollisionShape): void;
    /**
     * Resets collision shape of the block to default on given coords in given dimension.
     * @since 2.1.0b59
     */
    function unmapCollisionModelAtCoords(dimension: number, x: number, y: number, z: number): void;
    /**
     * Resets raycast shape of the block to default on given coords in given dimension.
     * @since 2.1.0b59
     */
    function unmapRaycastModelAtCoords(dimension: number, x: number, y: number, z: number): void;
    /**
     * Resets both collision and raycast shape of the block to default on given coords in given dimension.
     * @since 2.1.0b59
     */
    function unmapCollisionAndRaycastModelAtCoords(dimension: number, x: number, y: number, z: number): void;
    /**
     * Object used to manipulate rendered block during
     * {@link Callback.CustomBlockTessellationFunction} calls.
     */
    interface RenderAPI {
        /**
         * @returns Pointer to native object instance of the following object,
         * to be used in custom native code, etc.
         */
        getAddr(): number;
        /**
         * Renders box at the specified coordinates of the specified size.
         * @param id ID of the block to be used as texture source
         * @param data data of the block to be used as texture source
         */
        renderBoxId(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;
        /**
         * Renders box at current block coordinates of the specified size.
         * @param id ID of the block to be used as texture source
         * @param data data of the block to be used as texture source
         */
        renderBoxIdHere(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;
        /**
         * Renders box at the specified coordinates of the specified size.
         * @param texName block texture name
         * @param texId block texture ID
         */
        renderBoxTexture(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, texName: string, texId: number): void;
        /**
         * Renders box at current block coordinates of the specified size.
         * @param texName block texture name
         * @param texId block texture ID
         */
        renderBoxTextureHere(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, id: number, data: number): void;
        /**
         * Renders full block at specified coordinates.
         * @param blockId ID of the block to be used as texture source
         * @param blockData data of the block to be used as texture source
         */
        renderBlock(x: number, y: number, z: number, blockId: number, blockData: number): void;
        /**
         * Renders full block at current block coordinates.
         * @param blockId ID of the block to be used as texture source
         * @param blockData data of the block to be used as texture source
         */
        renderBlockHere(blockId: number, blockData: number): void;
        /**
         * Renders block model at the specified coordinates.
         * @param model block model to be rendered at the specified coordinates
         */
        renderModel(x: number, y: number, z: number, model: BlockRenderer.Model): void;
        /**
         * Renders block model at current block coordinates.
         * @param model block model to be rendered at current block coordinates
         */
        renderModelHere(model: BlockRenderer.Model): void;
    }
}
/**
 * Module used to create and manipulate blocks. The difference between terms
 * "block" and "tile" is in it's usage: blocks are used in the inventory,
 * tiles are placed in the world and have different IDs for some vanilla blocks.
 * Use {@link Block.convertBlockToItemId} and {@link Block.convertItemToBlockId}
 * to perform conversion between block and it item variation.
 */
declare namespace Block {
	/**
	 * @param id string ID of the block
	 * @returns Block numeric ID by it's string ID or just returns it's numeric ID
	 * if input was a numeric ID.
	 */
	function getNumericId(id: string | number): number;
	/**
	 * Creates new block using specified params.
	 * @param nameID string ID of the block. You should register it via
	 * {@link IDRegistry.genBlockID} call first
	 * @param defineData array containing all variations of the block. Each
	 * variation corresponds to block data value, data values are assigned
	 * according to variations order
	 * @param blockType {@link Block.SpecialType} object, either java-object returned by
	 * {@link Block.createSpecialType} or js-object with the required properties,
	 * you can also pass special type name, if the type was previously
	 * registered
	 */
	function createBlock(nameID: string, defineData: BlockVariation[], blockType?: SpecialType | string): void;
	/**
	 * Creates new block using specified params, creating four variations for
	 * each of the specified variations to be able to place it facing flayer
	 * with the front side and defines the appropriate behavior. Useful for
	 * different machines and mechanisms.
	 * @param nameID string ID of the block. You should register it via
	 * {@link IDRegistry.genBlockID} call first
	 * @param defineData array containing all variations of the block. Each
	 * variation corresponds to four block data values, data values are assigned
	 * according to variations order
	 * @param blockType {@link Block.SpecialType SpecialType} object, either java-object returned by
	 * {@link Block.createSpecialType} or js-object with the required properties,
	 * you can also pass special type name, if the type was previously
	 * registered
	 */
	function createBlockWithRotation(nameID: string, defineData: BlockVariation[], blockType?: SpecialType | string): void;
	/**
	 * Object used to represent single block variation.
	 */
	interface BlockVariation {
		/**
		 * Variation name, displayed as item name everywhere.
		 * @default "Unknown Block"
		 */
		name?: string,
		/**
		 * Variation textures, array containing pairs of texture name and data.
		 * Texture file should be located in items-opaque folder and it's name
		 * should be in the format: `"name_data"`, e.g. if the file name is
		 * `"ingot_copper_0"`, you should specify an array `["ingot_copper", 0]`.
		 * @remarks
		 * There should be from one to six texture pairs in the array,
		 * if less then six variations are specified, the last texture is used
		 * for missing textures. The sides go in the following order:
		 * ```js
		 * texture: [
		 * 	["name1", index1], // bottom (Y: -1)
		 * 	["name2", index2], // top (Y: +1)
		 * 	["name3", index3], // back (X: -1)
		 * 	["name4", index4], // front (X: +1)
		 * 	["name5", index5], // left (Z: -1)
		 * 	["name6", index6]  // right (Z: +1)
		 * ]
		 * ```
		 */
		texture: [string, number][],
		/**
		 * If `true`, block variation will be added to creative inventory.
		 * @default false
		 */
		inCreative?: boolean
	}
	/**
	 * Creates new liquid block using specified params.
	 * @param nameID string ID of the block. You should register it via
	 * {@link IDRegistry.genBlockID} call first
	 * @param defineData object containing all needed params to describe your custom liquid block.
	 * There you can specify custom name IDs for static and dynamic liquid blocks separately,
	 * and if you do this, you have to register those name IDs
	 * via {@link IDRegistry.genBlockID} before using them
	 * @param blockType {@link Block.SpecialType SpecialType} object, either java-object returned by
	 * {@link Block.createSpecialType} or js-object with the required properties,
	 * you can also pass special type name, if the type was previously registered
	 * @since 2.2.1b102
	 */
	function createLiquidBlock(nameID: string, defineData: LiquidDescriptor, blockType?: SpecialType | string): void;
	/**
	 * Object to specify needed params for custom liquid block.
	 */
	interface LiquidDescriptor {
		/**
		 * Name of the block to be displayed.
		 */
		name: string,
		/**
		 * Delay between liquid spreading steps in ticks.
		 * @default 10
		 */
		tickDelay?: number,
		/**
		 * True if the liquid will be renewable, as water.
		 * @default false
		 * @since 2.2.1b103
		 */
		isRenewable?: boolean,
		/**
		 * Object to describe static liquid block
		 * texture, and name ID additionally.
		 */
		still: {
			/**
			 * Optional, name ID for static liquid block.
			 * @default "nameId_still"
			 */
			id?: string,
			/**
			 * For static liquid block,
			 * textures must be of standard block texture format.
			 */
			texture: [string, number]
		},
		/**
		 * Object to describe dynamic liquid block
		 * texture, and name ID additionally.
		 */
		flowing: {
			/**
			 * Optional, name ID for dynamic liquid block.
			 * @default "nameId"
			 */
			id?: string,
			/**
			 * Unlike static liquid blocks,
			 * for dynamic ones, texture must look like
			 * `"texture.liquid.png"` (with no index).
			 */
			texture: [string, number]
		},
		/**
		 * Optional section, if added, this will create fully
		 * functional (including dispensers) bucket items.
		 * @since 2.2.1b103
		 */
		bucket?: {
			/**
			 * Optional, name ID for bucket item.
			 * @default "nameId_bucket"
			 */
			id?: string,
			texture: { name: string, meta?: number },
			/**
			 * An item that can capture liquid (including when using
			 * a dispenser and obtaining it with your hand).
			 * @default 325
			 * @since 2.3.1b116
			 */
			emptyId?: number
		},
		/**
		 * Whether to add liquid block to creative inventory.
		 * @default false
		 */
		inCreative?: boolean,
		uiTextures?: string,
		modelTextures?: string
	}
	/**
	 * @param id numeric block ID
	 * @returns `true`, if the specified block ID is a vanilla block.
	 */
	function isNativeTile(id: number): boolean;
	/**
	 * Converts tile ID to the block ID.
	 * @param id numeric tile ID
	 * @returns Numeric block ID corresponding to the given tile ID.
	 */
	function convertBlockToItemId(id: number): number;
	/**
	 * Converts block ID to the tile ID.
	 * @param id numeric tile ID
	 * @returns Numeric tile ID corresponding to the given block ID.
	 */
	function convertItemToBlockId(id: number): number;
	/**
	 * Defines custom behavior when the player clicks on the block with definite ID.
	 * @param numericId block's numeric ID
	 * @param func function that will be called when the player clicks the block with given ID
	 * @since 2.2.1b104
	 */
	function registerClickFunctionForID(numericId: number, func: ClickFunction): void;
	/**
	 * Defines custom behavior when the player clicks on the block with definite ID.
	 * @param id block's numeric or string ID
	 * @param func function that will be called when the player clicks the block with given ID
	 * @since 2.2.1b104
	 */
	function registerClickFunction(id: string | number, func: ClickFunction): void;
	/**
	 * Function used to define how the block will behave when the player clicks on it.
	 * @param coords set of all coordinate values that can be useful to write
	 * custom logics on click
	 * @param item item that was in the player's hand when he touched the block
	 * @param block block that was touched
	 * @param player unique ID of the player entity
	 */
	interface ClickFunction {
		(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number): void;
	}
	/**
	 * Registers function used by Core Engine to determine block drop for the
	 * specified block ID.
	 * @param numericId tile numeric ID
	 * @param dropFunc function to be called to determine what will be dropped
	 * when the block is broken
	 * @param level if level is specified and is not 0, digging level of the
	 * block is additionally set
	 * @returns `true`, if specified string or numeric ID exists and the function
	 * was registered correctly, `false` otherwise.
	 */
	function registerDropFunctionForID(numericId: number, dropFunc: DropFunction, level?: number): boolean;
	/**
	 * Registers function used by Core Engine to determine block drop for the
	 * specified block ID.
	 * @param id tile string or numeric ID
	 * @param dropFunc function to be called to determine what will be dropped
	 * when the block is broken
	 * @param level if level is specified and is not 0, digging level of the
	 * block is additionally set
	 * @returns `true`, if specified string or numeric ID exists and the function
	 * was registered correctly, `false` otherwise.
	 */
	function registerDropFunction(id: string | number, dropFunc: DropFunction, level?: number): boolean;
	/**
	 * Function used to determine block drop.
	 * @param blockCoords coordinates where the block is destroyed and side from
	 * where it is destroyed
	 * @param blockID numeric tile ID
	 * @param blockData block data value
	 * @param diggingLevel level of the tool the block was dug with
	 * @param enchant enchant data of the tool held in player's hand
	 * @param item item stack held in player's hand
	 * @param region BlockSource object
	 * @returns Block drop, the array of arrays, each containing three or four values:
	 * ID, count, data and extra respectively.
	 */
	interface DropFunction {
		(blockCoords: Callback.ItemUseCoordinates, blockID: number, blockData: number, diggingLevel: number, enchant: ToolAPI.EnchantData, item: ItemInstance, region: BlockSource): ItemInstanceArray[]
	}
	/**
	 * Registered function used by Core Engine to determine block drop for the
	 * specified block ID.
	 * @param numericId tile numeric ID
	 * @param func function to be called when a block in the world is broken by
	 * environment (explosions, pistons, etc.)
	 * @returns `true`, if specified string or numeric ID exists and the function
	 * was registered correctly, `false` otherwise.
	 */
	function registerPopResourcesFunctionForID(numericId: number, func: PopResourcesFunction): boolean;
	/**
	 * Registered function used by Core Engine to determine block drop for the
	 * specified block ID.
	 * @param id tile string or numeric ID
	 * @param func function to be called when a block in the world is broken by
	 * environment (explosions, pistons, etc.)
	 * @returns `true`, if specified string or numeric ID exists and the function
	 * was registered correctly, `false` otherwise.
	 */
	function registerPopResourcesFunction(id: string | number, func: PopResourcesFunction): boolean;
	/**
	 * Function used to determine when block is broken by
	 * environment (explosions, pistons, etc.).
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
	 * Registers function on entity being inside the block. Can be used to create portals.
	 * @param numericId tile string or numeric ID
	 * @param func function to be called when entity is inside the block
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.0.2b26
	 */
	function registerEntityInsideFunctionForID(numericId: number, func: EntityInsideFunction): boolean;
	/**
	 * Registers function on entity being inside the block. Can be used to create portals.
	 * @param id tile string or numeric ID
	 * @param func function to be called when entity is inside the block
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.0.2b26
	 */
	function registerEntityInsideFunction(id: string | number, func: EntityInsideFunction): boolean;
	interface EntityInsideFunction {
		(blockCoords: Vector, block: Tile, entity: number): void
	}
	/**
	 * Registers function on entity step on the block.
	 * @param numericId tile numeric ID
	 * @param func function to be called when entity step on the block
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.3.1b116 (implemented in 2.0.2b26)
	 */
	function registerEntityStepOnFunctionForID(numericId: number, func: EntityStepOnFunction): boolean;
	/**
	 * Registers function on entity step on the block.
	 * @param id tile string or numeric ID
	 * @param func function to be called when entity step on the block
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.3.1b116 (implemented in 2.0.2b26)
	 */
	function registerEntityStepOnFunction(id: string | number, func: EntityStepOnFunction): boolean;
	interface EntityStepOnFunction {
		(coords: Vector, block: Tile, entity: number): void
	}
	/**
	 * Registers function on neighbour blocks updates.
	 * @param numericId tile numeric ID
	 * @param func function to be called when neighbour block updates
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.0.2b26
	 */
	function registerNeighbourChangeFunctionForID(numericId: number, func: NeighbourChangeFunction): boolean;
	/**
	 * Registers function on neighbour blocks updates.
	 * @param id tile string or numeric ID
	 * @param func function to be called when neighbour block updates
	 * @returns `true`, if the function was registered correctly, `false` otherwise.
	 * @since 2.0.2b26
	 */
	function registerNeighbourChangeFunction(id: string | number, func: NeighbourChangeFunction): boolean;
	/**
	 * Function used to check block's neighbours changes.
	 * @param coords coords vector of the block
	 * @param block Tile object of the block
	 * @param changedCoords coords vector of the neighbour block that was changed
	 * @param region BlockSource object
	 */
	interface NeighbourChangeFunction {
		(coords: Vector, block: Tile, changedCoords: Vector, region: BlockSource): void
	}
	/**
	 * @returns Drop function of the block with given numeric ID.
	 */
	function getDropFunction(id: number): Block.DropFunction;
	/**
	 * Registers a default destroy function for the specified block, considering
	 * it's digging level.
	 * @param numericId tile numeric ID
	 * @param level digging level of the block
	 * @param resetData if true, the block is dropped with data equals to 0
	 */
	function setDestroyLevelForID(numericId: number, level: number, resetData?: boolean): void;
	/**
	 * Registers a default destroy function for the specified block, considering
	 * it's digging level.
	 * @param id tile string or numeric ID
	 * @param level digging level of the block
	 * @param resetData if true, the block is dropped with data equals to 0
	 */
	function setDestroyLevel(id: string | number, level: number, resetData?: boolean): void;
	/**
	 * Sets destroy time for the block with specified ID.
	 * @param nameID string or numeric block ID
	 * @param time destroy time for the block, in ticks
	 */
	function setDestroyTime(nameID: string | number, time: number): void;
	/**
	 * @returns Given block's material numeric ID.
	 * @since 2.2.1b100
	 */
	function getMaterial(id: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns `true`, if block is solid, `false` otherwise.
	 */
	function isSolid(numericId: number): boolean;
	/**
	 * @returns Whether the block of given ID can contain liquid inside.
	 */
	function canContainLiquid(id: number): boolean;
	/**
	 * @returns Whether the block of given ID can be an extra block
	 * (it's the block that can be set inside of another blocks, for ex. water and other liquids).
	 */
	function canBeExtraBlock(id: number): boolean;
	/**
	 * @param numericId numeric block ID
	 * @returns Destroy time of the block, in ticks.
	 */
	function getDestroyTime(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Explosion resistance of the block.
	 */
	function getExplosionResistance(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Friction of the block.
	 */
	function getFriction(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Translucency of the block.
	 */
	function getTranslucency(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Light level, emitted by block, from 0 to 15.
	 */
	function getLightLevel(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Light opacity of the block, from 0 to 15.
	 */
	function getLightOpacity(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Render layer of the block.
	 */
	function getRenderLayer(numericId: number): number;
	/**
	 * @param numericId numeric block ID
	 * @returns Render type of the block.
	 */
	function getRenderType(numericId: number): number;
	function getBlockAtlasTextureCoords(str: string, int: number): BlockAtlasTextureCoords;
	interface BlockAtlasTextureCoords {
		u1: number, v1: number, u2: number, v2: number;
	}
	/**
	 * Temporarily sets destroy time for block, saving the old value for the
	 * further usage.
	 * @param numericId numeric block ID
	 * @param time new destroy time in ticks
	 */
	function setTempDestroyTime(numericId: number, time: number): void;
	/**
	 * Registers material and digging level for the specified block.
	 * @param nameID block numeric or string ID
	 * @param material material name
	 * @param level block's digging level
	 * @returns `true` if specified string or numeric ID exists, `false` otherwise.
	 */
	function setBlockMaterial(nameID: string | number, material: string, level: number): boolean;
	/**
	 * @param id numeric block ID
	 * @returns Color specified block is displayed on the vanilla maps.
	 */
	function getMapColor(id: number): number;
	/**
	 * Makes block accept redstone signal.
	 * @param nameID block numeric or string ID
	 * @param data block data, currently not used
	 * @param isRedstone if true, the redstone changes at the block will notify
	 * the "RedstoneSignal" callback
	 * @deprecated Use {@link Block.setupAsRedstoneReceiver} and
	 * {@link Block.setupAsRedstoneEmitter} instead.
	 */
	function setRedstoneTile(nameID: string | number, data: number, isRedstone: boolean): void;
	/**
	 * Makes block receive redstone signals via "RedstoneSignal" callback.
	 * @param nameID block numeric or string ID
	 * @param connectToRedstone if true, redstone wires will connect to the block
	 * @since 2.0.2b23
	 */
	function setupAsRedstoneReceiver(nameID: number | string, connectToRedstone: boolean): void;
	/**
	 * Makes block emit redstone signal.
	 * @param nameID block numeric or string ID
	 * @param connectToRedstone if true, redstone wires will connect to the block
	 * @since 2.0.2b23
	 */
	function setupAsRedstoneEmitter(nameID: number | string, connectToRedstone: boolean): void;
	/**
	 * Removes all the redstone functionality from the block.
	 * @param nameID block numeric or string ID
	 * @since 2.0.2b23
	 */
	function setupAsNonRedstoneTile(nameID: number | string): void;
	/**
	 * Gets drop for the specified block. Used mostly by Core Engine's
	 * {@link ToolAPI}, though, can be useful in the mods, too.
	 * @param block block info
	 * @param item item that was (or is going to be) used to break the block
	 * @param coords coordinates where the block was (or is going to be) broken
	 * @returns Block drop, the array of arrays, each containing three values:
	 * ID, count and data respectively.
	 */
	function getBlockDropViaItem(block: Tile, item: ItemInstance, coords: Vector, region: BlockSource): ItemInstanceArray[];
	/**
	 * Registers function to be called when the block is placed in the world.
	 * @param numericId block numeric ID
	 * @param func function to be called when the block is placed in the world
	 */
	function registerPlaceFunctionForID(numericId: number, func: PlaceFunction): void;
	/**
	 * Registers function to be called when the block is placed in the world.
	 * @param id block numeric or string ID
	 * @param func function to be called when the block is placed in the world
	 */
	function registerPlaceFunction(id: string | number, func: PlaceFunction): void;
	/**
	 * @returns Place function of the block with given numeric ID,
	 * or undefined if it was not specified.
	 */
	function getPlaceFunc(id: number): Block.PlaceFunction;
	/**
	 * Function used to determine when block is placed in the world.
	 * @param coords set of all coordinate values that can be useful to write
	 * custom use logics
	 * @param item item that was in the player's hand when he touched the block
	 * @param block block that was touched
	 * @param player Player unique ID
	 * @param region BlockSource object
	 * @returns Coordinates where to actually place the block, or void for
	 * default placement.
	 */
	interface PlaceFunction {
		(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource): Vector | void
	}
	/**
	 * Sets block box shape, like {@link Block.setShape},
	 * but in voxel objects for each coordinate.
	 * @param id block numeric ID
	 * @param pos1 block lower corner position
	 * @param pos2 block upper conner position
	 * @param data block optional data (or -1)
	 */
	function setBlockShape(id: number, pos1: Vector, pos2: Vector, data?: number): void;
	/**
	 * Sets block box shape via scalar coordinates,
	 * usually presented in voxels (1/16 of block).
	 * @param id block numeric ID
	 * @param data block optional data (or -1)
	 */
	function setShape(id: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, data?: number): void;
	/**
	 * Creates a new special type using specified params
	 * and optionally registers it by name.
	 * @param description special type properties
	 * @param nameKey string name to register the special type
	 * @returns Special type name.
	 */
	function createSpecialType(description: SpecialType, nameKey?: string): string;
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
	 * Core's block IDs limitations.
	 */
	interface SpecialType {
		/**
		 * Unique string identifier of the SpecialType.
		 */
		name?: string,
		/**
		 * Vanilla block ID to inherit some of the properties.
		 * @default 0
		 */
		base?: number,
		/**
		 * Block material constant to be inherited.
		 * @default 3
		 */
		material?: number,
		/**
		 * If `true`, the block is not transparent.
		 * @default false
		 */
		solid?: boolean,
		/**
		 * If `true`, all block faces are rendered, otherwise back faces are not
		 * rendered, like for glass.
		 * @default false
		 */
		renderallfaces?: boolean,
		/**
		 * Sets render type of the block. Default is full block, use other
		 * values to change block's shape.
		 * @default 0
		 */
		rendertype?: number,
		/**
		 * Specifies the layer that is used to render the block.
		 * @default 4
		 */
		renderlayer?: number,
		/**
		 * If non-zero value is used, the block emits light of that value.
		 * Default is no lighting, use values from 1 to 15 to set light level.
		 * @default 0
		 */
		lightlevel?: number,
		/**
		 * Specifies how opaque the block is. Default is transparent, use values
		 * from 1 to 15 to make the block opaque.
		 * @default 0
		 */
		lightopacity?: number,
		/**
		 * Specifies how block resists to the explosions.
		 * @default 3
		 */
		explosionres?: number,
		/**
		 * Specifies how player walks on this block. The higher the friction is,
		 * the more difficult it is to change speed and direction.
		 * @default 0.6000000238418579
		 */
		friction?: number,
		/**
		 * Specifies the time required to destroy the block, in ticks.
		 */
		destroytime?: number,
		/**
		 * If non-zero value is used, the shadows will be rendered on the block.
		 * Default is zero, allows float values from 0 to 1.
		 * @default 0
		 */
		translucency?: number,
		/**
		 * Block color when displayed on the vanilla maps.
		 * @since 2.0.2b23
		 */
		mapcolor?: number,
		/**
		 * Makes block use biome color source when displayed on the vanilla maps.
		 * @since 2.1.0b56
		 */
		color_source?: ColorSource,
		/**
		 * Specifies sounds of the block, one of {@link Block.Sound}.
		 * @since 2.0.2b25
		 */
		sound?: Sound,
		/**
		 * Whether or not block may filled by water bucket or
		 * other custom fillable liquids.
		 * @default false
		 * @since 2.2.1b95
		 */
		can_contain_liquid?: boolean,
		/**
		 * Whether or not block may overlay different block,
		 * like water overlapping fillable blocks.
		 * @default false
		 * @since 2.2.1b95
		 */
		can_be_extra_block?: boolean
	}
	/**
	 * Makes block invoke callback randomly depending on game speed.
	 * @param id block ID to register for random ticks
	 * @param callback function to be called on random block tick
	 */
	function setRandomTickCallback(id: number, callback: RandomTickFunction): void;
	/**
	 * Function used to track random block ticks.
	 * @param x x coordinate of the block that ticked
	 * @param y y coordinate of the block that ticked
	 * @param z z coordinate of the block that ticked
	 * @param id block ID
	 * @param data block data
	 * @param region BlockSource object
	 */
	interface RandomTickFunction {
		(x: number, y: number, z: number, id: number, data: number, region: BlockSource): void
	}
	/**
	 * Makes block invoke callback randomly depending on game speed. Occurs more
	 * often then {@link Block.setRandomTickCallback} and only if the block is not
	 * far away from player.
	 * @param id block ID to register
	 * @param callback function to be called
	 */
	function setAnimateTickCallback(id: number, callback: AnimateTickFunction): void;
	/**
	 * Function used to track random block animation ticks.
	 * @param x x coordinate of the block that should be updated
	 * @param y y coordinate of the block that should be updated
	 * @param z z coordinate of the block that should be updated
	 * @param id block ID
	 * @param data block data
	 */
	interface AnimateTickFunction {
		(x: number, y: number, z: number, id: number, data: number): void
	}
	/**
	 * @deprecated Better performance should be inherited by manually
	 * manipulation with properties and {@link Block.SpecialType SpecialType}.
	 */
	function setPrototype(nameID: string | number, Prototype: any): number;
}
/**
 * Class used to attach attachables to entities.
 * @since 2.2.0b75
 */
declare class AttachableRender {
    static attachRendererToItem(id: number, renderer: AttachableRender, texture?: string, material?: string): void;
    static detachRendererFromItem(id: number): void;
    /**
     * Constructs new {@link AttachableRender} object bind to given entity.
     */
    constructor(actorUid: number);
    getUniformSet(): ShaderUniformSet;
    /**
     * Sets the render, root render parts will be drawing
     * together with mob's render parts with same names
     * (names can be seen in json description of the model in resources).
     */
    setRenderer(actorRenderer: ActorRenderer): AttachableRender;
    setTexture(textureName: string): AttachableRender;
    setMaterial(materialName: string): AttachableRender;
    destroy(): void;
    isAttached(): boolean;
}
/**
 * Module used to manage armor's behavior.
 */
declare namespace Armor {
    /**
     * Registers armor's hurt and tick functions.
     * @param id armor item string or numeric ID
     * @param funcs
     * @deprecated Use multiplayer {@link Armor.registerOnHurtListener} and
     * anothers or callbacks.
     */
    function registerFuncs(id: number | string, funcs: {
        /**
         * Called every tick if player wears the armor.
         * @param item current armor item instance
         * @param index armor slot, one of the {@link EArmorType} values
         * @param maxDamage maximum damage the armor
         * @returns `true`, if changes to the item parameter should be applied,
         * `false` otherwise.
         */
        tick: (item: ItemInstance, index: number, maxDamage: number) => boolean,
        /**
         * Called when player deals damage if player wears the armor.
         * @param params additional data about damage
         * @param item current armor item instance
         * @param index armor slot, one of the {@link EArmorType} values
         * @param maxDamage maximum damage the armor
         * @returns `true`, if changes to the item parameter should be applied,
         * `false` otherwise.
         */
        hurt: (params: {
            /**
             * Attacker entity or -1 if the damage was not
             * caused by an entity.
             */
            attacker: number,
            /**
             * Damage amount that was applied to the player.
             */
            damage: number,
            /**
             * Damage type.
             */
            type: number,
            /**
             * TODO: Unknown param!
             */
            b1: boolean,
            /**
             * TODO: Unknown param!
             */
            b2: boolean
        }, item: ItemInstance, index: number, maxDamage: number) => boolean
    }): void;
    /**
     * Prevents armor from being damaged.
     * @param id armor item string or numeric ID
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
     * @returns Item object to change armor item, if nothing is returned,
     * armor will not be changed.
     */
    function registerOnTickListener(id: number, func: ArmorGeneralFunction): ItemInstance | void;
    /**
     * This event is called when the damage is dealt to the player that has this armor put on.
     * @returns Item object to change armor item, if nothing is returned,
     * armor will not be changed.
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
 * Animations are used to display some 3d models in the world without use of
 * entities.
 * @remarks
 * Rendering performs locally in client-side, use packets to transfer
 * data between server and players.
 */
declare namespace Animation {
    /**
     * Base animations are used to display arbitrary model in the world.
     */
    class Base {
        /**
         * Constructs a new Base animation on the specified coordinates.
         */
        constructor(x: number, y: number, z: number);
        /**
         * Changes the animation's position.
         */
        setPos(x: number, y: number, z: number): void;
        /**
         * @param enabled if true, animation position will be interpolated
         * between tick calls
         */
        setInterpolationEnabled(enabled: boolean): void;
        /**
         * @deprecated Use {@link Animation.Base.setBlockLightPos setBlockLightPos} and related methods instead.
         */
        setIgnoreBlocklight(ignore: boolean): void;
        /**
         * Sets specified coordinates as light measuring position for the
         * animation. In other words, animation lightning will be calculated
         * as if animation was at the specified coordinates.
         */
        setBlockLightPos(x: number, y: number, z: number): void;
        /**
         * Resets light measuring position for the animation (to it's coordinates).
         */
        resetBlockLightPos(): void;
        /**
         * Sets light measuring position to always match day/night lightning,
         * even when the animation is not directly illuminated.
         */
        setSkylightMode(): void;
        /**
         * Sets light measuring to match the animation coordinated.
         */
        setBlocklightMode(): void;
        /**
         * Makes the animation ignore light at all.
         */
        setIgnoreLightMode(): void;
        /**
         * @returns Object for current animation's render.
         */
        transform(): Render.Transform;
        /**
         * @returns Object for current animation's render.
         * @since 2.0.2b20
         */
        getShaderUniforms(): ShaderUniformSet;
        /**
         * Creates a set of transformations for the current animation.
         * @param transformations
         * @param noClear
         */
        newTransform(transformations: {
            /**
             * Transformation function name, one of {@link Render.Transform} class member
             * functions names.
             */
            name: string,
            /**
             * Transformation function parameters, see {@link Render.Transform} functions
             * for details.
             */
            params: any[]
        }[], noClear: boolean): void;
        /**
         * Creates render if it was not previously created and applies all the
         * parameters from animation description.
         */
        createRenderIfNeeded(): void;
        /**
         * Refreshes the animation.
         */
        updateRender(): void;
        /**
         * Loads animation in the world.
         */
        load(): void;
        /**
         * Loads animation in the world registering it as an {@link Updatable}.
         * @param func function to be used as {@link Updatable.update} function
         * @since 2.3.1b116 (client-side)
         */
        loadCustom(func: () => void): void;
        /**
         * @deprecated Backwards compatibility, render doesn't have attributes.
         */
        getAge(): void;
        /**
         * Refreshes the animation.
         */
        refresh(): void;
        /**
         * Describes animation parameters for the future use. Call {@link Animation.Base.load load} or
         * {@link Animation.Base.loadCustom loadCustom} to actually launch the animation.
         * @param description an object containing all the required data about
         * animation
         */
        describe(description: {
            /**
             * {@link RenderMesh} object to be displayed with animation.
             * @since 2.0.2b20
             */
            mesh?: RenderMesh,
            /**
             * Numeric ID of the {@link Render} object to be displayed with animation.
             * Can be obtained using {@link Render.getId}
             */
            render?: number,
            /**
             * Name of the texture to be used as render's skin.
             */
            skin?: string,
            /**
             * Animation scale.
             * @default 1
             */
            scale?: number,
            /**
             * Animation material, can be used to apply custom materials to the
             * animation.
             * @since 2.0.2b20
             */
            material?: string
        }): void;
        /**
         * Destroys animation and releases all the resources.
         */
        destroy(): void;
        /**
         * @since 2.1.0b60
         */
        exists(): boolean;
    }
    /**
     * Item animations are used to display items or blocks models in the world.
     */
    class Item extends Base {
        /**
         * Constructs a new Item animation on the specified coordinates.
         */
        constructor(x: number, y: number, z: number);
        /**
         * Describes item to be used for the animation.
         * @param item item parameters object
         */
        describeItem(item: {
            /**
             * Item ID.
             */
            id: number,
            /**
             * Item count, will be transform to display an appropriate animation.
             */
            count?: number,
            /**
             * Item data.
             */
            data?: number,
            /**
             * Item extra.
             */
            extra?: ItemExtraData,
            /**
             * Whether the item should be in glint state or not.
             */
            glint?: boolean,
            /**
             * Item/block size.
             * @default 0.5
             */
            size?: number,
            /**
             * If `true`, the position of the item will not be randomized.
             */
            notRandomize?: boolean,
            /**
             * If string "x" is passed, the item is rotated 90 along x axis, if
             * "z" is passed, the item is rotated 90 along z axis, otherwise the
             * item is rotated according to the rotation array along all the three
             * axes.
             */
            rotation?: string | [number, number, number],
            /**
             * Skin name to be used for the render. If no skin is passed, default
             * item skin is used.
             */
            skin?: string,
            /**
             * Shader material name.
             * @since 2.0.2b20
             */
            material?: string
        }): void;
        /**
         * @deprecated Consider using {@link Animation.Item.describeItem describeItem} instead.
         */
        describeItemDefault(item: any): void;
        /**
         * Resets all the transformations made via {@link Animation.Base.transform transform} calls.
         */
        resetTransform(): void;
        /**
         * Specifies item rotation along the three axes.
         * @default x: 0, y: 0, z: 0
         */
        setItemRotation(x: number, y: number, z: number): void;
        /**
         * Specifies item size.
         * @default 0.5
         */
        setItemSize(size: number): void;
        /**
         * Specifies item size and rotation via single function call.
         */
        setItemSizeAndRotation(size: number, x: number, y: number, z: number): void;
    }
}
/**
 * Module used to manage custom entities added via add-ons.
 * @since 2.0.1b18
 * @remarks
 * Depends on local player dimension, highly recommended replace it
 * with {@link BlockSource.spawnEntity} and {@link Entity.getTypeName}.
 */
declare namespace AddonEntityRegistry {
    /**
     * Spawns an entity defined via add-on on the specified coordinates.
     * @param nameID entity name ID, as defined from add-on
     */
    function spawn(x: number, y: number, z: number, nameID: string): number;
    /**
     * Added entities stores in registry, so already spawned entity
     * data may resolved again by requesting information by UID.
     * @returns Add-on entity information by entity ID.
     */
    function getEntityData(entity: number): AddonEntity;
    interface AddonEntity {
        /**
         * Entity unique ID.
         */
        readonly id: number,
        /**
         * Add-on defined entity name ID.
         */
        readonly type: string,
        /**
         * Executes command with the entity.
         * @param command command to be executed
         * @returns Error message or null if the command was run successfully.
         */
        exec(command: string): Nullable<string>;
        /**
         * Executes command with the entity on the specified coordinates.
         * @param command command to be executed
         * @returns Error message or null if the command was run successfully.
         */
        execAt(command: string, x: number, y: number, z: number): Nullable<string>;
    }
}
/**
 * Class, upon which armor and attachments render is based
 * It is a model that consists of parts, same as in {@link Render},
 * but more abstract, allows creating root parts instead of
 * inheritance from old humanoid model.
 */
declare class ActorRenderer {
    /**
     * Constructs new {@link ActorRenderer} object without parts.
     */
    constructor();
    /**
     * Constructs new {@link ActorRenderer} object,
     * based on one of default Minecraft render templates.
     * @param templateName default template name
     */
    constructor(templateName: DefaultRenderTemplate);
    getUniformSet(): ShaderUniformSet;
    setTexture(textureName: string): void;
    setMaterial(materialName: string): void;
    getPart(name: string): ActorRenderer.ModelPart;
    /**
     * Adds a child model part of an existing one.
     * @param name child model name
     * @param parentName parent model name
     */
    addPart(name: string, parentName: string, mesh?: RenderMesh): ActorRenderer.ModelPart;
    /**
     * Adds a root model part.
     */
    addPart(name: string, mesh?: RenderMesh): ActorRenderer.ModelPart;
}
declare namespace ActorRenderer {
    /**
     * All methods of {@link ActorRenderer.ModelPart} build in such a way,
     * that you can create full render in one chain of calls.
     * @example
     * ```js
     * new ActorRenderer()
     *     .addPart("child", "parent")
     *         .addBox(-4, -4, -4, 4, 0, 4)
     *     .addPart("grandChild", "child")
     *         .addBox(-4, 0, -4, 4, 4, 4)
     *         .setOffset(0, 4, 0)
     *     .endPart();
     * ```
     */
    class ModelPart {
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
