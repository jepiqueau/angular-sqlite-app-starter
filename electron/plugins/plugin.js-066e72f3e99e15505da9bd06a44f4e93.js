var capacitorPlugin = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * SQLiteConnection Class
     */
    class SQLiteConnection {
        constructor(sqlite) {
            this.sqlite = sqlite;
            this._connectionDict = new Map();
        }
        echo(value) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.sqlite.echo({ value: value });
            });
        }
        addUpgradeStatement(database, fromVersion, toVersion, statement, set) {
            return __awaiter(this, void 0, void 0, function* () {
                let upgrade = {
                    fromVersion,
                    toVersion,
                    statement,
                    set: set ? set : [],
                };
                const res = yield this.sqlite.addUpgradeStatement({
                    database,
                    upgrade: [upgrade],
                });
                return res;
            });
        }
        createConnection(database, encrypted, mode, version) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.createConnection({
                    database,
                    encrypted,
                    mode,
                    version,
                });
                if (res.result) {
                    const conn = new SQLiteDBConnection(database, this.sqlite);
                    this._connectionDict.set(database, conn);
                    return conn;
                }
                else {
                    return null;
                }
            });
        }
        closeConnection(database) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.closeConnection({ database });
                if (res.result) {
                    this._connectionDict.delete(database);
                }
                return res;
            });
        }
        retrieveConnection(database) {
            return __awaiter(this, void 0, void 0, function* () {
                const conn = this._connectionDict.has(database)
                    ? this._connectionDict.get(database)
                    : null;
                return conn;
            });
        }
        retrieveAllConnections() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._connectionDict;
            });
        }
        closeAllConnections() {
            return __awaiter(this, void 0, void 0, function* () {
                const delDict = new Map();
                let res;
                for (let database of this._connectionDict.keys()) {
                    res = yield this.sqlite.closeConnection({ database });
                    if (!res.result)
                        break;
                    delDict.set(database, null);
                }
                for (let database of delDict.keys()) {
                    this._connectionDict.delete(database);
                }
                return res;
            });
        }
        importFromJson(jsonstring) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.sqlite.importFromJson({ jsonstring: jsonstring });
            });
        }
        isJsonValid(jsonstring) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.sqlite.isJsonValid({ jsonstring: jsonstring });
            });
        }
        copyFromAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.sqlite.copyFromAssets();
            });
        }
    }
    /**
     * SQLiteDBConnection Class
     */
    class SQLiteDBConnection {
        constructor(dbName, sqlite) {
            this.dbName = dbName;
            this.sqlite = sqlite;
            console.log('>>> in SQLiteDBConnection dbName ' + dbName);
        }
        getConnectionDBName() {
            return this.dbName;
        }
        open() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('>>> in SQLiteDBConnection open dbName ' + this.dbName);
                const res = yield this.sqlite.open({ database: this.dbName });
                return res;
            });
        }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.close({ database: this.dbName });
                return res;
            });
        }
        execute(statements) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.execute({
                    database: this.dbName,
                    statements: statements,
                });
                return res;
            });
        }
        query(statement, values) {
            return __awaiter(this, void 0, void 0, function* () {
                let res;
                if (values && values.length > 0) {
                    res = yield this.sqlite.query({
                        database: this.dbName,
                        statement: statement,
                        values: values,
                    });
                }
                else {
                    res = yield this.sqlite.query({
                        database: this.dbName,
                        statement: statement,
                        values: [],
                    });
                }
                return res;
            });
        }
        run(statement, values) {
            return __awaiter(this, void 0, void 0, function* () {
                let res;
                if (values && values.length > 0) {
                    res = yield this.sqlite.run({
                        database: this.dbName,
                        statement: statement,
                        values: values,
                    });
                }
                else {
                    res = yield this.sqlite.run({
                        database: this.dbName,
                        statement: statement,
                        values: [],
                    });
                }
                return res;
            });
        }
        executeSet(set) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.executeSet({
                    database: this.dbName,
                    set: set,
                });
                return res;
            });
        }
        isExists() {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.isDBExists({
                    database: this.dbName,
                });
                return res;
            });
        }
        delete() {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.deleteDatabase({
                    database: this.dbName,
                });
                return res;
            });
        }
        createSyncTable() {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.createSyncTable({
                    database: this.dbName,
                });
                return res;
            });
        }
        setSyncDate(syncdate) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.setSyncDate({
                    database: this.dbName,
                    syncdate: syncdate,
                });
                return res;
            });
        }
        getSyncDate() {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.getSyncDate({
                    database: this.dbName,
                });
                return res;
            });
        }
        exportToJson(mode) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.sqlite.exportToJson({
                    database: this.dbName,
                    jsonexportmode: mode,
                });
                return res;
            });
        }
    }

    var CameraSource;
    (function (CameraSource) {
        CameraSource["Prompt"] = "PROMPT";
        CameraSource["Camera"] = "CAMERA";
        CameraSource["Photos"] = "PHOTOS";
    })(CameraSource || (CameraSource = {}));
    var CameraDirection;
    (function (CameraDirection) {
        CameraDirection["Rear"] = "REAR";
        CameraDirection["Front"] = "FRONT";
    })(CameraDirection || (CameraDirection = {}));
    var CameraResultType;
    (function (CameraResultType) {
        CameraResultType["Uri"] = "uri";
        CameraResultType["Base64"] = "base64";
        CameraResultType["DataUrl"] = "dataUrl";
    })(CameraResultType || (CameraResultType = {}));
    var FilesystemDirectory;
    (function (FilesystemDirectory) {
        /**
         * The Documents directory
         * On iOS it's the app's documents directory.
         * Use this directory to store user-generated content.
         * On Android it's the Public Documents folder, so it's accessible from other apps.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["Documents"] = "DOCUMENTS";
        /**
         * The Data directory
         * On iOS it will use the Documents directory
         * On Android it's the directory holding application files.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["Data"] = "DATA";
        /**
         * The Cache directory
         * Can be deleted in cases of low memory, so use this directory to write app-specific files
         * that your app can re-create easily.
         */
        FilesystemDirectory["Cache"] = "CACHE";
        /**
         * The external directory
         * On iOS it will use the Documents directory
         * On Android it's the directory on the primary shared/external
         * storage device where the application can place persistent files it owns.
         * These files are internal to the applications, and not typically visible
         * to the user as media.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["External"] = "EXTERNAL";
        /**
         * The external storage directory
         * On iOS it will use the Documents directory
         * On Android it's the primary shared/external storage directory.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["ExternalStorage"] = "EXTERNAL_STORAGE";
    })(FilesystemDirectory || (FilesystemDirectory = {}));
    var FilesystemEncoding;
    (function (FilesystemEncoding) {
        FilesystemEncoding["UTF8"] = "utf8";
        FilesystemEncoding["ASCII"] = "ascii";
        FilesystemEncoding["UTF16"] = "utf16";
    })(FilesystemEncoding || (FilesystemEncoding = {}));
    var HapticsImpactStyle;
    (function (HapticsImpactStyle) {
        HapticsImpactStyle["Heavy"] = "HEAVY";
        HapticsImpactStyle["Medium"] = "MEDIUM";
        HapticsImpactStyle["Light"] = "LIGHT";
    })(HapticsImpactStyle || (HapticsImpactStyle = {}));
    var HapticsNotificationType;
    (function (HapticsNotificationType) {
        HapticsNotificationType["SUCCESS"] = "SUCCESS";
        HapticsNotificationType["WARNING"] = "WARNING";
        HapticsNotificationType["ERROR"] = "ERROR";
    })(HapticsNotificationType || (HapticsNotificationType = {}));
    var KeyboardStyle;
    (function (KeyboardStyle) {
        KeyboardStyle["Dark"] = "DARK";
        KeyboardStyle["Light"] = "LIGHT";
    })(KeyboardStyle || (KeyboardStyle = {}));
    var KeyboardResize;
    (function (KeyboardResize) {
        KeyboardResize["Body"] = "body";
        KeyboardResize["Ionic"] = "ionic";
        KeyboardResize["Native"] = "native";
        KeyboardResize["None"] = "none";
    })(KeyboardResize || (KeyboardResize = {}));
    var ActionSheetOptionStyle;
    (function (ActionSheetOptionStyle) {
        ActionSheetOptionStyle["Default"] = "DEFAULT";
        ActionSheetOptionStyle["Destructive"] = "DESTRUCTIVE";
        ActionSheetOptionStyle["Cancel"] = "CANCEL";
    })(ActionSheetOptionStyle || (ActionSheetOptionStyle = {}));
    //
    var PermissionType;
    (function (PermissionType) {
        PermissionType["Camera"] = "camera";
        PermissionType["Photos"] = "photos";
        PermissionType["Geolocation"] = "geolocation";
        PermissionType["Notifications"] = "notifications";
        PermissionType["ClipboardRead"] = "clipboard-read";
        PermissionType["ClipboardWrite"] = "clipboard-write";
        PermissionType["Microphone"] = "microphone";
    })(PermissionType || (PermissionType = {}));
    var PhotosAlbumType;
    (function (PhotosAlbumType) {
        /**
         * Album is a "smart" album (such as Favorites or Recently Added)
         */
        PhotosAlbumType["Smart"] = "smart";
        /**
         * Album is a cloud-shared album
         */
        PhotosAlbumType["Shared"] = "shared";
        /**
         * Album is a user-created album
         */
        PhotosAlbumType["User"] = "user";
    })(PhotosAlbumType || (PhotosAlbumType = {}));
    var StatusBarStyle;
    (function (StatusBarStyle) {
        /**
         * Light text for dark backgrounds.
         */
        StatusBarStyle["Dark"] = "DARK";
        /**
         * Dark text for light backgrounds.
         */
        StatusBarStyle["Light"] = "LIGHT";
    })(StatusBarStyle || (StatusBarStyle = {}));
    var StatusBarAnimation;
    (function (StatusBarAnimation) {
        /**
         * No animation during show/hide.
         */
        StatusBarAnimation["None"] = "NONE";
        /**
         * Slide animation during show/hide.
         */
        StatusBarAnimation["Slide"] = "SLIDE";
        /**
         * Fade animation during show/hide.
         */
        StatusBarAnimation["Fade"] = "FADE";
    })(StatusBarAnimation || (StatusBarAnimation = {}));

    var CapacitorWeb = /** @class */ (function () {
        function CapacitorWeb() {
            var _this = this;
            this.platform = 'web';
            this.isNative = false;
            // Need to assign here to avoid having to define every plugin but still
            // get the typed benefits of the provided plugins in PluginRegistry
            this.Plugins = {};
            // Gracefully degrade in non-Proxy supporting engines, e.g. IE11. This
            // effectively means that trying to access an unavailable plugin will
            // locally throw, but this is still better than throwing a syntax error.
            if (typeof Proxy !== 'undefined') {
                // Build a proxy for the Plugins object that returns the "Noop Plugin"
                // if a plugin isn't available
                this.Plugins = new Proxy(this.Plugins, {
                    get: function (target, prop) {
                        if (typeof target[prop] === 'undefined') {
                            var thisRef_1 = _this;
                            return new Proxy({}, {
                                get: function (_target, _prop) {
                                    if (typeof _target[_prop] === 'undefined') {
                                        return thisRef_1.pluginMethodNoop.bind(thisRef_1, _target, _prop, prop);
                                    }
                                    else {
                                        return _target[_prop];
                                    }
                                }
                            });
                        }
                        else {
                            return target[prop];
                        }
                    }
                });
            }
        }
        CapacitorWeb.prototype.pluginMethodNoop = function (_target, _prop, pluginName) {
            return Promise.reject(pluginName + " does not have web implementation.");
        };
        CapacitorWeb.prototype.getPlatform = function () {
            return this.platform;
        };
        CapacitorWeb.prototype.isPluginAvailable = function (name) {
            return this.Plugins.hasOwnProperty(name);
        };
        CapacitorWeb.prototype.convertFileSrc = function (filePath) {
            return filePath;
        };
        CapacitorWeb.prototype.handleError = function (e) {
            console.error(e);
        };
        return CapacitorWeb;
    }());

    // Create our default Capacitor instance, which will be
    // overridden on native platforms
    var Capacitor$1 = (function (globalThis) {
        // Create a new CapacitorWeb instance if one doesn't already exist on globalThis
        // Ensure the global is assigned the same Capacitor instance,
        // then export Capacitor so it can be imported in other modules
        return globalThis.Capacitor = (globalThis.Capacitor || new CapacitorWeb());
    })(
    // figure out the current globalThis, such as "window", "self" or "global"
    // ensure errors are not thrown in an node SSR environment or web worker
    typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
    var Plugins = Capacitor$1.Plugins;

    var WebPluginRegistry = /** @class */ (function () {
        function WebPluginRegistry() {
            this.plugins = {};
            this.loadedPlugins = {};
        }
        WebPluginRegistry.prototype.addPlugin = function (plugin) {
            this.plugins[plugin.config.name] = plugin;
        };
        WebPluginRegistry.prototype.getPlugin = function (name) {
            return this.plugins[name];
        };
        WebPluginRegistry.prototype.loadPlugin = function (name) {
            var plugin = this.getPlugin(name);
            if (!plugin) {
                console.error("Unable to load web plugin " + name + ", no such plugin found.");
                return;
            }
            plugin.load();
        };
        WebPluginRegistry.prototype.getPlugins = function () {
            var p = [];
            for (var name_1 in this.plugins) {
                p.push(this.plugins[name_1]);
            }
            return p;
        };
        return WebPluginRegistry;
    }());
    var WebPlugins = new WebPluginRegistry();
    var WebPlugin = /** @class */ (function () {
        function WebPlugin(config, pluginRegistry) {
            this.config = config;
            this.loaded = false;
            this.listeners = {};
            this.windowListeners = {};
            if (!pluginRegistry) {
                WebPlugins.addPlugin(this);
            }
            else {
                pluginRegistry.addPlugin(this);
            }
        }
        WebPlugin.prototype.addWindowListener = function (handle) {
            window.addEventListener(handle.windowEventName, handle.handler);
            handle.registered = true;
        };
        WebPlugin.prototype.removeWindowListener = function (handle) {
            if (!handle) {
                return;
            }
            window.removeEventListener(handle.windowEventName, handle.handler);
            handle.registered = false;
        };
        WebPlugin.prototype.addListener = function (eventName, listenerFunc) {
            var _this = this;
            var listeners = this.listeners[eventName];
            if (!listeners) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push(listenerFunc);
            // If we haven't added a window listener for this event and it requires one,
            // go ahead and add it
            var windowListener = this.windowListeners[eventName];
            if (windowListener && !windowListener.registered) {
                this.addWindowListener(windowListener);
            }
            return {
                remove: function () {
                    _this.removeListener(eventName, listenerFunc);
                }
            };
        };
        WebPlugin.prototype.removeListener = function (eventName, listenerFunc) {
            var listeners = this.listeners[eventName];
            if (!listeners) {
                return;
            }
            var index = listeners.indexOf(listenerFunc);
            this.listeners[eventName].splice(index, 1);
            // If there are no more listeners for this type of event,
            // remove the window listener
            if (!this.listeners[eventName].length) {
                this.removeWindowListener(this.windowListeners[eventName]);
            }
        };
        WebPlugin.prototype.removeAllListeners = function () {
            this.listeners = {};
            for (var listener in this.windowListeners) {
                this.removeWindowListener(this.windowListeners[listener]);
            }
            this.windowListeners = {};
        };
        WebPlugin.prototype.notifyListeners = function (eventName, data) {
            var listeners = this.listeners[eventName];
            if (listeners) {
                listeners.forEach(function (listener) { return listener(data); });
            }
        };
        WebPlugin.prototype.hasListeners = function (eventName) {
            return !!this.listeners[eventName].length;
        };
        WebPlugin.prototype.registerWindowListener = function (windowEventName, pluginEventName) {
            var _this = this;
            this.windowListeners[pluginEventName] = {
                registered: false,
                windowEventName: windowEventName,
                pluginEventName: pluginEventName,
                handler: function (event) {
                    _this.notifyListeners(pluginEventName, event);
                }
            };
        };
        WebPlugin.prototype.requestPermissions = function () {
            if (Capacitor.isNative) {
                return Capacitor.nativePromise(this.config.name, 'requestPermissions', {});
            }
            else {
                return Promise.resolve({ results: [] });
            }
        };
        WebPlugin.prototype.load = function () {
            this.loaded = true;
        };
        return WebPlugin;
    }());
    var shouldMergeWebPlugin = function (plugin) {
        return plugin.config.platforms && plugin.config.platforms.indexOf(Capacitor.platform) >= 0;
    };
    /**
     * For all our known web plugins, merge them into the global plugins
     * registry if they aren't already existing. If they don't exist, that
     * means there's no existing native implementation for it.
     * @param knownPlugins the Capacitor.Plugins global registry.
     */
    var mergeWebPlugins = function (knownPlugins) {
        var plugins = WebPlugins.getPlugins();
        for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
            var plugin = plugins_1[_i];
            mergeWebPlugin(knownPlugins, plugin);
        }
    };
    var mergeWebPlugin = function (knownPlugins, plugin) {
        // If we already have a plugin registered (meaning it was defined in the native layer),
        // then we should only overwrite it if the corresponding web plugin activates on
        // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
        if (knownPlugins.hasOwnProperty(plugin.config.name) && !shouldMergeWebPlugin(plugin)) {
            return;
        }
        knownPlugins[plugin.config.name] = plugin;
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var AccessibilityPluginWeb = /** @class */ (function (_super) {
        __extends(AccessibilityPluginWeb, _super);
        function AccessibilityPluginWeb() {
            return _super.call(this, {
                name: 'Accessibility',
                platforms: ['web']
            }) || this;
        }
        AccessibilityPluginWeb.prototype.isScreenReaderEnabled = function () {
            throw new Error('Feature not available in the browser');
        };
        AccessibilityPluginWeb.prototype.speak = function (options) {
            if (!('speechSynthesis' in window)) {
                return Promise.reject('Browser does not support the Speech Synthesis API');
            }
            var utterance = new SpeechSynthesisUtterance(options.value);
            if (options.language) {
                utterance.lang = options.language;
            }
            window.speechSynthesis.speak(utterance);
            return Promise.resolve();
        };
        return AccessibilityPluginWeb;
    }(WebPlugin));
    var Accessibility = new AccessibilityPluginWeb();

    var AppPluginWeb = /** @class */ (function (_super) {
        __extends(AppPluginWeb, _super);
        function AppPluginWeb() {
            var _this = _super.call(this, {
                name: 'App',
                platforms: ['web']
            }) || this;
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', _this.handleVisibilityChange.bind(_this), false);
            }
            return _this;
        }
        AppPluginWeb.prototype.exitApp = function () {
            throw new Error('Method not implemented.');
        };
        AppPluginWeb.prototype.canOpenUrl = function (_options) {
            return Promise.resolve({ value: true });
        };
        AppPluginWeb.prototype.openUrl = function (_options) {
            return Promise.resolve({ completed: true });
        };
        AppPluginWeb.prototype.getLaunchUrl = function () {
            return Promise.resolve({ url: '' });
        };
        AppPluginWeb.prototype.getState = function () {
            return Promise.resolve({ isActive: document.hidden !== true });
        };
        AppPluginWeb.prototype.handleVisibilityChange = function () {
            var data = {
                isActive: document.hidden !== true
            };
            this.notifyListeners('appStateChange', data);
        };
        return AppPluginWeb;
    }(WebPlugin));
    var App = new AppPluginWeb();

    var BrowserPluginWeb = /** @class */ (function (_super) {
        __extends(BrowserPluginWeb, _super);
        function BrowserPluginWeb() {
            return _super.call(this, {
                name: 'Browser',
                platforms: ['web']
            }) || this;
        }
        BrowserPluginWeb.prototype.open = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._lastWindow = window.open(options.url, options.windowName || '_blank');
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.prefetch = function (_options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Does nothing
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.close = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._lastWindow && this._lastWindow.close();
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        return BrowserPluginWeb;
    }(WebPlugin));
    var Browser = new BrowserPluginWeb();

    var CameraPluginWeb = /** @class */ (function (_super) {
        __extends(CameraPluginWeb, _super);
        function CameraPluginWeb() {
            return _super.call(this, {
                name: 'Camera',
                platforms: ['web']
            }) || this;
        }
        CameraPluginWeb.prototype.getPhoto = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter$1(_this, void 0, void 0, function () {
                            var cameraModal_1, e_1;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!options.webUseInput) return [3 /*break*/, 1];
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 7];
                                    case 1:
                                        if (!customElements.get('pwa-camera-modal')) return [3 /*break*/, 6];
                                        cameraModal_1 = document.createElement('pwa-camera-modal');
                                        document.body.appendChild(cameraModal_1);
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, cameraModal_1.componentOnReady()];
                                    case 3:
                                        _a.sent();
                                        cameraModal_1.addEventListener('onPhoto', function (e) { return __awaiter$1(_this, void 0, void 0, function () {
                                            var photo, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        photo = e.detail;
                                                        if (!(photo === null)) return [3 /*break*/, 1];
                                                        reject('User cancelled photos app');
                                                        return [3 /*break*/, 4];
                                                    case 1:
                                                        if (!(photo instanceof Error)) return [3 /*break*/, 2];
                                                        reject(photo.message);
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        _a = resolve;
                                                        return [4 /*yield*/, this._getCameraPhoto(photo, options)];
                                                    case 3:
                                                        _a.apply(void 0, [_b.sent()]);
                                                        _b.label = 4;
                                                    case 4:
                                                        cameraModal_1.dismiss();
                                                        document.body.removeChild(cameraModal_1);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        cameraModal_1.present();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_1 = _a.sent();
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 5];
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        console.error("Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/pwa-elements.");
                                        this.fileInputExperience(options, resolve);
                                        _a.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        CameraPluginWeb.prototype.fileInputExperience = function (options, resolve) {
            var input = document.querySelector('#_capacitor-camera-input');
            var cleanup = function () {
                input.parentNode && input.parentNode.removeChild(input);
            };
            if (!input) {
                input = document.createElement('input');
                input.id = '_capacitor-camera-input';
                input.type = 'file';
                document.body.appendChild(input);
            }
            input.accept = 'image/*';
            input.capture = true;
            if (options.source === CameraSource.Photos || options.source === CameraSource.Prompt) {
                input.removeAttribute('capture');
            }
            else if (options.direction === CameraDirection.Front) {
                input.capture = 'user';
            }
            else if (options.direction === CameraDirection.Rear) {
                input.capture = 'environment';
            }
            input.addEventListener('change', function (_e) {
                var file = input.files[0];
                var format = 'jpeg';
                if (file.type === 'image/png') {
                    format = 'png';
                }
                else if (file.type === 'image/gif') {
                    format = 'gif';
                }
                if (options.resultType === CameraResultType.DataUrl || options.resultType === CameraResultType.Base64) {
                    var reader_1 = new FileReader();
                    reader_1.addEventListener('load', function () {
                        if (options.resultType === CameraResultType.DataUrl) {
                            resolve({
                                dataUrl: reader_1.result,
                                format: format
                            });
                        }
                        else if (options.resultType === CameraResultType.Base64) {
                            var b64 = reader_1.result.split(',')[1];
                            resolve({
                                base64String: b64,
                                format: format
                            });
                        }
                        cleanup();
                    });
                    reader_1.readAsDataURL(file);
                }
                else {
                    resolve({
                        webPath: URL.createObjectURL(file),
                        format: format
                    });
                    cleanup();
                }
            });
            input.click();
        };
        CameraPluginWeb.prototype._getCameraPhoto = function (photo, options) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                var format = photo.type.split('/')[1];
                if (options.resultType === CameraResultType.Uri) {
                    resolve({
                        webPath: URL.createObjectURL(photo),
                        format: format
                    });
                }
                else {
                    reader.readAsDataURL(photo);
                    reader.onloadend = function () {
                        var r = reader.result;
                        if (options.resultType === CameraResultType.DataUrl) {
                            resolve({
                                dataUrl: r,
                                format: format
                            });
                        }
                        else {
                            resolve({
                                base64String: r.split(',')[1],
                                format: format
                            });
                        }
                    };
                    reader.onerror = function (e) {
                        reject(e);
                    };
                }
            });
        };
        return CameraPluginWeb;
    }(WebPlugin));
    var Camera = new CameraPluginWeb();

    var ClipboardPluginWeb = /** @class */ (function (_super) {
        __extends(ClipboardPluginWeb, _super);
        function ClipboardPluginWeb() {
            return _super.call(this, {
                name: 'Clipboard',
                platforms: ['web']
            }) || this;
        }
        ClipboardPluginWeb.prototype.write = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var blob, clipboardItemInput, err_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!(options.string !== undefined || options.url)) return [3 /*break*/, 2];
                            if (!navigator.clipboard.writeText) {
                                return [2 /*return*/, Promise.reject('Writting to clipboard not supported in this browser')];
                            }
                            return [4 /*yield*/, navigator.clipboard.writeText(options.string !== undefined ? options.string : options.url)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 2:
                            if (!options.image) return [3 /*break*/, 9];
                            if (!navigator.clipboard.write) {
                                return [2 /*return*/, Promise.reject('Setting images not supported in this browser')];
                            }
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, fetch(options.image)];
                        case 4: return [4 /*yield*/, (_b.sent()).blob()];
                        case 5:
                            blob = _b.sent();
                            clipboardItemInput = new ClipboardItem((_a = {}, _a[blob.type] = blob, _a));
                            return [4 /*yield*/, navigator.clipboard.write([clipboardItemInput])];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            err_1 = _b.sent();
                            return [2 /*return*/, Promise.reject('Failed to write image')];
                        case 8: return [3 /*break*/, 10];
                        case 9: return [2 /*return*/, Promise.reject('Nothing to write')];
                        case 10: return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.read = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var clipboardItems, type, clipboardBlob, data, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!!navigator.clipboard.read) return [3 /*break*/, 1];
                            if (!navigator.clipboard.readText) {
                                return [2 /*return*/, Promise.reject('Reading from clipboard not supported in this browser')];
                            }
                            return [2 /*return*/, this.readText()];
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, navigator.clipboard.read()];
                        case 2:
                            clipboardItems = _a.sent();
                            type = clipboardItems[0].types[0];
                            return [4 /*yield*/, clipboardItems[0].getType(type)];
                        case 3:
                            clipboardBlob = _a.sent();
                            return [4 /*yield*/, this._getBlobData(clipboardBlob, type)];
                        case 4:
                            data = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: data, type: type })];
                        case 5:
                            err_2 = _a.sent();
                            return [2 /*return*/, this.readText()];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.readText = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigator.clipboard.readText()];
                        case 1:
                            text = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: text, type: 'text/plain' })];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype._getBlobData = function (clipboardBlob, type) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                if (type.includes('image')) {
                    reader.readAsDataURL(clipboardBlob);
                }
                else {
                    reader.readAsText(clipboardBlob);
                }
                reader.onloadend = function () {
                    var r = reader.result;
                    resolve(r);
                };
                reader.onerror = function (e) {
                    reject(e);
                };
            });
        };
        return ClipboardPluginWeb;
    }(WebPlugin));
    var Clipboard = new ClipboardPluginWeb();

    var FilesystemPluginWeb = /** @class */ (function (_super) {
        __extends(FilesystemPluginWeb, _super);
        function FilesystemPluginWeb() {
            var _this = _super.call(this, {
                name: 'Filesystem',
                platforms: ['web']
            }) || this;
            _this.DEFAULT_DIRECTORY = FilesystemDirectory.Data;
            _this.DB_VERSION = 1;
            _this.DB_NAME = 'Disc';
            _this._writeCmds = ['add', 'put', 'delete'];
            return _this;
        }
        FilesystemPluginWeb.prototype.initDb = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this._db !== undefined) {
                        return [2 /*return*/, this._db];
                    }
                    if (!('indexedDB' in window)) {
                        throw new Error('This browser doesn\'t support IndexedDB');
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);
                            request.onupgradeneeded = FilesystemPluginWeb.doUpgrade;
                            request.onsuccess = function () {
                                _this._db = request.result;
                                resolve(request.result);
                            };
                            request.onerror = function () { return reject(request.error); };
                            request.onblocked = function () {
                                console.warn('db blocked');
                            };
                        })];
                });
            });
        };
        FilesystemPluginWeb.doUpgrade = function (event) {
            var eventTarget = event.target;
            var db = eventTarget.result;
            switch (event.oldVersion) {
                case 0:
                case 1:
                default:
                    if (db.objectStoreNames.contains('FileStorage')) {
                        db.deleteObjectStore('FileStorage');
                    }
                    var store = db.createObjectStore('FileStorage', { keyPath: 'path' });
                    store.createIndex('by_folder', 'folder');
            }
        };
        FilesystemPluginWeb.prototype.dbRequest = function (cmd, args) {
            return __awaiter$1(this, void 0, void 0, function () {
                var readFlag;
                return __generator(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var req = store[cmd].apply(store, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.dbIndexRequest = function (indexName, cmd, args) {
            return __awaiter$1(this, void 0, void 0, function () {
                var readFlag;
                return __generator(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var index = store.index(indexName);
                                var req = index[cmd].apply(index, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.getPath = function (directory, uriPath) {
            directory = directory || this.DEFAULT_DIRECTORY;
            var cleanedUriPath = uriPath !== undefined ? uriPath.replace(/^[/]+|[/]+$/g, '') : '';
            var fsPath = '/' + directory;
            if (uriPath !== '')
                fsPath += '/' + cleanedUriPath;
            return fsPath;
        };
        FilesystemPluginWeb.prototype.clear = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var conn, tx, store;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initDb()];
                        case 1:
                            conn = _a.sent();
                            tx = conn.transaction(['FileStorage'], 'readwrite');
                            store = tx.objectStore('FileStorage');
                            store.clear();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Read a file from disk
         * @param options options for the file read
         * @return a promise that resolves with the read file data result
         */
        FilesystemPluginWeb.prototype.readFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [2 /*return*/, { data: entry.content }];
                    }
                });
            });
        };
        /**
         * Write a file to disk in the specified location on device
         * @param options options for the file write
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.writeFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, data, doRecursive, occupiedEntry, encoding, parentPath, parentEntry, subDirIndex, parentArgPath, now, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            doRecursive = options.recursive;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            encoding = options.encoding;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: doRecursive })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: now,
                                mtime: now,
                                content: !encoding && data.indexOf(',') >= 0 ? data.split(',')[1] : data,
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    uri: pathObj.path
                                }];
                    }
                });
            });
        };
        /**
         * Append to a file on disk in the specified location on device
         * @param options options for the file append
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.appendFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, data, parentPath, now, ctime, occupiedEntry, parentEntry, subDirIndex, parentArgPath, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            now = Date.now();
                            ctime = now;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: true })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (occupiedEntry !== undefined) {
                                data = occupiedEntry.content + data;
                                ctime = occupiedEntry.ctime;
                            }
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: ctime,
                                mtime: now,
                                content: data
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Delete a file from disk
         * @param options options for the file delete
         * @return a promise that resolves with the deleted file data result
         */
        FilesystemPluginWeb.prototype.deleteFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry, entries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            if (entries.length !== 0)
                                throw Error('Folder is not empty.');
                            return [4 /*yield*/, this.dbRequest('delete', [path])];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Create a directory.
         * @param options options for the mkdir
         * @return a promise that resolves with the mkdir result
         */
        FilesystemPluginWeb.prototype.mkdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, doRecursive, parentPath, depth, parentEntry, occupiedEntry, parentArgPath, now, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            doRecursive = options.recursive;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            depth = (path.match(/\//g) || []).length;
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 1:
                            parentEntry = _a.sent();
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 2:
                            occupiedEntry = _a.sent();
                            if (depth === 1)
                                throw Error('Cannot create Root directory');
                            if (occupiedEntry !== undefined)
                                throw Error('Current directory does already exist.');
                            if (!doRecursive && depth !== 2 && parentEntry === undefined)
                                throw Error('Parent directory must exist');
                            if (!(doRecursive && depth !== 2 && parentEntry === undefined)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(parentPath.indexOf('/', 1));
                            return [4 /*yield*/, this.mkdir({
                                    path: parentArgPath,
                                    directory: options.directory,
                                    recursive: doRecursive
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = { path: path, folder: parentPath, type: 'directory', size: 0, ctime: now, mtime: now };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Remove a directory
         * @param options the options for the directory remove
         */
        FilesystemPluginWeb.prototype.rmdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, directory, recursive, fullPath, entry, readDirResult, _i, _a, entry_1, entryPath, entryObj;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            path = options.path, directory = options.directory, recursive = options.recursive;
                            fullPath = this.getPath(directory, path);
                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                        case 1:
                            entry = _b.sent();
                            if (entry === undefined)
                                throw Error('Folder does not exist.');
                            if (entry.type !== 'directory')
                                throw Error('Requested path is not a directory');
                            return [4 /*yield*/, this.readdir({ path: path, directory: directory })];
                        case 2:
                            readDirResult = _b.sent();
                            if (readDirResult.files.length !== 0 && !recursive)
                                throw Error('Folder is not empty');
                            _i = 0, _a = readDirResult.files;
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            entry_1 = _a[_i];
                            entryPath = path + "/" + entry_1;
                            return [4 /*yield*/, this.stat({ path: entryPath, directory: directory })];
                        case 4:
                            entryObj = _b.sent();
                            if (!(entryObj.type === 'file')) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.deleteFile({ path: entryPath, directory: directory })];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.rmdir({ path: entryPath, directory: directory, recursive: recursive })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 3];
                        case 9: return [4 /*yield*/, this.dbRequest('delete', [fullPath])];
                        case 10:
                            _b.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Return a list of files from the directory (not recursive)
         * @param options the options for the readdir operation
         * @return a promise that resolves with the readdir directory listing result
         */
        FilesystemPluginWeb.prototype.readdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry, entries, names;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (options.path !== '' && entry === undefined)
                                throw Error('Folder does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            names = entries.map(function (e) {
                                return e.substring(path.length + 1);
                            });
                            return [2 /*return*/, { files: names }];
                    }
                });
            });
        };
        /**
         * Return full File URI for a path and directory
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.getUri = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Return data about a file
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.stat = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    type: entry.type,
                                    size: entry.size,
                                    ctime: entry.ctime,
                                    mtime: entry.mtime,
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Rename a file or directory
         * @param options the options for the rename operation
         * @return a promise that resolves with the rename result
         */
        FilesystemPluginWeb.prototype.rename = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._copy(options, true)];
                });
            });
        };
        /**
         * Copy a file or directory
         * @param options the options for the copy operation
         * @return a promise that resolves with the copy result
         */
        FilesystemPluginWeb.prototype.copy = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._copy(options, false)];
                });
            });
        };
        /**
         * Function that can perform a copy or a rename
         * @param options the options for the rename operation
         * @param doRename whether to perform a rename or copy operation
         * @return a promise that resolves with the result
         */
        FilesystemPluginWeb.prototype._copy = function (options, doRename) {
            if (doRename === void 0) { doRename = false; }
            return __awaiter$1(this, void 0, void 0, function () {
                var to, from, fromDirectory, toDirectory, fromPath, toPath, toObj, e_1, toPathComponents, toPath_1, toParentDirectory, fromObj, updateTime, _a, file, e_2, contents, _i, contents_1, filename;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            to = options.to, from = options.from, fromDirectory = options.directory, toDirectory = options.toDirectory;
                            if (!to || !from) {
                                throw Error('Both to and from must be provided');
                            }
                            // If no "to" directory is provided, use the "from" directory
                            if (!toDirectory) {
                                toDirectory = fromDirectory;
                            }
                            fromPath = this.getPath(fromDirectory, from);
                            toPath = this.getPath(toDirectory, to);
                            // Test that the "to" and "from" locations are different
                            if (fromPath === toPath) {
                                return [2 /*return*/, {}];
                            }
                            if (toPath.startsWith(fromPath)) {
                                throw Error('To path cannot contain the from path');
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.stat({
                                    path: to,
                                    directory: toDirectory
                                })];
                        case 2:
                            toObj = _b.sent();
                            return [3 /*break*/, 6];
                        case 3:
                            e_1 = _b.sent();
                            toPathComponents = to.split('/');
                            toPathComponents.pop();
                            toPath_1 = toPathComponents.join('/');
                            if (!(toPathComponents.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.stat({
                                    path: toPath_1,
                                    directory: toDirectory,
                                })];
                        case 4:
                            toParentDirectory = _b.sent();
                            if (toParentDirectory.type !== 'directory') {
                                throw new Error('Parent directory of the to path is a file');
                            }
                            _b.label = 5;
                        case 5: return [3 /*break*/, 6];
                        case 6:
                            // Cannot overwrite a directory
                            if (toObj && toObj.type === 'directory') {
                                throw new Error('Cannot overwrite a directory with a file');
                            }
                            return [4 /*yield*/, this.stat({
                                    path: from,
                                    directory: fromDirectory,
                                })];
                        case 7:
                            fromObj = _b.sent();
                            updateTime = function (path, ctime, mtime) { return __awaiter$1(_this, void 0, void 0, function () {
                                var fullPath, entry;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            fullPath = this.getPath(toDirectory, path);
                                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                                        case 1:
                                            entry = _a.sent();
                                            entry.ctime = ctime;
                                            entry.mtime = mtime;
                                            return [4 /*yield*/, this.dbRequest('put', [entry])];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a = fromObj.type;
                            switch (_a) {
                                case 'file': return [3 /*break*/, 8];
                                case 'directory': return [3 /*break*/, 15];
                            }
                            return [3 /*break*/, 28];
                        case 8: return [4 /*yield*/, this.readFile({
                                path: from,
                                directory: fromDirectory
                            })];
                        case 9:
                            file = _b.sent();
                            if (!doRename) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.deleteFile({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 10:
                            _b.sent();
                            _b.label = 11;
                        case 11: 
                        // Write the file to the new location
                        return [4 /*yield*/, this.writeFile({
                                path: to,
                                directory: toDirectory,
                                data: file.data
                            })];
                        case 12:
                            // Write the file to the new location
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 14];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 13:
                            _b.sent();
                            _b.label = 14;
                        case 14: 
                        // Resolve promise
                        return [2 /*return*/, {}];
                        case 15:
                            if (toObj) {
                                throw Error('Cannot move a directory over an existing object');
                            }
                            _b.label = 16;
                        case 16:
                            _b.trys.push([16, 20, , 21]);
                            // Create the to directory
                            return [4 /*yield*/, this.mkdir({
                                    path: to,
                                    directory: toDirectory,
                                    recursive: false,
                                })];
                        case 17:
                            // Create the to directory
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 19];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 18:
                            _b.sent();
                            _b.label = 19;
                        case 19: return [3 /*break*/, 21];
                        case 20:
                            e_2 = _b.sent();
                            return [3 /*break*/, 21];
                        case 21: return [4 /*yield*/, this.readdir({
                                path: from,
                                directory: fromDirectory,
                            })];
                        case 22:
                            contents = (_b.sent()).files;
                            _i = 0, contents_1 = contents;
                            _b.label = 23;
                        case 23:
                            if (!(_i < contents_1.length)) return [3 /*break*/, 26];
                            filename = contents_1[_i];
                            // Move item from the from directory to the to directory
                            return [4 /*yield*/, this._copy({
                                    from: from + "/" + filename,
                                    to: to + "/" + filename,
                                    directory: fromDirectory,
                                    toDirectory: toDirectory,
                                }, doRename)];
                        case 24:
                            // Move item from the from directory to the to directory
                            _b.sent();
                            _b.label = 25;
                        case 25:
                            _i++;
                            return [3 /*break*/, 23];
                        case 26:
                            if (!doRename) return [3 /*break*/, 28];
                            return [4 /*yield*/, this.rmdir({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 27:
                            _b.sent();
                            _b.label = 28;
                        case 28: return [2 /*return*/, {}];
                    }
                });
            });
        };
        FilesystemPluginWeb._debug = true;
        return FilesystemPluginWeb;
    }(WebPlugin));
    var Filesystem = new FilesystemPluginWeb();

    var extend = function (target) {
        var objs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objs[_i - 1] = arguments[_i];
        }
        objs.forEach(function (o) {
            if (o && typeof (o) === 'object') {
                for (var k in o) {
                    if (o.hasOwnProperty(k)) {
                        target[k] = o[k];
                    }
                }
            }
        });
        return target;
    };
    var uuid4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var GeolocationPluginWeb = /** @class */ (function (_super) {
        __extends(GeolocationPluginWeb, _super);
        function GeolocationPluginWeb() {
            return _super.call(this, {
                name: 'Geolocation',
                platforms: ['web']
            }) || this;
        }
        GeolocationPluginWeb.prototype.getCurrentPosition = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                return _this.requestPermissions().then(function (_result) {
                    window.navigator.geolocation.getCurrentPosition(function (pos) {
                        resolve(pos);
                    }, function (err) {
                        reject(err);
                    }, extend({
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }, options));
                });
            });
        };
        GeolocationPluginWeb.prototype.watchPosition = function (options, callback) {
            var id = window.navigator.geolocation.watchPosition(function (pos) {
                callback(pos);
            }, function (err) {
                callback(null, err);
            }, extend({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }, options));
            return "" + id;
        };
        GeolocationPluginWeb.prototype.clearWatch = function (options) {
            window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
            return Promise.resolve();
        };
        return GeolocationPluginWeb;
    }(WebPlugin));
    var Geolocation = new GeolocationPluginWeb();

    var DevicePluginWeb = /** @class */ (function (_super) {
        __extends(DevicePluginWeb, _super);
        function DevicePluginWeb() {
            return _super.call(this, {
                name: 'Device',
                platforms: ['web']
            }) || this;
        }
        DevicePluginWeb.prototype.getInfo = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var ua, uaFields;
                return __generator(this, function (_a) {
                    ua = navigator.userAgent;
                    uaFields = this.parseUa(ua);
                    return [2 /*return*/, Promise.resolve({
                            model: uaFields.model,
                            platform: 'web',
                            appVersion: '',
                            appBuild: '',
                            appId: '',
                            appName: '',
                            operatingSystem: uaFields.operatingSystem,
                            osVersion: uaFields.osVersion,
                            manufacturer: navigator.vendor,
                            isVirtual: false,
                            uuid: this.getUid()
                        })];
                });
            });
        };
        DevicePluginWeb.prototype.getBatteryInfo = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var battery, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            battery = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, navigator.getBattery()];
                        case 2:
                            battery = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, Promise.resolve({
                                batteryLevel: battery.level,
                                isCharging: battery.charging
                            })];
                    }
                });
            });
        };
        DevicePluginWeb.prototype.getLanguageCode = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            value: navigator.language
                        }];
                });
            });
        };
        DevicePluginWeb.prototype.parseUa = function (_ua) {
            var uaFields = {};
            var start = _ua.indexOf('(') + 1;
            var end = _ua.indexOf(') AppleWebKit');
            if (_ua.indexOf(') Gecko') !== -1) {
                end = _ua.indexOf(') Gecko');
            }
            var fields = _ua.substring(start, end);
            if (_ua.indexOf('Android') !== -1) {
                uaFields.model = fields.replace('; wv', '').split('; ').pop().split(' Build')[0];
                uaFields.osVersion = fields.split('; ')[1];
            }
            else {
                uaFields.model = fields.split('; ')[0];
                if (navigator.oscpu) {
                    uaFields.osVersion = navigator.oscpu;
                }
                else {
                    if (_ua.indexOf('Windows') !== -1) {
                        uaFields.osVersion = fields;
                    }
                    else {
                        var lastParts = fields.split('; ').pop().replace(' like Mac OS X', '').split(' ');
                        uaFields.osVersion = lastParts[lastParts.length - 1].replace(/_/g, '.');
                    }
                }
            }
            if (/android/i.test(_ua)) {
                uaFields.operatingSystem = 'android';
            }
            else if (/iPad|iPhone|iPod/.test(_ua) && !window.MSStream) {
                uaFields.operatingSystem = 'ios';
            }
            else if (/Win/.test(_ua)) {
                uaFields.operatingSystem = 'windows';
            }
            else if (/Mac/i.test(_ua)) {
                uaFields.operatingSystem = 'mac';
            }
            else {
                uaFields.operatingSystem = 'unknown';
            }
            return uaFields;
        };
        DevicePluginWeb.prototype.getUid = function () {
            var uid = window.localStorage.getItem('_capuid');
            if (uid) {
                return uid;
            }
            uid = uuid4();
            window.localStorage.setItem('_capuid', uid);
            return uid;
        };
        return DevicePluginWeb;
    }(WebPlugin));
    var Device = new DevicePluginWeb();

    var LocalNotificationsPluginWeb = /** @class */ (function (_super) {
        __extends(LocalNotificationsPluginWeb, _super);
        function LocalNotificationsPluginWeb() {
            var _this = _super.call(this, {
                name: 'LocalNotifications',
                platforms: ['web']
            }) || this;
            _this.pending = [];
            return _this;
        }
        LocalNotificationsPluginWeb.prototype.createChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.deleteChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.listChannels = function () {
            throw new Error('Feature not available in the browser');
        };
        LocalNotificationsPluginWeb.prototype.sendPending = function () {
            var _this = this;
            var toRemove = [];
            var now = +new Date;
            this.pending.forEach(function (localNotification) {
                if (localNotification.schedule && localNotification.schedule.at) {
                    if (+localNotification.schedule.at <= now) {
                        _this.buildNotification(localNotification);
                        toRemove.push(localNotification);
                    }
                }
            });
            console.log('Sent pending, removing', toRemove);
            this.pending = this.pending.filter(function (localNotification) { return !toRemove.find(function (ln) { return ln === localNotification; }); });
        };
        LocalNotificationsPluginWeb.prototype.sendNotification = function (localNotification) {
            var _this = this;
            var l = localNotification;
            if (localNotification.schedule && localNotification.schedule.at) {
                var diff = +localNotification.schedule.at - +new Date;
                this.pending.push(l);
                setTimeout(function () {
                    _this.sendPending();
                }, diff);
                return;
            }
            this.buildNotification(localNotification);
        };
        LocalNotificationsPluginWeb.prototype.buildNotification = function (localNotification) {
            var l = localNotification;
            return new Notification(l.title, {
                body: l.body
            });
        };
        LocalNotificationsPluginWeb.prototype.schedule = function (options) {
            var _this = this;
            var notifications = [];
            options.notifications.forEach(function (notification) {
                notifications.push(_this.sendNotification(notification));
            });
            return Promise.resolve({
                notifications: options.notifications.map(function (notification) { return { id: '' + notification.id }; })
            });
        };
        LocalNotificationsPluginWeb.prototype.getPending = function () {
            return Promise.resolve({
                notifications: this.pending.map(function (localNotification) {
                    return {
                        id: '' + localNotification.id
                    };
                })
            });
        };
        LocalNotificationsPluginWeb.prototype.registerActionTypes = function (_options) {
            throw new Error('Method not implemented.');
        };
        LocalNotificationsPluginWeb.prototype.cancel = function (pending) {
            console.log('Cancel these', pending);
            this.pending = this.pending.filter(function (localNotification) { return !pending.notifications.find(function (ln) { return ln.id === '' + localNotification.id; }); });
            return Promise.resolve();
        };
        LocalNotificationsPluginWeb.prototype.areEnabled = function () {
            return Promise.resolve({
                value: Notification.permission === 'granted'
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermission = function () {
            return new Promise(function (resolve) {
                Notification.requestPermission(function (result) {
                    var granted = true;
                    if (result === 'denied' || result === 'default') {
                        granted = false;
                    }
                    resolve({ granted: granted });
                });
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermissions = function () {
            return new Promise(function (resolve, reject) {
                Notification.requestPermission(function (result) {
                    if (result === 'denied' || result === 'default') {
                        reject(result);
                        return;
                    }
                    resolve({
                        results: [result]
                    });
                });
            });
        };
        return LocalNotificationsPluginWeb;
    }(WebPlugin));
    var LocalNotifications = new LocalNotificationsPluginWeb();

    var SharePluginWeb = /** @class */ (function (_super) {
        __extends(SharePluginWeb, _super);
        function SharePluginWeb() {
            return _super.call(this, {
                name: 'Share',
                platforms: ['web']
            }) || this;
        }
        SharePluginWeb.prototype.share = function (options) {
            if (!navigator.share) {
                return Promise.reject('Web Share API not available');
            }
            return navigator.share({
                title: options.title,
                text: options.text,
                url: options.url
            });
        };
        return SharePluginWeb;
    }(WebPlugin));
    var Share = new SharePluginWeb();

    var ModalsPluginWeb = /** @class */ (function (_super) {
        __extends(ModalsPluginWeb, _super);
        function ModalsPluginWeb() {
            return _super.call(this, {
                name: 'Modals',
                platforms: ['web']
            }) || this;
        }
        ModalsPluginWeb.prototype.alert = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    window.alert(options.message);
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        ModalsPluginWeb.prototype.prompt = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var val;
                return __generator(this, function (_a) {
                    val = window.prompt(options.message, options.inputText || '');
                    return [2 /*return*/, Promise.resolve({
                            value: val,
                            cancelled: val === null
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.confirm = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var val;
                return __generator(this, function (_a) {
                    val = window.confirm(options.message);
                    return [2 /*return*/, Promise.resolve({
                            value: val
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.showActions = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, _reject) { return __awaiter$1(_this, void 0, void 0, function () {
                            var actionSheet;
                            var _this = this;
                            return __generator(this, function (_a) {
                                actionSheet = document.querySelector('pwa-action-sheet');
                                if (!actionSheet) {
                                    actionSheet = document.createElement('pwa-action-sheet');
                                    document.body.appendChild(actionSheet);
                                }
                                actionSheet.header = options.title;
                                actionSheet.cancelable = false;
                                actionSheet.options = options.options;
                                actionSheet.addEventListener('onSelection', function (e) { return __awaiter$1(_this, void 0, void 0, function () {
                                    var selection;
                                    return __generator(this, function (_a) {
                                        selection = e.detail;
                                        resolve({
                                            index: selection
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [2 /*return*/];
                            });
                        }); })];
                });
            });
        };
        return ModalsPluginWeb;
    }(WebPlugin));
    var Modals = new ModalsPluginWeb();

    var MotionPluginWeb = /** @class */ (function (_super) {
        __extends(MotionPluginWeb, _super);
        function MotionPluginWeb() {
            var _this = _super.call(this, {
                name: 'Motion'
            }) || this;
            _this.registerWindowListener('devicemotion', 'accel');
            _this.registerWindowListener('deviceorientation', 'orientation');
            return _this;
        }
        return MotionPluginWeb;
    }(WebPlugin));
    var Motion = new MotionPluginWeb();

    var NetworkPluginWeb = /** @class */ (function (_super) {
        __extends(NetworkPluginWeb, _super);
        function NetworkPluginWeb() {
            var _this = _super.call(this, {
                name: 'Network',
                platforms: ['web']
            }) || this;
            _this.listenerFunction = null;
            return _this;
        }
        NetworkPluginWeb.prototype.getStatus = function () {
            return new Promise(function (resolve, reject) {
                if (!window.navigator) {
                    reject('Network info not available');
                    return;
                }
                var connected = window.navigator.onLine;
                var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
                var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
                resolve({
                    connected: connected,
                    connectionType: connected ? connectionType : 'none'
                });
            });
        };
        NetworkPluginWeb.prototype.addListener = function (eventName, listenerFunc) {
            var thisRef = this;
            var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
            var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
            var onlineBindFunc = listenerFunc.bind(thisRef, { connected: true, connectionType: connectionType });
            var offlineBindFunc = listenerFunc.bind(thisRef, { connected: false, connectionType: 'none' });
            if (eventName.localeCompare('networkStatusChange') === 0) {
                window.addEventListener('online', onlineBindFunc);
                window.addEventListener('offline', offlineBindFunc);
                return {
                    remove: function () {
                        window.removeEventListener('online', onlineBindFunc);
                        window.removeEventListener('offline', offlineBindFunc);
                    }
                };
            }
        };
        return NetworkPluginWeb;
    }(WebPlugin));
    var Network = new NetworkPluginWeb();

    var PermissionsPluginWeb = /** @class */ (function (_super) {
        __extends(PermissionsPluginWeb, _super);
        function PermissionsPluginWeb() {
            return _super.call(this, {
                name: 'Permissions'
            }) || this;
        }
        PermissionsPluginWeb.prototype.query = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var navigator, name, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            navigator = window.navigator;
                            if (!navigator.permissions) {
                                return [2 /*return*/, Promise.reject('This browser does not support the Permissions API')];
                            }
                            name = options.name === PermissionType.Photos ? 'camera' : options.name;
                            return [4 /*yield*/, navigator.permissions.query({ name: name })];
                        case 1:
                            ret = _a.sent();
                            return [2 /*return*/, {
                                    state: ret.state
                                }];
                    }
                });
            });
        };
        return PermissionsPluginWeb;
    }(WebPlugin));
    var Permissions = new PermissionsPluginWeb();

    var SplashScreenPluginWeb = /** @class */ (function (_super) {
        __extends(SplashScreenPluginWeb, _super);
        function SplashScreenPluginWeb() {
            return _super.call(this, {
                name: 'SplashScreen',
                platforms: ['web']
            }) || this;
        }
        SplashScreenPluginWeb.prototype.show = function (_options, _callback) {
            return Promise.resolve();
        };
        SplashScreenPluginWeb.prototype.hide = function (_options, _callback) {
            return Promise.resolve();
        };
        return SplashScreenPluginWeb;
    }(WebPlugin));
    var SplashScreen = new SplashScreenPluginWeb();

    var StoragePluginWeb = /** @class */ (function (_super) {
        __extends(StoragePluginWeb, _super);
        function StoragePluginWeb() {
            var _this = _super.call(this, {
                name: 'Storage',
                platforms: ['web']
            }) || this;
            _this.KEY_PREFIX = '_cap_';
            return _this;
        }
        StoragePluginWeb.prototype.get = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    value: window.localStorage.getItem(_this.makeKey(options.key))
                });
            });
        };
        StoragePluginWeb.prototype.set = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.setItem(_this.makeKey(options.key), options.value);
                resolve();
            });
        };
        StoragePluginWeb.prototype.remove = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.removeItem(_this.makeKey(options.key));
                resolve();
            });
        };
        StoragePluginWeb.prototype.keys = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    keys: Object.keys(localStorage).filter(function (k) { return _this.isKey(k); }).map(function (k) { return _this.getKey(k); })
                });
            });
        };
        StoragePluginWeb.prototype.clear = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                Object.keys(localStorage)
                    .filter(function (k) { return _this.isKey(k); })
                    .forEach(function (k) { return window.localStorage.removeItem(k); });
                resolve();
            });
        };
        StoragePluginWeb.prototype.makeKey = function (key) {
            return this.KEY_PREFIX + key;
        };
        StoragePluginWeb.prototype.isKey = function (key) {
            return key.indexOf(this.KEY_PREFIX) === 0;
        };
        StoragePluginWeb.prototype.getKey = function (key) {
            return key.substr(this.KEY_PREFIX.length);
        };
        return StoragePluginWeb;
    }(WebPlugin));
    var Storage = new StoragePluginWeb();

    var ToastPluginWeb = /** @class */ (function (_super) {
        __extends(ToastPluginWeb, _super);
        function ToastPluginWeb() {
            return _super.call(this, {
                name: 'Toast',
                platforms: ['web']
            }) || this;
        }
        ToastPluginWeb.prototype.show = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var duration, toast;
                return __generator(this, function (_a) {
                    duration = 2000;
                    if (options.duration) {
                        duration = options.duration === 'long' ? 3500 : 2000;
                    }
                    toast = document.createElement('pwa-toast');
                    toast.duration = duration;
                    toast.message = options.text;
                    document.body.appendChild(toast);
                    return [2 /*return*/];
                });
            });
        };
        return ToastPluginWeb;
    }(WebPlugin));
    var Toast = new ToastPluginWeb();

    mergeWebPlugins(Plugins);
    var registerWebPlugin = function (plugin) {
        mergeWebPlugin(Plugins, plugin);
    };

    class UtilsFile {
        constructor() {
            this.pathDB = 'Databases';
            this.Path = null;
            this.NodeFs = null;
            this.Os = null;
            this.AppName = '';
            this.HomeDir = '';
            this.appPath = null;
            this.Path = require('path');
            this.NodeFs = require('fs');
            this.Os = require('os');
            this.HomeDir = this.Os.homedir();
            const app = require('electron').remote.app;
            this.appPath = app.getAppPath();
            let sep = '/';
            const idx = this.appPath.indexOf('\\');
            if (idx != -1)
                sep = '\\';
            const mypath = this.appPath.substring(0, this.appPath.indexOf('electron') - 1);
            this.AppName = mypath.substring(mypath.lastIndexOf(sep) + 1);
            this.osType = this.Os.type();
        }
        /**
         * IsPathExists
         * @param filePath
         */
        isPathExists(filePath) {
            let ret = false;
            try {
                if (this.NodeFs.existsSync(filePath)) {
                    ret = true;
                }
            }
            catch (err) {
                console.error('Error isFileExist: ' + err);
                ret = false;
            }
            return ret;
        }
        /**
         * IsFileExists
         * @param fileName
         */
        isFileExists(fileName) {
            let ret = false;
            const filePath = this.getFilePath(fileName);
            if (filePath.length > 0) {
                ret = this.isPathExists(filePath);
            }
            return ret;
        }
        /**
         * GetFilePath
         * get the file path
         * @param fileName
         */
        getFilePath(fileName) {
            return this.Path.join(this.getDatabasesPath(), fileName);
        }
        /**
         * GetDatabasesPath
         * get the database folder path
         */
        getDatabasesPath() {
            let retPath = '';
            const dbFolder = this.pathDB;
            if (this.AppName == null || this.AppName.length === 0) {
                let sep = '/';
                const idx = __dirname.indexOf('\\');
                if (idx != -1)
                    sep = '\\';
                const dir = __dirname.substring(0, __dirname.lastIndexOf(sep) + 1);
                retPath = this.Path.join(dir, dbFolder);
                const retB = this._createFolderIfNotExists(this.Path.join(dir, dbFolder));
                if (!retB)
                    retPath = '';
            }
            else {
                retPath = this.Path.join(this.HomeDir, dbFolder, this.AppName);
                let retB = this._createFolderIfNotExists(this.Path.join(this.HomeDir, dbFolder));
                if (retB) {
                    retB = this._createFolderIfNotExists(this.Path.join(this.HomeDir, dbFolder, this.AppName));
                    if (!retB)
                        retPath = '';
                }
                else {
                    retPath = '';
                }
            }
            return retPath;
        }
        /**
         * GetAssetsDatabasesPath
         * get the assets databases folder path
         */
        getAssetsDatabasesPath() {
            let retPath = '';
            let sep = '/';
            const idx = __dirname.indexOf('\\');
            if (idx != -1)
                sep = '\\';
            const dir = __dirname.substring(0, __dirname.lastIndexOf(sep) + 1);
            retPath = this.Path.join(dir, 'app', 'assets', this.pathDB.toLowerCase());
            console.log(`$$$ AssetsDatabases ${retPath}`);
            return retPath;
        }
        /**
         * SetPathSuffix
         * @param db
         */
        setPathSuffix(db) {
            let toDb = db;
            if (db.length > 9) {
                const last9 = db.slice(-9);
                if (last9 != 'SQLite.db') {
                    toDb = this.Path.parse(db).name + 'SQLite.db';
                }
            }
            else {
                toDb = toDb + 'SQLite.db';
            }
            return toDb;
        }
        /**
         * GetFileList
         * get the file list for a given folder
         * @param path
         */
        getFileList(path) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const filenames = this.NodeFs.readdirSync(path);
                let dbs = [];
                filenames.forEach((file) => {
                    if (this.Path.extname(file) == '.db')
                        dbs.push(file);
                });
                resolve(dbs);
            }));
        }
        /**
         * CopyFromAssetToDatabase
         * @param db
         * @param toDb
         */
        copyFromAssetToDatabase(db, toDb) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const pAsset = this.Path.join(this.getAssetsDatabasesPath(), db);
                const pDb = this.Path.join(this.getDatabasesPath(), toDb);
                yield this.copyFilePath(pAsset, pDb);
                resolve();
            }));
        }
        /**
         * CopyFileName
         * Copy file name
         * @param fileName
         * @param toFileName
         */
        copyFileName(fileName, toFileName) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // get File Paths
                const filePath = this.getFilePath(fileName);
                const toFilePath = this.getFilePath(toFileName);
                if (filePath.length !== 0 && toFilePath.length !== 0) {
                    try {
                        yield this.copyFilePath(filePath, toFilePath);
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`CopyFileName: ${err.message}`));
                    }
                }
                else {
                    reject(new Error('CopyFileName: cannot get the ' + 'filePath'));
                }
            }));
        }
        /**
         * CopyFilePath
         * Copy file Path
         * @param filePath
         * @param toFilePath
         */
        copyFilePath(filePath, toFilePath) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (filePath.length !== 0 && toFilePath.length !== 0) {
                    // check filePath exists
                    const isPath = this.isPathExists(filePath);
                    if (isPath) {
                        try {
                            yield this.deleteFilePath(toFilePath);
                            this.NodeFs.copyFileSync(filePath, toFilePath);
                            resolve();
                        }
                        catch (err) {
                            reject(new Error(`CopyFilePath: ${err.message}`));
                        }
                    }
                    else {
                        reject(new Error('CopyFilePath: filePath does not ' + 'exist'));
                    }
                }
                else {
                    reject(new Error('CopyFilePath: cannot get the ' + 'filePath'));
                }
            }));
        }
        /**
         * DeleteFileName
         * Delete a file by its name
         * @param fileName
         */
        deleteFileName(fileName) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // get file path
                const filePath = this.getFilePath(fileName);
                if (filePath.length !== 0) {
                    try {
                        yield this.deleteFilePath(filePath);
                        resolve();
                    }
                    catch (err) {
                        reject(new Error('DeleteFileName: delete filePath ' + `failed ${err.message}`));
                    }
                }
                else {
                    reject(new Error('DeleteFileName: get filePath ' + 'failed'));
                }
            }));
        }
        /**
         * DeleteFilePath
         * Delete a file by its path
         * @param filePath
         */
        deleteFilePath(filePath) {
            return new Promise((resolve, reject) => {
                if (filePath.length !== 0) {
                    // check if path exists
                    const isPath = this.isPathExists(filePath);
                    if (isPath) {
                        try {
                            this.NodeFs.unlinkSync(filePath);
                            resolve();
                        }
                        catch (err) {
                            reject(new Error('DeleteFilePath: ' + `${err.message}`));
                        }
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    reject(new Error('DeleteFilePath: delete filePath' + 'failed'));
                }
            });
        }
        /**
         * RenameFileName
         * @param fileName
         * @param toFileName
         */
        renameFileName(fileName, toFileName) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // get File Paths
                const filePath = this.getFilePath(fileName);
                const toFilePath = this.getFilePath(toFileName);
                if (filePath.length !== 0 && toFilePath.length !== 0) {
                    try {
                        yield this.renameFilePath(filePath, toFilePath);
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`RenameFileName: ${err.message}`));
                    }
                }
                else {
                    reject(new Error('RenameFileName: filePaths do not ' + 'exist'));
                }
            }));
        }
        /**
         * RenameFilePath
         * @param filePath
         * @param toFilePath
         */
        renameFilePath(filePath, toFilePath) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (filePath.length !== 0 && toFilePath.length !== 0) {
                    // check filePath exists
                    const isPath = this.isPathExists(filePath);
                    if (isPath) {
                        // delete toFilePath if exists
                        try {
                            yield this.deleteFilePath(toFilePath);
                            this.NodeFs.renameSync(filePath, toFilePath);
                            resolve();
                        }
                        catch (err) {
                            reject(new Error('RenameFilePath: ' + `${err.message}`));
                        }
                    }
                    else {
                        reject(new Error('RenameFilePath: filePath ' + 'does not exist'));
                    }
                }
                else {
                    reject(new Error('RenameFilePath: filePath not found'));
                }
            }));
        }
        /**
         * RestoreFileName
         * @param fileName
         * @param prefix
         */
        restoreFileName(fileName, prefix) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const mFileName = `${prefix}-${fileName}`;
                // check if file exists
                const isFilePre = this.isFileExists(mFileName);
                if (isFilePre) {
                    const isFile = this.isFileExists(fileName);
                    if (isFile) {
                        try {
                            yield this.deleteFileName(fileName);
                            yield this.renameFileName(mFileName, fileName);
                            resolve();
                        }
                        catch (err) {
                            reject(new Error('RestoreFileName: ' + `${err.message}`));
                        }
                    }
                    else {
                        reject(new Error(`RestoreFileName: ${fileName} ` + 'does not exist'));
                    }
                }
                else {
                    reject(new Error(`RestoreFileName: ${mFileName} ` + 'does not exist'));
                }
            }));
        }
        /**
         * CreateFolderIfNotExists
         * Create directory
         * @param folder
         */
        _createFolderIfNotExists(folder) {
            let ret;
            try {
                if (!this.NodeFs.existsSync(folder)) {
                    this._mkdirSyncRecursive(folder);
                }
                ret = true;
            }
            catch (e) {
                console.log('Error: in getDBPath', e);
                ret = false;
            }
            return ret;
        }
        /**
         * MkdirSyncRecursive
         * Create directories recursively
         * @param directory
         */
        _mkdirSyncRecursive(directory) {
            var path = directory.replace(/\/$/, '').split('/');
            for (var i = 1; i <= path.length; i++) {
                var segment = path.slice(0, i).join('/');
                segment.length > 0 && !this.NodeFs.existsSync(segment)
                    ? this.NodeFs.mkdirSync(segment)
                    : null;
            }
            return;
        }
    }

    class UtilsSQLite {
        constructor() {
            this.JSQlite = require('@journeyapps/sqlcipher').verbose();
        }
        /**
         * OpenOrCreateDatabase
         * @param pathDB
         * @param password
         */
        openOrCreateDatabase(pathDB, password) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let msg = 'OpenOrCreateDatabase: ';
                // open sqlite3 database
                const mDB = new this.JSQlite.Database(pathDB, {
                    verbose: console.log,
                });
                if (mDB != null) {
                    try {
                        yield this.dbChanges(mDB);
                    }
                    catch (err) {
                        reject(new Error(msg + `dbChanges ${err.message}`));
                    }
                    try {
                        // set the password
                        if (password.length > 0) {
                            yield this.setCipherPragma(mDB, password);
                        }
                        // set Foreign Keys On
                        yield this.setForeignKeyConstraintsEnabled(mDB, true);
                        // Check Version
                        let curVersion = yield this.getVersion(mDB);
                        if (curVersion === 0) {
                            yield this.setVersion(mDB, 1);
                        }
                    }
                    catch (err) {
                        reject(new Error(msg + `${err.message}`));
                    }
                    resolve(mDB);
                }
                else {
                    reject(new Error(msg + 'open database failed'));
                }
            }));
        }
        /**
         * SetCipherPragma
         * @param mDB
         * @param password
         */
        setCipherPragma(mDB, password) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                mDB.serialize(() => {
                    mDB.run('PRAGMA cipher_compatibility = 4');
                    mDB.run(`PRAGMA key = '${password}'`, (err) => {
                        if (err) {
                            reject(new Error('SetForeignKey: ' + `${err.message}`));
                        }
                        resolve();
                    });
                });
            }));
        }
        /**
         * SetForeignKeyConstraintsEnabled
         * @param mDB
         * @param toggle
         */
        setForeignKeyConstraintsEnabled(mDB, toggle) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var key = 'OFF';
                if (toggle) {
                    key = 'ON';
                }
                mDB.run(`PRAGMA foreign_keys = '${key}'`, (err) => {
                    if (err) {
                        reject(new Error(`SetForeignKey: ${err.message}`));
                    }
                    resolve();
                });
            }));
        }
        /**
         * GetVersion
         * @param mDB
         */
        getVersion(mDB) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let version = 0;
                const SELECT_VERSION = 'PRAGMA user_version;';
                mDB.get(SELECT_VERSION, [], (err, row) => {
                    // process the row here
                    if (err) {
                        reject(new Error('getVersion failed: ' + `${err.message}`));
                    }
                    else {
                        if (row == null) {
                            version = 0;
                        }
                        else {
                            const key = Object.keys(row)[0];
                            version = row[key];
                        }
                        resolve(version);
                    }
                });
            }));
        }
        /**
         * SetVersion
         * @param mDB
         * @param version
         */
        setVersion(mDB, version) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                mDB.run(`PRAGMA user_version = ${version}`, (err) => {
                    if (err) {
                        reject(new Error('setVersion failed: ' + `${err.message}`));
                    }
                    resolve();
                });
            }));
        }
        /**
         * ChangePassword
         * @param pathDB
         * @param password
         * @param newpassword
         */
        changePassword(pathDB, password, newpassword) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const mDB = yield this.openOrCreateDatabase(pathDB, password);
                    mDB.serialize(() => {
                        mDB.run('PRAGMA cipher_compatibility = 4');
                        mDB.run(`PRAGMA key = '${password}'`);
                        mDB.run(`PRAGMA rekey = '${newpassword}'`, (err) => {
                            if (err) {
                                mDB.close();
                                reject(new Error('ChangePassword: ' + `${err.message}`));
                            }
                            mDB.close();
                            resolve();
                        });
                    });
                }
                catch (err) {
                    reject(new Error(`ChangePassword: ${err.message}`));
                }
            }));
        }
        /**
         * BeginTransaction
         * @param db
         * @param isOpen
         */
        beginTransaction(db, isOpen) {
            return new Promise((resolve, reject) => {
                const msg = 'BeginTransaction: ';
                if (!isOpen) {
                    reject(new Error(`${msg}database not opened`));
                }
                const sql = 'BEGIN TRANSACTION;';
                db.run(sql, (err) => {
                    if (err) {
                        reject(new Error(`${msg}${err.message}`));
                    }
                    resolve();
                });
            });
        }
        /**
         * RollbackTransaction
         * @param db
         * @param isOpen
         */
        rollbackTransaction(db, isOpen) {
            return new Promise((resolve, reject) => {
                const msg = 'RollbackTransaction: ';
                if (!isOpen) {
                    reject(new Error(`${msg}database not opened`));
                }
                const sql = 'ROLLBACK TRANSACTION;';
                db.run(sql, (err) => {
                    if (err) {
                        reject(new Error(`${msg}${err.message}`));
                    }
                    resolve();
                });
            });
        }
        /**
         * CommitTransaction
         * @param db
         * @param isOpen
         */
        commitTransaction(db, isOpen) {
            return new Promise((resolve, reject) => {
                const msg = 'CommitTransaction: ';
                if (!isOpen) {
                    reject(new Error(`${msg}database not opened`));
                }
                const sql = 'COMMIT TRANSACTION;';
                db.run(sql, (err) => {
                    if (err) {
                        reject(new Error(`${msg}${err.message}`));
                    }
                    resolve();
                });
            });
        }
        /**
         * DbChanges
         * return total number of changes
         * @param db
         */
        dbChanges(db) {
            return new Promise((resolve, reject) => {
                const SELECT_CHANGE = 'SELECT total_changes()';
                let changes = 0;
                db.get(SELECT_CHANGE, [], (err, row) => {
                    // process the row here
                    if (err) {
                        reject(new Error(`DbChanges failed: ${err.message}`));
                    }
                    else {
                        if (row == null) {
                            changes = 0;
                        }
                        else {
                            const key = Object.keys(row)[0];
                            changes = row[key];
                        }
                        resolve(changes);
                    }
                });
            });
        }
        /**
         * GetLastId
         * @param db
         */
        getLastId(db) {
            return new Promise((resolve, reject) => {
                const SELECT_LAST_ID = 'SELECT last_insert_rowid()';
                let lastId = -1;
                db.get(SELECT_LAST_ID, [], (err, row) => {
                    // process the row here
                    if (err) {
                        let msg = 'GetLastId failed: ';
                        msg += `${err.message}`;
                        reject(new Error(msg));
                    }
                    else {
                        if (row == null)
                            resolve(lastId);
                        const key = Object.keys(row)[0];
                        lastId = row[key];
                        resolve(lastId);
                    }
                });
            });
        }
        /**
         * Execute
         * @param mDB
         * @param sql
         */
        execute(mDB, sql) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let changes = -1;
                let initChanges = -1;
                try {
                    initChanges = yield this.dbChanges(mDB);
                }
                catch (err) {
                    reject(new Error(`Execute: ${err.message}`));
                }
                mDB.exec(sql, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        const msg = err.message;
                        reject(new Error(`Execute: ${msg}: `));
                    }
                    try {
                        changes = (yield this.dbChanges(mDB)) - initChanges;
                    }
                    catch (err) {
                        reject(new Error(`ExecuteSQL: ${err.message}`));
                    }
                    resolve(changes);
                }));
            }));
        }
        /**
         * ExecuteSet
         * @param db
         * @param set
         */
        executeSet(db, set) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let lastId = -1;
                for (let i = 0; i < set.length; i++) {
                    const statement = 'statement' in set[i] ? set[i].statement : null;
                    const values = 'values' in set[i] && set[i].values.length > 0 ? set[i].values : null;
                    if (statement == null || values == null) {
                        let msg = 'ExecuteSet: Error statement';
                        msg += ` or values are null for index ${i}`;
                        reject(new Error(msg));
                        break;
                    }
                    try {
                        if (Array.isArray(values[0])) {
                            for (let j = 0; j < values.length; j++) {
                                lastId = yield this.prepareRun(db, statement, values[j]);
                            }
                        }
                        else {
                            lastId = yield this.prepareRun(db, statement, values);
                        }
                    }
                    catch (err) {
                        reject(new Error(`ExecuteSet: ${err.message}`));
                        break;
                    }
                }
                resolve(lastId);
            }));
        }
        /**
         * PrepareRun
         * @param db
         * @param statement
         * @param values
         */
        prepareRun(db, statement, values) {
            return new Promise((resolve, reject) => {
                let lastId = -1;
                db.run(statement, values, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        let msg = `PrepareRun: run `;
                        msg += `${err.message}`;
                        reject(new Error(msg));
                    }
                    else {
                        try {
                            lastId = yield this.getLastId(db);
                            resolve(lastId);
                        }
                        catch (err) {
                            let msg = `PrepareRun: lastId `;
                            msg += `${err.message}`;
                            reject(new Error(msg));
                        }
                    }
                }));
            });
        }
        /**
         * QueryAll
         * @param mDB
         * @param sql
         * @param values
         */
        queryAll(mDB, sql, values) {
            return new Promise((resolve, reject) => {
                mDB.serialize(() => {
                    mDB.all(sql, values, (err, rows) => {
                        if (err) {
                            reject(new Error(`QueryAll: ${err.message}`));
                        }
                        else {
                            if (rows == null) {
                                rows = [];
                            }
                            resolve(rows);
                        }
                    });
                });
            });
        }
    }

    class UtilsJson {
        constructor() {
            this._uSQLite = new UtilsSQLite();
        }
        /**
         * IsTableExists
         * @param db
         * @param isOpen
         * @param tableName
         */
        isTableExists(db, isOpen, tableName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    if (!isOpen) {
                        reject('isTableExists: database not opened');
                    }
                    let query = 'SELECT name FROM sqlite_master WHERE ';
                    query += `type='table' AND name='${tableName}';`;
                    db.all(query, [], (err, rows) => {
                        // process the row here
                        if (err) {
                            reject(`isTableExists: failed: ${err.message}`);
                        }
                        else {
                            if (rows.length === 0) {
                                resolve(false);
                            }
                            else {
                                resolve(true);
                            }
                        }
                    });
                });
            });
        }
        /**
         * CreateSchema
         * @param mDB
         * @param jsonData
         */
        createSchema(mDB, jsonData) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // create the database schema
                    let changes = 0;
                    try {
                        // start a transaction
                        yield this._uSQLite.beginTransaction(mDB, true);
                    }
                    catch (err) {
                        reject(new Error(`CreateDatabaseSchema: ${err.message}`));
                    }
                    const stmts = yield this.createSchemaStatement(jsonData);
                    if (stmts.length > 0) {
                        const schemaStmt = stmts.join('\n');
                        try {
                            changes = yield this._uSQLite.execute(mDB, schemaStmt);
                            if (changes < 0) {
                                try {
                                    yield this._uSQLite.rollbackTransaction(mDB, true);
                                }
                                catch (err) {
                                    reject(new Error('CreateSchema: changes < 0 ' + `${err.message}`));
                                }
                            }
                        }
                        catch (err) {
                            const msg = err.message;
                            try {
                                yield this._uSQLite.rollbackTransaction(mDB, true);
                                reject(new Error(`CreateSchema: ${msg}`));
                            }
                            catch (err) {
                                reject(new Error('CreateSchema: changes < 0 ' + `${err.message}: ${msg}`));
                            }
                        }
                    }
                    try {
                        yield this._uSQLite.commitTransaction(mDB, true);
                        resolve(changes);
                    }
                    catch (err) {
                        reject(new Error('CreateSchema: commit ' + `${err.message}`));
                    }
                }));
            });
        }
        /**
         * CreateSchemaStatement
         * @param jsonData
         */
        createSchemaStatement(jsonData) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(resolve => {
                    let statements = [];
                    // Prepare the statement to execute
                    for (let i = 0; i < jsonData.tables.length; i++) {
                        if (jsonData.tables[i].schema != null &&
                            jsonData.tables[i].schema.length >= 1) {
                            // create table
                            statements.push('CREATE TABLE IF NOT EXISTS ' + `${jsonData.tables[i].name} (`);
                            for (let j = 0; j < jsonData.tables[i].schema.length; j++) {
                                if (j === jsonData.tables[i].schema.length - 1) {
                                    if (jsonData.tables[i].schema[j].column) {
                                        statements.push(`${jsonData.tables[i].schema[j].column} ${jsonData.tables[i].schema[j].value}`);
                                    }
                                    else if (jsonData.tables[i].schema[j].foreignkey) {
                                        statements.push(`FOREIGN KEY (${jsonData.tables[i].schema[j].foreignkey}) ${jsonData.tables[i].schema[j].value}`);
                                    }
                                }
                                else {
                                    if (jsonData.tables[i].schema[j].column) {
                                        statements.push(`${jsonData.tables[i].schema[j].column} ${jsonData.tables[i].schema[j].value},`);
                                    }
                                    else if (jsonData.tables[i].schema[j].foreignkey) {
                                        statements.push(`FOREIGN KEY (${jsonData.tables[i].schema[j].foreignkey}) ${jsonData.tables[i].schema[j].value},`);
                                    }
                                }
                            }
                            statements.push(');');
                            // create trigger last_modified associated with the table
                            let trig = 'CREATE TRIGGER IF NOT EXISTS ';
                            trig += `${jsonData.tables[i].name}`;
                            trig += `_trigger_last_modified `;
                            trig += `AFTER UPDATE ON ${jsonData.tables[i].name} `;
                            trig += 'FOR EACH ROW WHEN NEW.last_modified <= ';
                            trig += 'OLD.last_modified BEGIN UPDATE ';
                            trig += `${jsonData.tables[i].name} `;
                            trig += `SET last_modified = `;
                            trig += "(strftime('%s','now')) WHERE id=OLD.id; END;";
                            statements.push(trig);
                        }
                        if (jsonData.tables[i].indexes != null &&
                            jsonData.tables[i].indexes.length >= 1) {
                            for (let j = 0; j < jsonData.tables[i].indexes.length; j++) {
                                const index = jsonData.tables[i].indexes[j];
                                const tableName = jsonData.tables[i].name;
                                let stmt = `CREATE ${Object.keys(index).includes('mode') ? index.mode + ' ' : ''}INDEX `;
                                stmt += `${index.name} ON ${tableName} (${index.value});`;
                                statements.push(stmt);
                            }
                        }
                    }
                    resolve(statements);
                });
            });
        }
        /**
         * CreateDataTable
         * @param mDB
         * @param table
         * @param mode
         */
        createDataTable(mDB, table, mode) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let lastId = -1;
                    try {
                        // Check if the table exists
                        const tableExists = yield this.isTableExists(mDB, true, table.name);
                        if (!tableExists) {
                            reject(new Error('CreateDataTable: Table ' + `${table.name} does not exist`));
                        }
                        // Get the column names and types
                        const tableNamesTypes = yield this.getTableColumnNamesTypes(mDB, table.name);
                        const tableColumnTypes = tableNamesTypes.types;
                        const tableColumnNames = tableNamesTypes.names;
                        if (tableColumnTypes.length === 0) {
                            reject(new Error('CreateDataTable: Table ' + `${table.name} info does not exist`));
                        }
                        // Loop on Table Values
                        for (let j = 0; j < table.values.length; j++) {
                            // Check the row number of columns
                            if (table.values[j].length != tableColumnTypes.length) {
                                reject(new Error(`CreateDataTable: Table ${table.name} ` +
                                    `values row ${j} not correct length`));
                            }
                            // Check the column's type before proceeding
                            const isColumnTypes = yield this.checkColumnTypes(tableColumnTypes, table.values[j]);
                            if (!isColumnTypes) {
                                reject(new Error(`CreateDataTable: Table ${table.name} ` +
                                    `values row ${j} not correct types`));
                            }
                            const retisIdExists = yield this.isIdExists(mDB, table.name, tableColumnNames[0], table.values[j][0]);
                            let stmt;
                            if (mode === 'full' || (mode === 'partial' && !retisIdExists)) {
                                // Insert
                                const nameString = tableColumnNames.join();
                                const questionMarkString = yield this.createQuestionMarkString(tableColumnNames.length);
                                stmt = `INSERT INTO ${table.name} (${nameString}) VALUES (`;
                                stmt += `${questionMarkString});`;
                            }
                            else {
                                // Update
                                const setString = yield this.setNameForUpdate(tableColumnNames);
                                if (setString.length === 0) {
                                    reject(new Error(`CreateDataTable: Table ${table.name} ` +
                                        `values row ${j} not set to String`));
                                }
                                stmt =
                                    `UPDATE ${table.name} SET ${setString} WHERE ` +
                                        `${tableColumnNames[0]} = ${table.values[j][0]};`;
                            }
                            lastId = yield this._uSQLite.prepareRun(mDB, stmt, table.values[j]);
                            if (lastId < 0) {
                                reject(new Error('CreateDataTable: lastId < 0'));
                            }
                        }
                        resolve(lastId);
                    }
                    catch (err) {
                        reject(new Error(`CreateDataTable: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * GetTableColumnNamesTypes
         * @param mDB
         * @param tableName
         */
        getTableColumnNamesTypes(mDB, tableName) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let resQuery = [];
                let retNames = [];
                let retTypes = [];
                const query = `PRAGMA table_info('${tableName}');`;
                try {
                    resQuery = yield this._uSQLite.queryAll(mDB, query, []);
                    if (resQuery.length > 0) {
                        for (let i = 0; i < resQuery.length; i++) {
                            retNames.push(resQuery[i].name);
                            retTypes.push(resQuery[i].type);
                        }
                    }
                    resolve({ names: retNames, types: retTypes });
                }
                catch (err) {
                    reject(new Error('GetTableColumnNamesTypes: ' + `${err.message}`));
                }
            }));
        }
        /**
         * CheckColumnTypes
         * @param tableTypes
         * @param rowValues
         */
        checkColumnTypes(tableTypes, rowValues) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let isType = true;
                for (let i = 0; i < rowValues.length; i++) {
                    if (rowValues[i].toString().toUpperCase() != 'NULL') {
                        try {
                            yield this.isType(tableTypes[i], rowValues[i]);
                        }
                        catch (err) {
                            reject(new Error('checkColumnTypes: Type not found'));
                        }
                    }
                }
                resolve(isType);
            }));
        }
        /**
         * IsType
         * @param type
         * @param value
         */
        isType(type, value) {
            return new Promise((resolve, reject) => {
                let ret = false;
                if (type === 'NULL' && typeof value === 'object')
                    ret = true;
                if (type === 'TEXT' && typeof value === 'string')
                    ret = true;
                if (type === 'INTEGER' && typeof value === 'number')
                    ret = true;
                if (type === 'REAL' && typeof value === 'number')
                    ret = true;
                if (type === 'BLOB' && typeof value === 'string')
                    ret = true;
                if (ret) {
                    resolve();
                }
                else {
                    reject(new Error('IsType: not a SQL Type'));
                }
            });
        }
        /**
         * IsIdExists
         * @param db
         * @param dbName
         * @param firstColumnName
         * @param key
         */
        isIdExists(db, dbName, firstColumnName, key) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let ret = false;
                const query = `SELECT ${firstColumnName} FROM ` +
                    `${dbName} WHERE ${firstColumnName} = ${key};`;
                try {
                    const resQuery = yield this._uSQLite.queryAll(db, query, []);
                    if (resQuery.length === 1)
                        ret = true;
                    resolve(ret);
                }
                catch (err) {
                    reject(new Error(`IsIdExists: ${err.message}`));
                }
            }));
        }
        /**
         * CreateQuestionMarkString
         * @param length
         */
        createQuestionMarkString(length) {
            return new Promise((resolve, reject) => {
                var retString = '';
                for (let i = 0; i < length; i++) {
                    retString += '?,';
                }
                if (retString.length > 1) {
                    retString = retString.slice(0, -1);
                    resolve(retString);
                }
                else {
                    reject(new Error('CreateQuestionMarkString: length = 0'));
                }
            });
        }
        /**
         * SetNameForUpdate
         * @param names
         */
        setNameForUpdate(names) {
            return new Promise((resolve, reject) => {
                var retString = '';
                for (let i = 0; i < names.length; i++) {
                    retString += `${names[i]} = ? ,`;
                }
                if (retString.length > 1) {
                    retString = retString.slice(0, -1);
                    resolve(retString);
                }
                else {
                    reject(new Error('SetNameForUpdate: length = 0'));
                }
            });
        }
        /**
         * IsJsonSQLite
         * @param obj
         */
        isJsonSQLite(obj) {
            const keyFirstLevel = [
                'database',
                'version',
                'encrypted',
                'mode',
                'tables',
            ];
            if (obj == null ||
                (Object.keys(obj).length === 0 && obj.constructor === Object))
                return false;
            for (var key of Object.keys(obj)) {
                if (keyFirstLevel.indexOf(key) === -1)
                    return false;
                if (key === 'database' && typeof obj[key] != 'string')
                    return false;
                if (key === 'version' && typeof obj[key] != 'number')
                    return false;
                if (key === 'encrypted' && typeof obj[key] != 'boolean')
                    return false;
                if (key === 'mode' && typeof obj[key] != 'string')
                    return false;
                if (key === 'tables' && typeof obj[key] != 'object')
                    return false;
                if (key === 'tables') {
                    for (let i = 0; i < obj[key].length; i++) {
                        const retTable = this.isTable(obj[key][i]);
                        if (!retTable)
                            return false;
                    }
                }
            }
            return true;
        }
        /**
         * IsTable
         * @param obj
         */
        isTable(obj) {
            const keyTableLevel = [
                'name',
                'schema',
                'indexes',
                'values',
            ];
            let nbColumn = 0;
            if (obj == null ||
                (Object.keys(obj).length === 0 && obj.constructor === Object))
                return false;
            for (var key of Object.keys(obj)) {
                if (keyTableLevel.indexOf(key) === -1)
                    return false;
                if (key === 'name' && typeof obj[key] != 'string')
                    return false;
                if (key === 'schema' && typeof obj[key] != 'object')
                    return false;
                if (key === 'indexes' && typeof obj[key] != 'object')
                    return false;
                if (key === 'values' && typeof obj[key] != 'object')
                    return false;
                if (key === 'schema') {
                    obj['schema'].forEach((element) => {
                        if (element.column) {
                            nbColumn++;
                        }
                    });
                    for (let i = 0; i < nbColumn; i++) {
                        const retSchema = this.isSchema(obj[key][i]);
                        if (!retSchema)
                            return false;
                    }
                }
                if (key === 'indexes') {
                    for (let i = 0; i < obj[key].length; i++) {
                        const retIndexes = this.isIndexes(obj[key][i]);
                        if (!retIndexes)
                            return false;
                    }
                }
                if (key === 'values') {
                    if (nbColumn > 0) {
                        for (let i = 0; i < obj[key].length; i++) {
                            if (typeof obj[key][i] != 'object' ||
                                obj[key][i].length != nbColumn)
                                return false;
                        }
                    }
                }
            }
            return true;
        }
        /**
         * IsSchema
         * @param obj
         */
        isSchema(obj) {
            const keySchemaLevel = ['column', 'value', 'foreignkey'];
            if (obj == null ||
                (Object.keys(obj).length === 0 && obj.constructor === Object))
                return false;
            for (var key of Object.keys(obj)) {
                if (keySchemaLevel.indexOf(key) === -1)
                    return false;
                if (key === 'column' && typeof obj[key] != 'string')
                    return false;
                if (key === 'value' && typeof obj[key] != 'string')
                    return false;
                if (key === 'foreignkey' && typeof obj[key] != 'string')
                    return false;
            }
            return true;
        }
        /**
         * isIndexes
         * @param obj
         */
        isIndexes(obj) {
            const keyIndexesLevel = ['name', 'value', 'mode'];
            if (obj == null ||
                (Object.keys(obj).length === 0 && obj.constructor === Object))
                return false;
            for (var key of Object.keys(obj)) {
                if (keyIndexesLevel.indexOf(key) === -1)
                    return false;
                if (key === 'name' && typeof obj[key] != 'string')
                    return false;
                if (key === 'value' && typeof obj[key] != 'string')
                    return false;
                if (key === 'mode' &&
                    (typeof obj[key] != 'string' || obj[key] != 'UNIQUE'))
                    return false;
            }
            return true;
        }
        /**
         * checkSchemaValidity
         * @param schema
         */
        checkSchemaValidity(schema) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < schema.length; i++) {
                        let sch = {};
                        let keys = Object.keys(schema[i]);
                        if (keys.includes('column')) {
                            sch.column = schema[i].column;
                        }
                        if (keys.includes('value')) {
                            sch.value = schema[i].value;
                        }
                        if (keys.includes('foreignkey')) {
                            sch.foreignkey = schema[i].foreignkey;
                        }
                        let isValid = this.isSchema(sch);
                        if (!isValid) {
                            reject(new Error(`CheckSchemaValidity: schema[${i}] not valid`));
                        }
                    }
                    resolve();
                }));
            });
        }
        /**
         * checkIndexesSchemaValidity
         * @param indexes
         */
        checkIndexesValidity(indexes) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < indexes.length; i++) {
                        let index = {};
                        let keys = Object.keys(indexes[i]);
                        if (keys.includes('value')) {
                            index.value = indexes[i].value;
                        }
                        if (keys.includes('name')) {
                            index.name = indexes[i].name;
                        }
                        if (keys.includes('mode')) {
                            index.mode = indexes[i].mode;
                        }
                        let isValid = this.isIndexes(index);
                        if (!isValid) {
                            reject(new Error(`CheckIndexesValidity: indexes[${i}] not valid`));
                        }
                    }
                    resolve();
                }));
            });
        }
    }

    class GlobalSQLite {
        constructor() {
            this.secret = 'sqlite secret';
            this.newsecret = 'sqlite new secret';
        }
    }

    //1234567890123456789012345678901234567890123456789012345678901234567890
    class UtilsEncryption {
        constructor() {
            this._uFile = new UtilsFile();
            this._uSQLite = new UtilsSQLite();
        }
        /**
         * EncryptDatabase
         * @param pathDB
         * @param password
         */
        encryptDatabase(pathDB, password) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const msg = 'EncryptDatabase: ';
                let retB = this._uFile.isPathExists(pathDB);
                if (retB) {
                    let tempPath = this._uFile.getFilePath('temp.db');
                    try {
                        yield this._uFile.renameFilePath(pathDB, tempPath);
                        const oDB = yield this._uSQLite.openOrCreateDatabase(tempPath, '');
                        const mDB = yield this._uSQLite.openOrCreateDatabase(pathDB, password);
                        yield this.sqlcipherEncrypt(oDB, pathDB, password);
                        oDB.close();
                        this._uFile.deleteFilePath(tempPath);
                        mDB.close();
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`${msg} ${err.message} `));
                    }
                }
                else {
                    reject(new Error(`${msg}file path ${pathDB} ` + 'does not exist'));
                }
            }));
        }
        /**
         * SqlcipherEncrypt
         * @param oDB
         * @param pathDB
         * @param password
         */
        sqlcipherEncrypt(oDB, pathDB, password) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                oDB.serialize(() => {
                    let stmt = `ATTACH DATABASE '${pathDB}' `;
                    stmt += `AS encrypted KEY '${password}';`;
                    oDB.run(stmt);
                    oDB.run("SELECT sqlcipher_export('encrypted');");
                    oDB.run('DETACH DATABASE encrypted;');
                });
                resolve();
            }));
        }
    }

    class UtilsDrop {
        constructor() {
            this._uSQLite = new UtilsSQLite();
        }
        /**
         * GetTablesNames
         * @param mDb
         */
        getTablesNames(mDb) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let sql = 'SELECT name FROM sqlite_master WHERE ';
                    sql += "type='table' AND name NOT LIKE 'sync_table' ";
                    sql += "AND name NOT LIKE '_temp_%' ";
                    sql += "AND name NOT LIKE 'sqlite_%';";
                    let retArr = [];
                    try {
                        const retQuery = yield this._uSQLite.queryAll(mDb, sql, []);
                        for (let i = 0; i < retQuery.length; i++) {
                            retArr.push(retQuery[i].name);
                        }
                        resolve(retArr);
                    }
                    catch (err) {
                        reject(new Error(`getTablesNames: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * DropElements
         * @param db
         * @param type ["table","index","trigger"]
         */
        dropElements(db, type) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let msg = '';
                    switch (type) {
                        case 'index':
                            msg = 'DropIndexes';
                            break;
                        case 'trigger':
                            msg = 'DropTriggers';
                            break;
                        case 'table':
                            msg = 'DropTables';
                            break;
                        default:
                            reject(new Error(`DropElements: ${type} ` + 'not found'));
                            break;
                    }
                    // get the element's names
                    let stmt = 'SELECT name FROM sqlite_master WHERE ';
                    stmt += `type = '${type}' AND name NOT LIKE 'sqlite_%';`;
                    try {
                        let elements = yield this._uSQLite.queryAll(db, stmt, []);
                        if (elements.length > 0) {
                            let upType = type.toUpperCase();
                            let statements = [];
                            for (let i = 0; i < elements.length; i++) {
                                let stmt = `DROP ${upType} IF EXISTS `;
                                stmt += `${elements[i].name};`;
                                statements.push(stmt);
                            }
                            for (let i = 0; i < statements.length; i++) {
                                const lastId = yield this._uSQLite.prepareRun(db, statements[i], []);
                                if (lastId < 0) {
                                    reject(new Error(`${msg}: lastId < 0`));
                                }
                            }
                        }
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`${msg}: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * DropAll
         * Drop all database's elements
         * @param db
         */
        dropAll(db) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // drop tables
                        yield this.dropElements(db, 'table');
                        // drop indexes
                        yield this.dropElements(db, 'index');
                        // drop triggers
                        yield this.dropElements(db, 'trigger');
                        // vacuum the database
                        yield this._uSQLite.prepareRun(db, 'VACUUM;', []);
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`DropAll: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * DropTempTables
         * @param db
         * @param alterTables
         */
        dropTempTables(db, alterTables) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const tempTables = Object.keys(alterTables);
                    const statements = [];
                    for (let i = 0; i < tempTables.length; i++) {
                        let stmt = 'DROP TABLE IF EXISTS ';
                        stmt += `_temp_${tempTables[i]};`;
                        statements.push(stmt);
                    }
                    try {
                        const changes = yield this._uSQLite.execute(db, statements.join('\n'));
                        if (changes < 0) {
                            reject(new Error('DropTempTables: changes < 0'));
                        }
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`DropTempTables: ${err.message}`));
                    }
                }));
            });
        }
    }

    //1234567890123456789012345678901234567890123456789012345678901234567890
    class UtilsUpgrade {
        constructor() {
            this._uSQLite = new UtilsSQLite();
            this._uFile = new UtilsFile();
            this._uDrop = new UtilsDrop();
            this._uJson = new UtilsJson();
            this._alterTables = {};
            this._commonColumns = {};
        }
        /**
         * OnUpgrade
         * @param mDB
         * @param vUpgDict
         * @param dbName
         * @param curVersion
         * @param targetVersion
         */
        onUpgrade(mDB, vUpgDict, dbName, curVersion, targetVersion) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const upgrade = vUpgDict[curVersion];
                if (upgrade != null) {
                    const keys = Object.keys(upgrade);
                    if (!keys.includes('toVersion')) {
                        reject(new Error('onUpgrade: toVersion not given'));
                    }
                    const toVersion = upgrade.toVersion;
                    if (!keys.includes('statement')) {
                        reject(new Error('onUpgrade: statement not given'));
                    }
                    const statement = upgrade.statement;
                    let set = [];
                    if (keys.includes('set')) {
                        set = upgrade.set;
                    }
                    if (targetVersion < toVersion) {
                        let msg = 'Error: version mistmatch ';
                        msg += 'Upgrade Statement would upgrade to ';
                        msg += `version ${toVersion} , but target version `;
                        msg += `is ${targetVersion} for database ${dbName}`;
                        msg += ` and version ${curVersion}`;
                        reject(new Error(`onUpgrade: ${msg}`));
                    }
                    try {
                        // set Foreign Keys Off
                        yield this._uSQLite.setForeignKeyConstraintsEnabled(mDB, false);
                        yield this._uFile.copyFileName(dbName, `backup-${dbName}`);
                        const initChanges = yield this._uSQLite.dbChanges(mDB);
                        // Here we assume that all table schemas are given
                        // in the upgrade statement
                        if (statement.length > 0) {
                            yield this.executeStatementProcess(mDB, statement);
                            // Here we assume that the Set contains only
                            // - the data for new tables
                            //   as INSERT statements
                            // - the data for new columns in existing tables
                            //   as UPDATE statements
                            if (set.length > 0) {
                                yield this.executeSetProcess(mDB, set, toVersion);
                            }
                        }
                        // set Foreign Keys On
                        yield this._uSQLite.setForeignKeyConstraintsEnabled(mDB, true);
                        const changes = (yield this._uSQLite.dbChanges(mDB)) - initChanges;
                        resolve(changes);
                    }
                    catch (err) {
                        reject(new Error(`onUpgrade: ${err.message}`));
                    }
                }
                else {
                    reject(new Error('onUpgrade: upgrade not found'));
                }
            }));
        }
        /**
         * ExecuteStatementProcess
         * @param mDB
         * @param statement
         */
        executeStatementProcess(mDB, statement) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // -> backup all existing tables  "tableName" in
                    //    "temp_tableName"
                    yield this.backupTables(mDB);
                    // -> Drop all Indexes
                    yield this._uDrop.dropElements(mDB, 'index');
                    // -> Drop all Triggers
                    yield this._uDrop.dropElements(mDB, 'trigger');
                    // -> Create new tables from upgrade.statement
                    const changes = yield this._uSQLite.execute(mDB, statement);
                    if (changes < 0) {
                        reject(new Error('ExecuteStatementProcess: ' + 'changes < 0'));
                    }
                    // -> Create the list of table's common fields
                    yield this.findCommonColumns(mDB);
                    // -> Update the new table's data from old table's data
                    if (Object.keys(this._commonColumns).length > 0) {
                        yield this.updateNewTablesData(mDB);
                    }
                    // -> Drop _temp_tables
                    yield this._uDrop.dropTempTables(mDB, this._alterTables);
                    // -> Do some cleanup
                    this._alterTables = {};
                    this._commonColumns = {};
                    resolve();
                }
                catch (err) {
                    reject(new Error(`ExecuteStatementProcess: ${err.message}`));
                }
            }));
        }
        /**
         * ExecuteSetProcess
         * @param mDB
         * @param set
         * @param toVersion
         */
        executeSetProcess(mDB, set, toVersion) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // -> load new data
                    const lastId = yield this._uSQLite.executeSet(mDB, set);
                    if (lastId < 0) {
                        reject(new Error('ExecuteSetProcess: lastId ' + '< 0'));
                    }
                    // -> update database version
                    yield this._uSQLite.setVersion(mDB, toVersion);
                    // -> update syncDate if any
                    const retB = yield this._uJson.isTableExists(mDB, true, 'sync_table');
                    if (retB) {
                        const sDate = Math.round(new Date().getTime() / 1000);
                        let stmt = 'UPDATE sync_table SET ';
                        stmt += `sync_date = ${sDate} WHERE id = 1;`;
                        const changes = yield this._uSQLite.execute(mDB, stmt);
                        if (changes < 0) {
                            reject(new Error('ExecuteSetProcess: changes ' + '< 0'));
                        }
                    }
                    resolve();
                }
                catch (err) {
                    reject(new Error(`ExecuteSetProcess: ${err.message}`));
                }
            }));
        }
        /**
         * BackupTables
         * @param mDB
         */
        backupTables(mDB) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const msg = 'BackupTables: ';
                try {
                    const tables = yield this._uDrop.getTablesNames(mDB);
                    for (let i = 0; i < tables.length; i++) {
                        try {
                            yield this.backupTable(mDB, tables[i]);
                        }
                        catch (err) {
                            reject(new Error(`${msg}table ${tables[i]}: ` + `${err.message}`));
                        }
                    }
                    resolve();
                }
                catch (err) {
                    reject(new Error(`BackupTables: ${err.message}`));
                }
            }));
        }
        /**
         * BackupTable
         * @param mDB
         * @param table
         */
        backupTable(mDB, table) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // start a transaction
                    yield this._uSQLite.beginTransaction(mDB, true);
                    // get the table's column names
                    const colNames = yield this.getTableColumnNames(mDB, table);
                    this._alterTables[`${table}`] = colNames;
                    // prefix the table with _temp_
                    let stmt = `ALTER TABLE ${table} RENAME `;
                    stmt += `TO _temp_${table};`;
                    const lastId = yield this._uSQLite.prepareRun(mDB, stmt, []);
                    if (lastId < 0) {
                        let msg = 'BackupTable: lastId < 0';
                        try {
                            yield this._uSQLite.rollbackTransaction(mDB, true);
                        }
                        catch (err) {
                            msg += `: ${err.message}`;
                        }
                        reject(new Error(`${msg}`));
                    }
                    else {
                        try {
                            yield this._uSQLite.commitTransaction(mDB, true);
                        }
                        catch (err) {
                            reject(new Error('BackupTable: ' + `${err.message}`));
                        }
                    }
                    resolve();
                }
                catch (err) {
                    reject(new Error(`BackupTable: ${err.message}`));
                }
            }));
        }
        /**
         * GetTableColumnNames
         * @param mDB
         * @param tableName
         */
        getTableColumnNames(mDB, tableName) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let resQuery = [];
                let retNames = [];
                const query = `PRAGMA table_info('${tableName}');`;
                try {
                    resQuery = yield this._uSQLite.queryAll(mDB, query, []);
                    if (resQuery.length > 0) {
                        for (let i = 0; i < resQuery.length; i++) {
                            retNames.push(resQuery[i].name);
                        }
                    }
                    resolve(retNames);
                }
                catch (err) {
                    reject(new Error('GetTableColumnNames: ' + `${err.message}`));
                }
            }));
        }
        /**
         * FindCommonColumns
         * @param mDB
         */
        findCommonColumns(mDB) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Get new table list
                        const tables = yield this._uDrop.getTablesNames(mDB);
                        if (tables.length === 0) {
                            reject(new Error('FindCommonColumns: get ' + "table's names failed"));
                        }
                        for (let i = 0; i < tables.length; i++) {
                            // get the column's name
                            const tableNames = yield this.getTableColumnNames(mDB, tables[i]);
                            // find the common columns
                            const keys = Object.keys(this._alterTables);
                            if (keys.includes(tables[i])) {
                                this._commonColumns[tables[i]] = this.arraysIntersection(this._alterTables[tables[i]], tableNames);
                            }
                        }
                        resolve();
                    }
                    catch (err) {
                        reject(new Error(`FindCommonColumns: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * ArraysIntersection
         * @param a1
         * @param a2
         */
        arraysIntersection(a1, a2) {
            if (a1 != null && a2 != null) {
                const first = new Set(a1);
                const second = new Set(a2);
                return [...first].filter(item => second.has(item));
            }
            else {
                return [];
            }
        }
        /**
         * UpdateNewTablesData
         * @param mDB
         */
        updateNewTablesData(mDB) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // start a transaction
                    yield this._uSQLite.beginTransaction(mDB, true);
                    let statements = [];
                    const keys = Object.keys(this._commonColumns);
                    keys.forEach(key => {
                        const columns = this._commonColumns[key].join(',');
                        let stmt = `INSERT INTO ${key} `;
                        stmt += `(${columns}) `;
                        stmt += `SELECT ${columns} FROM _temp_${key};`;
                        statements.push(stmt);
                    });
                    const changes = yield this._uSQLite.execute(mDB, statements.join('\n'));
                    if (changes < 0) {
                        let msg = 'updateNewTablesData: ' + 'changes < 0';
                        try {
                            yield this._uSQLite.rollbackTransaction(mDB, true);
                        }
                        catch (err) {
                            msg += `: ${err.message}`;
                        }
                        reject(new Error(`${msg}`));
                    }
                    else {
                        try {
                            yield this._uSQLite.commitTransaction(mDB, true);
                            resolve();
                        }
                        catch (err) {
                            reject(new Error('updateNewTablesData: ' + `${err.message}`));
                        }
                    }
                }
                catch (err) {
                    reject(new Error('updateNewTablesData: ' + `${err.message}`));
                }
            }));
        }
    }

    class ImportFromJson {
        constructor() {
            this._uJson = new UtilsJson();
            this._uSQLite = new UtilsSQLite();
            this._uDrop = new UtilsDrop();
        }
        /**
         * CreateDatabaseSchema
         * @param mDB
         * @param jsonData
         */
        createDatabaseSchema(mDB, jsonData) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let changes = -1;
                const version = jsonData.version;
                try {
                    // set Foreign Keys On
                    yield this._uSQLite.setForeignKeyConstraintsEnabled(mDB, true);
                    // set User Version PRAGMA
                    yield this._uSQLite.setVersion(mDB, version);
                    // DROP ALL when mode="full"
                    if (jsonData.mode === 'full') {
                        yield this._uDrop.dropAll(mDB);
                    }
                    // create database schema
                    changes = yield this._uJson.createSchema(mDB, jsonData);
                    resolve(changes);
                }
                catch (err) {
                    reject(new Error('CreateDatabaseSchema: ' + `${err.message}`));
                }
            }));
        }
        createTablesData(mDB, jsonData) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let changes = 0;
                let isValue = false;
                let lastId = -1;
                let msg = '';
                let initChanges = -1;
                try {
                    initChanges = yield this._uSQLite.dbChanges(mDB);
                    // start a transaction
                    yield this._uSQLite.beginTransaction(mDB, true);
                }
                catch (err) {
                    reject(new Error(`createTablesData: ${err.message}`));
                }
                for (let i = 0; i < jsonData.tables.length; i++) {
                    if (jsonData.tables[i].values != null &&
                        jsonData.tables[i].values.length >= 1) {
                        // Create the table's data
                        try {
                            lastId = yield this._uJson.createDataTable(mDB, jsonData.tables[i], jsonData.mode);
                            if (lastId < 0)
                                break;
                            isValue = true;
                        }
                        catch (err) {
                            msg = err.message;
                            isValue = false;
                            break;
                        }
                    }
                }
                if (isValue) {
                    try {
                        yield this._uSQLite.commitTransaction(mDB, true);
                        changes = (yield this._uSQLite.dbChanges(mDB)) - initChanges;
                        resolve(changes);
                    }
                    catch (err) {
                        reject(new Error('createTablesData: ' + `${err.message}`));
                    }
                }
                else {
                    try {
                        yield this._uSQLite.rollbackTransaction(mDB, true);
                        reject(new Error(`createTablesData: ${msg}`));
                    }
                    catch (err) {
                        reject(new Error('createTablesData: ' + `${err.message}: ${msg}`));
                    }
                }
            }));
        }
    }

    class ExportToJson {
        constructor() {
            this._uSQLite = new UtilsSQLite();
            this._uJson = new UtilsJson();
        }
        /**
         * CreateExportObject
         * @param mDB
         * @param sqlObj
         */
        createExportObject(mDB, sqlObj) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let retObj = {};
                let tables = [];
                try {
                    // get Table's name
                    let resTables = yield this.getTablesNameSQL(mDB);
                    if (resTables.length === 0) {
                        reject(new Error("createExportObject: table's names failed"));
                    }
                    else {
                        switch (sqlObj.mode) {
                            case 'partial': {
                                tables = yield this.getTablesPartial(mDB, resTables);
                                break;
                            }
                            case 'full': {
                                tables = yield this.getTablesFull(mDB, resTables);
                                break;
                            }
                            default: {
                                reject(new Error('createExportObject: expMode ' + sqlObj.mode + ' not defined'));
                                break;
                            }
                        }
                        if (tables.length > 0) {
                            retObj.database = sqlObj.database;
                            retObj.version = sqlObj.version;
                            retObj.encrypted = sqlObj.encrypted;
                            retObj.mode = sqlObj.mode;
                            retObj.tables = tables;
                        }
                    }
                }
                catch (err) {
                    reject(new Error('createExportObject: ' + err.message));
                }
                finally {
                    resolve(retObj);
                }
            }));
        }
        /**
         * GetTablesNameSQL
         * @param mDb
         */
        getTablesNameSQL(mDb) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let sql = 'SELECT name,sql FROM sqlite_master WHERE ';
                    sql += "type='table' AND name NOT LIKE 'sync_table' ";
                    sql += "AND name NOT LIKE '_temp_%' ";
                    sql += "AND name NOT LIKE 'sqlite_%';";
                    let retQuery = [];
                    try {
                        retQuery = yield this._uSQLite.queryAll(mDb, sql, []);
                    }
                    catch (err) {
                        reject(new Error(`getTablesNames: ${err.message}`));
                    }
                    finally {
                        resolve(retQuery);
                    }
                }));
            });
        }
        /**
         * GetSyncDate
         * @param mDb
         */
        getSyncDate(mDb) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    let retDate = -1;
                    // get the last sync date
                    let stmt = `SELECT sync_date FROM sync_table;`;
                    mDb.get(stmt, [], (err, row) => {
                        // process the row here
                        if (err) {
                            reject(new Error(`GetSyncDate: ${err.message}`));
                        }
                        else {
                            if (row != null) {
                                const key = Object.keys(row)[0];
                                retDate = row[key];
                                resolve(retDate);
                            }
                            else {
                                reject(new Error(`GetSyncDate: no syncDate`));
                            }
                        }
                    });
                });
            });
        }
        /**
         * GetTablesFull
         * @param mDb
         * @param resTables
         */
        getTablesFull(mDb, resTables) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let tables = [];
                    try {
                        // Loop through the tables
                        for (let i = 0; i < resTables.length; i++) {
                            let tableName;
                            let sqlStmt;
                            if (resTables[i].name) {
                                tableName = resTables[i].name;
                            }
                            else {
                                reject(new Error('GetTablesFull: no name'));
                                break;
                            }
                            if (resTables[i].sql) {
                                sqlStmt = resTables[i].sql;
                            }
                            else {
                                reject(new Error('GetTablesFull: no sql'));
                                break;
                            }
                            let table = {};
                            // create Table's Schema
                            const schema = yield this.getSchema(sqlStmt, tableName);
                            if (schema.length === 0) {
                                reject(new Error('GetTablesFull: no Schema returned'));
                                break;
                            }
                            // check schema validity
                            yield this._uJson.checkSchemaValidity(schema);
                            // create Table's indexes if any
                            const indexes = yield this.getIndexes(mDb, tableName);
                            if (indexes.length > 0) {
                                // check indexes validity
                                yield this._uJson.checkIndexesValidity(indexes);
                            }
                            // create Table's Data
                            const query = `SELECT * FROM ${tableName};`;
                            const values = yield this.getValues(mDb, query, tableName);
                            table.name = tableName;
                            if (schema.length > 0) {
                                table.schema = schema;
                            }
                            else {
                                reject(new Error(`GetTablesFull: must contain schema`));
                                break;
                            }
                            if (indexes.length > 0) {
                                table.indexes = indexes;
                            }
                            if (values.length > 0) {
                                table.values = values;
                            }
                            if (Object.keys(table).length <= 1) {
                                reject(new Error(`GetTablesFull: table ${tableName} is not a jsonTable`));
                            }
                            tables.push(table);
                        }
                    }
                    catch (err) {
                        reject(new Error(`GetTablesFull: ${err.message}`));
                    }
                    finally {
                        resolve(tables);
                    }
                }));
            });
        }
        /**
         * GetSchema
         * @param mDb
         * @param sqlStmt
         * @param tableName
         */
        getSchema(sqlStmt, tableName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let schema = [];
                    // take the substring between parenthesis
                    let openPar = sqlStmt.indexOf('(');
                    let closePar = sqlStmt.lastIndexOf(')');
                    let sstr = sqlStmt.substring(openPar + 1, closePar);
                    let isStrfTime = false;
                    if (sstr.includes('strftime'))
                        isStrfTime = true;
                    let sch = sstr.replace(/\n/g, '').split(',');
                    if (isStrfTime) {
                        let nSch = [];
                        for (let j = 0; j < sch.length; j++) {
                            if (sch[j].includes('strftime')) {
                                nSch.push(sch[j] + ',' + sch[j + 1]);
                                j++;
                            }
                            else {
                                nSch.push(sch[j]);
                            }
                        }
                        sch = [...nSch];
                    }
                    for (let j = 0; j < sch.length; j++) {
                        const rstr = sch[j].trim();
                        let idx = rstr.indexOf(' ');
                        //find the index of the first
                        let row = [rstr.slice(0, idx), rstr.slice(idx + 1)];
                        if (row.length != 2) {
                            reject(new Error(`GetSchema: table ${tableName} row length != 2`));
                            break;
                        }
                        if (row[0].toUpperCase() != 'FOREIGN') {
                            schema.push({ column: row[0], value: row[1] });
                        }
                        else {
                            const oPar = rstr.indexOf('(');
                            const cPar = rstr.indexOf(')');
                            row = [rstr.slice(oPar + 1, cPar), rstr.slice(cPar + 2)];
                            if (row.length != 2) {
                                reject(new Error(`GetSchema: table ${tableName} row length != 2`));
                                break;
                            }
                            schema.push({ foreignkey: row[0], value: row[1] });
                        }
                    }
                    resolve(schema);
                }));
            });
        }
        /**
         * GetIndexes
         * @param mDb
         * @param sqlStmt
         * @param tableName
         */
        getIndexes(mDb, tableName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let indexes = [];
                    try {
                        let stmt = 'SELECT name,tbl_name,sql FROM sqlite_master WHERE ';
                        stmt += `type = 'index' AND tbl_name = '${tableName}' `;
                        stmt += `AND sql NOTNULL;`;
                        const retIndexes = yield this._uSQLite.queryAll(mDb, stmt, []);
                        if (retIndexes.length > 0) {
                            for (let j = 0; j < retIndexes.length; j++) {
                                const keys = Object.keys(retIndexes[j]);
                                if (keys.length === 3) {
                                    if (retIndexes[j]['tbl_name'] === tableName) {
                                        const sql = retIndexes[j]['sql'];
                                        const mode = sql.includes('UNIQUE') ? 'UNIQUE' : '';
                                        const oPar = sql.lastIndexOf('(');
                                        const cPar = sql.lastIndexOf(')');
                                        let index = {};
                                        index.name = retIndexes[j]['name'];
                                        index.value = sql.slice(oPar + 1, cPar);
                                        if (mode.length > 0)
                                            index.mode = mode;
                                        indexes.push(index);
                                    }
                                    else {
                                        reject(new Error(`GetIndexes: Table ${tableName} doesn't match`));
                                        break;
                                    }
                                }
                                else {
                                    reject(new Error(`GetIndexes: Table ${tableName} creating indexes`));
                                    break;
                                }
                            }
                        }
                    }
                    catch (err) {
                        reject(new Error(`GetIndexes: ${err.message}`));
                    }
                    finally {
                        resolve(indexes);
                    }
                }));
            });
        }
        /**
         * GetValues
         * @param mDb
         * @param query
         * @param tableName
         */
        getValues(mDb, query, tableName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let values = [];
                    try {
                        // get table column names and types
                        const tableNamesTypes = yield this._uJson.getTableColumnNamesTypes(mDb, tableName);
                        let rowNames = [];
                        if (Object.keys(tableNamesTypes).includes('names')) {
                            rowNames = tableNamesTypes.names;
                        }
                        else {
                            reject(new Error(`GetValues: Table ${tableName} no names`));
                        }
                        const retValues = yield this._uSQLite.queryAll(mDb, query, []);
                        for (let j = 0; j < retValues.length; j++) {
                            let row = [];
                            for (let k = 0; k < rowNames.length; k++) {
                                const nName = rowNames[k];
                                if (Object.keys(retValues[j]).includes(nName)) {
                                    row.push(retValues[j][nName]);
                                }
                                else {
                                    row.push('NULL');
                                }
                            }
                            values.push(row);
                        }
                    }
                    catch (err) {
                        reject(new Error(`GetValues: ${err.message}`));
                    }
                    finally {
                        resolve(values);
                    }
                }));
            });
        }
        /**
         * GetTablesPartial
         * @param mDb
         * @param resTables
         */
        getTablesPartial(mDb, resTables) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let tables = [];
                    let modTables = {};
                    let syncDate = 0;
                    let modTablesKeys = [];
                    try {
                        // Get the syncDate and the Modified Tables
                        const partialModeData = yield this.getPartialModeData(mDb, resTables);
                        if (Object.keys(partialModeData).includes('syncDate')) {
                            syncDate = partialModeData.syncDate;
                        }
                        if (Object.keys(partialModeData).includes('modTables')) {
                            modTables = partialModeData.modTables;
                            modTablesKeys = Object.keys(modTables);
                        }
                        // Loop trough tables
                        for (let i = 0; i < resTables.length; i++) {
                            let tableName = '';
                            let sqlStmt = '';
                            if (resTables[i].name) {
                                tableName = resTables[i].name;
                            }
                            else {
                                reject(new Error('GetTablesFull: no name'));
                                break;
                            }
                            if (resTables[i].sql) {
                                sqlStmt = resTables[i].sql;
                            }
                            else {
                                reject(new Error('GetTablesFull: no sql'));
                                break;
                            }
                            if (modTablesKeys.length == 0 ||
                                modTablesKeys.indexOf(tableName) === -1 ||
                                modTables[tableName] == 'No') {
                                continue;
                            }
                            let table = {};
                            let schema = [];
                            let indexes = [];
                            table.name = resTables[i];
                            if (modTables[table.name] === 'Create') {
                                // create Table's Schema
                                schema = yield this.getSchema(sqlStmt, tableName);
                                if (schema.length > 0) {
                                    // check schema validity
                                    yield this._uJson.checkSchemaValidity(schema);
                                }
                                // create Table's indexes if any
                                indexes = yield this.getIndexes(mDb, tableName);
                                if (indexes.length > 0) {
                                    // check indexes validity
                                    yield this._uJson.checkIndexesValidity(indexes);
                                }
                            }
                            // create Table's Data
                            let query = '';
                            if (modTables[tableName] === 'Create') {
                                query = `SELECT * FROM ${tableName};`;
                            }
                            else {
                                query =
                                    `SELECT * FROM ${tableName} ` +
                                        `WHERE last_modified > ${syncDate};`;
                            }
                            const values = yield this.getValues(mDb, query, tableName);
                            // check the table object validity
                            table.name = tableName;
                            if (schema.length > 0) {
                                table.schema = schema;
                            }
                            if (indexes.length > 0) {
                                table.indexes = indexes;
                            }
                            if (values.length > 0) {
                                table.values = values;
                            }
                            if (Object.keys(table).length <= 1) {
                                reject(new Error(`GetTablesPartial: table ${tableName} is not a jsonTable`));
                            }
                            tables.push(table);
                        }
                    }
                    catch (err) {
                        reject(new Error(`GetTablesPartial: ${err.message}`));
                    }
                    finally {
                        resolve(tables);
                    }
                }));
            });
        }
        /**
         * GetPartialModeData
         * @param mDb
         * @param resTables
         */
        getPartialModeData(mDb, resTables) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let retData = {};
                    try {
                        // get the synchronization date
                        const syncDate = yield this.getSyncDate(mDb);
                        if (syncDate <= 0) {
                            reject(new Error(`GetPartialModeData: no syncDate`));
                        }
                        // get the tables which have been updated
                        // since last synchronization
                        const modTables = yield this.getTablesModified(mDb, resTables, syncDate);
                        if (modTables.length <= 0) {
                            reject(new Error(`GetPartialModeData: no modTables`));
                        }
                        retData.syncDate = syncDate;
                        retData.modTables = modTables;
                    }
                    catch (err) {
                        reject(new Error(`GetPartialModeData: ${err.message}`));
                    }
                    finally {
                        resolve(retData);
                    }
                }));
            });
        }
        getTablesModified(db, tables, syncDate) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let retModified = {};
                        for (let i = 0; i < tables.length; i++) {
                            let mode;
                            // get total count of the table
                            let stmt = 'SELECT count(*) AS tcount  ';
                            stmt += `FROM ${tables[i].name};`;
                            let retQuery = yield this._uSQLite.queryAll(db, stmt, []);
                            if (retQuery.length != 1) {
                                reject(new Error('GetTableModified: total ' + 'count not returned'));
                            }
                            const totalCount = retQuery[0]['tcount'];
                            // get total count of modified since last sync
                            stmt = 'SELECT count(*) AS mcount FROM ';
                            stmt += `${tables[i].name} WHERE last_modified > `;
                            stmt += `${syncDate};`;
                            retQuery = yield this._uSQLite.queryAll(db, stmt, []);
                            if (retQuery.length != 1)
                                break;
                            const totalModifiedCount = retQuery[0]['mcount'];
                            if (totalModifiedCount === 0) {
                                mode = 'No';
                            }
                            else if (totalCount === totalModifiedCount) {
                                mode = 'Create';
                            }
                            else {
                                mode = 'Modified';
                            }
                            const key = tables[i].name;
                            retModified[key] = mode;
                            if (i === tables.length - 1)
                                resolve(retModified);
                        }
                    }
                    catch (err) {
                        reject(new Error(`GetTableModified: ${err.message}`));
                    }
                }));
            });
        }
    }

    //1234567890123456789012345678901234567890123456789012345678901234567890
    class Database {
        constructor(dbName, encrypted, mode, version, upgDict) {
            this._uFile = new UtilsFile();
            this._uSQLite = new UtilsSQLite();
            this._uJson = new UtilsJson();
            this._uGlobal = new GlobalSQLite();
            this._uEncrypt = new UtilsEncryption();
            this._uUpg = new UtilsUpgrade();
            this._iFJson = new ImportFromJson();
            this._eTJson = new ExportToJson();
            this._vUpgDict = {};
            this._dbName = dbName;
            this._encrypted = encrypted;
            this._mode = mode;
            this._version = version;
            this._vUpgDict = upgDict;
            this._pathDB = this._uFile.getFilePath(dbName);
            this._isDBOpen = false;
            if (this._pathDB.length === 0)
                throw new Error('Could not generate a path to ' + dbName);
            console.log('DB Path: ' + this._pathDB);
        }
        /**
         * IsDBOpen
         * return the database status
         * @param options: capSQLiteOptions
         * @returns boolean
         * @since 0.0.1
         */
        isDBOpen() {
            return this._isDBOpen;
        }
        /**
         * Open
         * open the @journeyapps/sqlcipher sqlite3 database
         * @returns Promise<boolean>
         */
        open() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    this._isDBOpen = false;
                    let password = '';
                    try {
                        if (this._encrypted &&
                            (this._mode === 'secret' || this._mode === 'encryption')) {
                            password = this._uGlobal.secret;
                        }
                        if (this._mode === 'newsecret') {
                            // change the password
                            const oPassword = this._uGlobal.secret;
                            const nPassword = this._uGlobal.newsecret;
                            yield this._uSQLite.changePassword(this._pathDB, oPassword, nPassword);
                            password = nPassword;
                        }
                        if (this._mode === 'encryption') {
                            yield this._uEncrypt.encryptDatabase(this._pathDB, password);
                        }
                        this._mDB = yield this._uSQLite.openOrCreateDatabase(this._pathDB, password);
                        let curVersion = yield this._uSQLite.getVersion(this._mDB);
                        this._isDBOpen = true;
                        if (this._version > curVersion) {
                            try {
                                // execute the upgrade flow process
                                yield this._uUpg.onUpgrade(this._mDB, this._vUpgDict, this._dbName, curVersion, this._version);
                                // delete the backup database
                                yield this._uFile.deleteFileName(`backup-${this._dbName}`);
                            }
                            catch (err) {
                                // restore the database from backup
                                try {
                                    yield this._uFile.restoreFileName(this._dbName, 'backup');
                                }
                                catch (err) {
                                    reject(new Error(`Open: ${err.message}`));
                                }
                            }
                        }
                        resolve();
                    }
                    catch (err) {
                        if (this._isDBOpen)
                            this.close();
                        reject(new Error(`Open: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * Close
         * close the @journeyapps/sqlcipher sqlite3 database
         * @returns Promise<boolean>
         */
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (this._mDB != null && this._isDBOpen) {
                        this._mDB.close((err) => {
                            if (err) {
                                let msg = 'Close: Failed in closing: ';
                                msg += `${this._dbName}  ${err.message}`;
                                reject(new Error(msg));
                            }
                            this._isDBOpen = false;
                            resolve();
                        });
                    }
                    resolve();
                }));
            });
        }
        /**
         * DeleteDB
         * delete a database
         * @param dbName: string
         * @returns Promise<boolean>
         */
        deleteDB(dbName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // test if file exists
                    const isExists = this._uFile.isFileExists(dbName);
                    if (isExists && !this._isDBOpen) {
                        // open the database
                        try {
                            yield this.open();
                        }
                        catch (err) {
                            reject(new Error(`DeleteDB: ${err.message}`));
                        }
                    }
                    // close the database
                    try {
                        yield this.close();
                    }
                    catch (err) {
                        reject(new Error('DeleteDB: Close failed'));
                    }
                    // delete the database
                    if (isExists) {
                        try {
                            yield this._uFile.deleteFileName(dbName);
                        }
                        catch (err) {
                            let msg = `DeleteDB: deleteFile ${dbName}`;
                            msg += ` failed ${err.message}`;
                            reject(new Error(msg));
                        }
                    }
                    resolve();
                }));
            });
        }
        /**
         * CreateSyncTable
         * create the synchronization table
         * @returns Promise<{result: boolean, message: string}>
         */
        createSyncTable() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._isDBOpen) {
                    let msg = `CreateSyncTable: Database ${this._dbName} `;
                    msg += `not opened`;
                    return { result: false, message: msg };
                }
                let changes = -1;
                let isOpen = this._isDBOpen;
                // check if the table has already being created
                try {
                    const retB = yield this._uJson.isTableExists(this._mDB, isOpen, 'sync_table');
                    if (!retB) {
                        const date = Math.round(new Date().getTime() / 1000);
                        let stmts = `
                        CREATE TABLE IF NOT EXISTS sync_table (
                            id INTEGER PRIMARY KEY NOT NULL,
                            sync_date INTEGER
                            );`;
                        stmts += `INSERT INTO sync_table (sync_date) VALUES (
                            "${date}");`;
                        changes = yield this.executeSQL(stmts);
                        if (changes < 0) {
                            return { changes: -1, message: `CreateSyncTable failed` };
                        }
                    }
                    return { changes: changes };
                }
                catch (err) {
                    return { changes: -1, message: `CreateSyncTable: ${err.message}` };
                }
            });
        }
        /**
         * SetSyncDate
         * store the synchronization date
         * @param syncDate: string
         * @returns Promise<{result: boolean, message: string}>
         */
        setSyncDate(syncDate) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._isDBOpen) {
                    let msg = `SetSyncDate: Database ${this._dbName} `;
                    msg += `not opened`;
                    return { result: false, message: msg };
                }
                try {
                    const sDate = Math.round(new Date(syncDate).getTime() / 1000);
                    let stmt = `UPDATE sync_table SET sync_date = `;
                    stmt += `${sDate} WHERE id = 1;`;
                    console.log(`>>> setSyncDate stmt ${stmt}`);
                    const changes = yield this.executeSQL(stmt);
                    console.log(`>>> setSyncDate changes ${changes}`);
                    if (changes < 0) {
                        return { result: false, message: 'setSyncDate failed' };
                    }
                    else {
                        return { result: true };
                    }
                }
                catch (err) {
                    return { result: false, message: `setSyncDate failed: ${err.message}` };
                }
            });
        }
        /**
         * GetSyncDate
         * store the synchronization date
         * @returns Promise<{syncDate: number, message: string}>
         */
        getSyncDate() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._isDBOpen) {
                    let msg = `GetSyncDate: Database ${this._dbName} `;
                    msg += `not opened`;
                    return { syncDate: 0, message: msg };
                }
                try {
                    const syncDate = yield this._eTJson.getSyncDate(this._mDB);
                    if (syncDate > 0) {
                        return { syncDate: syncDate };
                    }
                    else {
                        return { syncDate: 0, message: `setSyncDate failed` };
                    }
                }
                catch (err) {
                    return { syncDate: 0, message: `setSyncDate failed: ${err.message}` };
                }
            });
        }
        /**
         * ExecuteSQL
         * execute raw sql statements store in a string
         * @param sql: string
         * @returns Promise<number>
         */
        executeSQL(sql) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (!this._isDBOpen) {
                        let msg = `ExecuteSQL: Database ${this._dbName} `;
                        msg += `not opened`;
                        reject(new Error(msg));
                    }
                    try {
                        yield this._uSQLite.beginTransaction(this._mDB, this._isDBOpen);
                        const changes = yield this._uSQLite.execute(this._mDB, sql);
                        if (changes < 0) {
                            reject(new Error('ExecuteSQL: changes < 0'));
                        }
                        yield this._uSQLite.commitTransaction(this._mDB, this._isDBOpen);
                        resolve(changes);
                    }
                    catch (err) {
                        let msg = `ExecuteSQL: ${err.message}`;
                        try {
                            yield this._uSQLite.rollbackTransaction(this._mDB, this._isDBOpen);
                        }
                        catch (err) {
                            msg += ` : ${err.message}`;
                        }
                        reject(new Error(`ExecuteSQL: ${msg}`));
                    }
                }));
            });
        }
        /**
         * SelectSQL
         * execute a sql query with/without binding values
         * @param sql: string
         * @param values: string[]
         * @returns Promise<any[]>
         */
        selectSQL(sql, values) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (!this._isDBOpen) {
                        let msg = `SelectSQL: Database ${this._dbName} `;
                        msg += `not opened`;
                        reject(new Error(msg));
                    }
                    try {
                        const retArr = yield this._uSQLite.queryAll(this._mDB, sql, values);
                        resolve(retArr);
                    }
                    catch (err) {
                        reject(new Error(`SelectSQL: ${err.message}`));
                    }
                }));
            });
        }
        /**
         * runSQL
         * execute a raw sql statement with/without binding values
         * @param sql: string
         * @param values: string[]
         * @returns Promise<{changes:number, lastId:number}>
         */
        runSQL(statement, values) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (!this._isDBOpen) {
                        let msg = `RunSQL: Database ${this._dbName} `;
                        msg += `not opened`;
                        reject(new Error(msg));
                    }
                    let retRes = { changes: -1, lastId: -1 };
                    let initChanges = -1;
                    try {
                        initChanges = yield this._uSQLite.dbChanges(this._mDB);
                        // start a transaction
                        yield this._uSQLite.beginTransaction(this._mDB, this._isDBOpen);
                    }
                    catch (err) {
                        reject(new Error(`RunSQL: ${err.message}`));
                    }
                    this._mDB.run(statement, values, (err) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            const msg = err.message;
                            try {
                                yield this._uSQLite.rollbackTransaction(this._mDB, this._isDBOpen);
                                reject(new Error(`RunSQL: ${err.message}`));
                            }
                            catch (err) {
                                reject(new Error(`RunSQL: ${msg}: ` + `${err.message}`));
                            }
                        }
                        else {
                            try {
                                yield this._uSQLite.commitTransaction(this._mDB, this._isDBOpen);
                                retRes.changes =
                                    (yield this._uSQLite.dbChanges(this._mDB)) - initChanges;
                                retRes.lastId = yield this._uSQLite.getLastId(this._mDB);
                                resolve(retRes);
                            }
                            catch (err) {
                                reject(new Error(`RunSQL: ${err.message}`));
                            }
                        }
                    }));
                }));
            });
        }
        /**
         * ExecSet
         * execute a set of raw sql statements with/without binding values
         * @param set: any[]
         * @returns Promise<{changes:number, lastId:number}>
         */
        execSet(set) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (!this._isDBOpen) {
                        let msg = `ExecSet: Database ${this._dbName} `;
                        msg += `not opened`;
                        reject(new Error(msg));
                    }
                    let retRes = { changes: -1, lastId: -1 };
                    let initChanges = -1;
                    try {
                        initChanges = yield this._uSQLite.dbChanges(this._mDB);
                        // start a transaction
                        yield this._uSQLite.beginTransaction(this._mDB, this._isDBOpen);
                    }
                    catch (err) {
                        reject(new Error(`ExecSet: ${err.message}`));
                    }
                    try {
                        retRes.lastId = yield this._uSQLite.executeSet(this._mDB, set);
                        yield this._uSQLite.commitTransaction(this._mDB, this._isDBOpen);
                        retRes.changes =
                            (yield this._uSQLite.dbChanges(this._mDB)) - initChanges;
                        resolve(retRes);
                    }
                    catch (err) {
                        const msg = err.message;
                        try {
                            yield this._uSQLite.rollbackTransaction(this._mDB, this._isDBOpen);
                        }
                        catch (err) {
                            reject(new Error(`ExecSet: ${msg}: ` + `${err.message}`));
                        }
                    }
                }));
            });
        }
        importJson(jsonData) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let changes = -1;
                if (this._isDBOpen) {
                    try {
                        // create the database schema
                        changes = yield this._iFJson.createDatabaseSchema(this._mDB, jsonData);
                        if (changes != -1) {
                            // create the tables data
                            changes = yield this._iFJson.createTablesData(this._mDB, jsonData);
                        }
                        resolve(changes);
                    }
                    catch (err) {
                        reject(new Error(`ImportJson: ${err.message}`));
                    }
                }
                else {
                    reject(new Error(`ImportJson: database is closed`));
                }
            }));
        }
        exportJson(mode) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const inJson = {};
                inJson.database = this._dbName.slice(0, -9);
                inJson.version = this._version;
                inJson.encrypted = false;
                inJson.mode = mode;
                if (this._isDBOpen) {
                    try {
                        const retJson = yield this._eTJson.createExportObject(this._mDB, inJson);
                        const isValid = this._uJson.isJsonSQLite(retJson);
                        if (isValid) {
                            resolve(retJson);
                        }
                        else {
                            reject(new Error(`ExportJson: retJson not valid`));
                        }
                    }
                    catch (err) {
                        reject(new Error(`ExportJson: ${err.message}`));
                    }
                }
                else {
                    reject(new Error(`ExportJson: database is closed`));
                }
            }));
        }
    }

    //1234567890123456789012345678901234567890123456789012345678901234567890
    const { remote } = require('electron');
    class CapacitorSQLiteElectronWeb extends WebPlugin {
        constructor() {
            super({
                name: 'CapacitorSQLite',
                platforms: ['electron'],
            });
            this.RemoteRef = null;
            this._dbDict = {};
            this._uFile = new UtilsFile();
            this._uJson = new UtilsJson();
            this._versionUpgrades = {};
            console.log('CapacitorSQLite Electron');
            this.RemoteRef = remote;
            this._osType = this._uFile.osType;
        }
        createConnection(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                const version = options.version ? options.version : 1;
                const encrypted = options.encrypted && this._osType === 'Darwin'
                    ? options.encrypted
                    : false;
                const inMode = options.mode && this._osType === 'Darwin'
                    ? options.mode
                    : 'no-encryption';
                let upgDict = {};
                const vUpgKeys = Object.keys(this._versionUpgrades);
                if (vUpgKeys.length !== 0 && vUpgKeys.includes(dbName)) {
                    upgDict = this._versionUpgrades[dbName];
                }
                let mDb = new Database(dbName + 'SQLite.db', encrypted, inMode, version, upgDict);
                this._dbDict[dbName] = mDb;
                return Promise.resolve({ result: true });
            });
        }
        closeConnection(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: 'CloseConnection command failed: No ' +
                            'available connection for ' +
                            dbName,
                    });
                }
                const mDB = this._dbDict[dbName];
                if (mDB.isDBOpen()) {
                    // close the database
                    try {
                        yield mDB.close();
                    }
                    catch (err) {
                        return Promise.resolve({
                            result: false,
                            message: 'CloseConnection command failed: ' +
                                'close ' +
                                dbName +
                                ' failed ' +
                                err.message,
                        });
                    }
                }
                // remove the connection from dictionary
                delete this._dbDict[dbName];
                return Promise.resolve({ result: true });
            });
        }
        echo(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const ret = {};
                ret.value = options.value;
                return ret;
            });
        }
        open(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: `Open: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    yield mDB.open();
                    return Promise.resolve({ result: true });
                }
                catch (err) {
                    return Promise.resolve({
                        result: false,
                        message: `Open: ${err.message}`,
                    });
                }
            });
        }
        close(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: `Close: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    yield mDB.close();
                    return Promise.resolve({ result: true });
                }
                catch (err) {
                    return Promise.resolve({
                        result: false,
                        message: `Close: ${err.message}`,
                    });
                }
            });
        }
        execute(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('statements') || options.statements.length === 0) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'Must provide raw SQL statements',
                    });
                }
                const dbName = options.database;
                const statements = options.statements;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: `Execute: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    const ret = yield mDB.executeSQL(statements);
                    if (ret < 0) {
                        return Promise.resolve({
                            changes: { changes: -1 },
                            message: 'Execute failed',
                        });
                    }
                    else {
                        return Promise.resolve({ changes: { changes: ret } });
                    }
                }
                catch (err) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: `Execute failed: ${err}`,
                    });
                }
            });
        }
        executeSet(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('set') || options.set.length === 0) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'Must provide a non-empty set of SQL ' + 'statements',
                    });
                }
                const dbName = options.database;
                const setOfStatements = options.set;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: `ExecuteSet: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                for (let i = 0; i < setOfStatements.length; i++) {
                    if (!('statement' in setOfStatements[i]) ||
                        !('values' in setOfStatements[i])) {
                        return Promise.reject({
                            changes: { changes: -1 },
                            message: 'ExecuteSet: Must provide a set as ' +
                                'Array of {statement,values}',
                        });
                    }
                }
                try {
                    const ret = yield mDB.execSet(setOfStatements);
                    if (ret < 0) {
                        return Promise.resolve({
                            changes: { changes: -1 },
                            message: `ExecuteSet failed`,
                        });
                    }
                    else {
                        return Promise.resolve({ changes: ret });
                    }
                }
                catch (err) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: `ExecuteSet failed: ${err}`,
                    });
                }
            });
        }
        run(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        changes: { changes: -1, lastId: -1 },
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('statement') || options.statement.length === 0) {
                    return Promise.resolve({
                        changes: { changes: -1, lastId: -1 },
                        message: 'Must provide a query statement',
                    });
                }
                if (!keys.includes('values')) {
                    return Promise.resolve({
                        changes: { changes: -1, lastId: -1 },
                        message: 'Must provide an Array of values',
                    });
                }
                const dbName = options.database;
                const statement = options.statement;
                const values = options.values.length > 0 ? options.values : [];
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        changes: { changes: -1, lastId: -1 },
                        message: `Run: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    const ret = yield mDB.runSQL(statement, values);
                    return Promise.resolve({ changes: ret });
                }
                catch (err) {
                    return Promise.resolve({
                        changes: { changes: -1, lastId: -1 },
                        message: `RUN failed: ${err} `,
                    });
                }
            });
        }
        query(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        values: [],
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('statement') || options.statement.length === 0) {
                    return Promise.resolve({
                        values: [],
                        message: 'Must provide a query statement',
                    });
                }
                if (!keys.includes('values')) {
                    return Promise.resolve({
                        values: [],
                        message: 'Must provide an Array of strings',
                    });
                }
                const dbName = options.database;
                const statement = options.statement;
                const values = options.values.length > 0 ? options.values : [];
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        values: [],
                        message: `Query: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                let ret = [];
                try {
                    ret = yield mDB.selectSQL(statement, values);
                    return Promise.resolve({ values: ret });
                }
                catch (err) {
                    return Promise.resolve({ values: [], message: `Query failed: ${err}` });
                }
            });
        }
        isDBExists(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: 'IsDBExists command failed: No available ' +
                            'connection for ' +
                            dbName,
                    });
                }
                const isExists = this._uFile.isFileExists(dbName + 'SQLite.db');
                return Promise.resolve({
                    result: isExists,
                });
            });
        }
        deleteDatabase(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: 'deleteDatabase: No available connection for ' + `${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    yield mDB.deleteDB(dbName + 'SQLite.db');
                    return Promise.resolve({ result: true });
                }
                catch (err) {
                    return Promise.resolve({
                        result: false,
                        message: `Delete: ${err.message}`,
                    });
                }
            });
        }
        isJsonValid(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('jsonstring')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a json object',
                    });
                }
                const jsonStrObj = options.jsonstring;
                const jsonObj = JSON.parse(jsonStrObj);
                const isValid = this._uJson.isJsonSQLite(jsonObj);
                if (!isValid) {
                    return Promise.resolve({
                        result: false,
                        message: 'Stringify Json Object not Valid',
                    });
                }
                else {
                    return Promise.resolve({ result: true });
                }
            });
        }
        importFromJson(options) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const retRes = { changes: -1 };
                let keys = Object.keys(options);
                if (!keys.includes('jsonstring')) {
                    return Promise.resolve({
                        changes: retRes,
                        message: 'Must provide a json object',
                    });
                }
                const jsonStrObj = options.jsonstring;
                const jsonObj = JSON.parse(jsonStrObj);
                const isValid = this._uJson.isJsonSQLite(jsonObj);
                if (!isValid) {
                    return Promise.resolve({
                        changes: retRes,
                        message: 'Must provide a valid JsonSQLite Object',
                    });
                }
                const vJsonObj = jsonObj;
                const dbName = `${vJsonObj.database}SQLite.db`;
                const dbVersion = (_a = vJsonObj.version) !== null && _a !== void 0 ? _a : 1;
                const encrypted = (_b = vJsonObj.encrypted) !== null && _b !== void 0 ? _b : false;
                const mode = encrypted ? 'secret' : 'no-encryption';
                // Create the database
                let mDb = new Database(dbName, encrypted, mode, dbVersion, {});
                try {
                    // Open the database
                    yield mDb.open();
                    // Import the JsonSQLite Object
                    const changes = yield mDb.importJson(vJsonObj);
                    // Close the database
                    yield mDb.close();
                    return Promise.resolve({ changes: { changes: changes } });
                }
                catch (err) {
                    return Promise.resolve({
                        changes: retRes,
                        message: `ImportFromJson: ${err.message}`,
                    });
                }
            });
        }
        exportToJson(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let retRes = {};
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        export: retRes,
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('jsonexportmode')) {
                    return Promise.resolve({
                        export: retRes,
                        message: 'Must provide a json export mode',
                    });
                }
                const dbName = options.database;
                const exportMode = options.jsonexportmode;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        export: retRes,
                        message: 'exportToJson: No available connection for ' + `${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                try {
                    const ret = yield mDB.exportJson(exportMode);
                    const keys = Object.keys(ret);
                    if (keys.includes('message')) {
                        return Promise.resolve({
                            export: retRes,
                            message: `exportToJson: ${ret.message}`,
                        });
                    }
                    else {
                        return Promise.resolve({ export: ret });
                    }
                }
                catch (err) {
                    return Promise.resolve({
                        export: retRes,
                        message: `exportToJson: ${err.message}`,
                    });
                }
            });
        }
        createSyncTable(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        changes: { changes: -1 },
                        message: 'CreateSyncTable: No available connection for ' + `${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                const ret = yield mDB.createSyncTable();
                if (ret.message === null) {
                    return Promise.resolve({ changes: ret.changes });
                }
                else {
                    return Promise.resolve({ changes: ret.changes, message: ret.message });
                }
            });
        }
        setSyncDate(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('syncdate')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a synchronization date',
                    });
                }
                const dbName = options.database;
                const syncDate = options.syncdate;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        result: false,
                        message: `SetSyncDate: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                const ret = yield mDB.setSyncDate(syncDate);
                console.log(`$$$ setSyncDate ${JSON.stringify(ret)}`);
                return Promise.resolve(ret);
            });
        }
        getSyncDate(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        syncDate: 0,
                        message: 'Must provide a database name',
                    });
                }
                const dbName = options.database;
                keys = Object.keys(this._dbDict);
                if (!keys.includes(dbName)) {
                    return Promise.resolve({
                        syncDate: 0,
                        message: `GetSyncDate: No available connection for ${dbName}`,
                    });
                }
                const mDB = this._dbDict[dbName];
                const ret = yield mDB.getSyncDate();
                return Promise.resolve(ret);
            });
        }
        addUpgradeStatement(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let keys = Object.keys(options);
                if (!keys.includes('database')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide a database name',
                    });
                }
                if (!keys.includes('upgrade')) {
                    return Promise.resolve({
                        result: false,
                        message: 'Must provide an upgrade statement',
                    });
                }
                const dbName = options.database;
                const upgrade = options.upgrade[0];
                keys = Object.keys(upgrade);
                if (!keys.includes('fromVersion') ||
                    !keys.includes('toVersion') ||
                    !keys.includes('statement')) {
                    return Promise.reject({
                        result: false,
                        message: 'Must provide an upgrade ' + 'capSQLiteVersionUpgrade Object',
                    });
                }
                if (typeof upgrade.fromVersion != 'number') {
                    return Promise.reject({
                        result: false,
                        message: 'ugrade.fromVersion must be a number',
                    });
                }
                const upgVDict = {};
                upgVDict[upgrade.fromVersion] = upgrade;
                this._versionUpgrades[dbName] = upgVDict;
                return Promise.resolve({ result: true });
            });
        }
        copyFromAssets() {
            return __awaiter(this, void 0, void 0, function* () {
                // check if the assets/database folder exists
                const assetsDbPath = this._uFile.getAssetsDatabasesPath();
                const res = this._uFile.isPathExists(assetsDbPath);
                if (res) {
                    // get the database files
                    const dbList = yield this._uFile.getFileList(assetsDbPath);
                    dbList.forEach((db) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`>>> ${db}`);
                        // for each check if the suffix SQLite.db is there or add it
                        let toDb = this._uFile.setPathSuffix(db);
                        // for each copy the file to the Application database folder
                        yield this._uFile.copyFromAssetToDatabase(db, toDb);
                    }));
                    return Promise.resolve({ result: true });
                }
                else {
                    return Promise.resolve({
                        result: false,
                        message: 'CopyFromAssets: assets/databases folder does not exist',
                    });
                }
            });
        }
    }
    const CapacitorSQLite = new CapacitorSQLiteElectronWeb();
    registerWebPlugin(CapacitorSQLite);

    exports.CapacitorSQLite = CapacitorSQLite;
    exports.CapacitorSQLiteElectronWeb = CapacitorSQLiteElectronWeb;
    exports.SQLiteConnection = SQLiteConnection;
    exports.SQLiteDBConnection = SQLiteDBConnection;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=plugin.js.map
