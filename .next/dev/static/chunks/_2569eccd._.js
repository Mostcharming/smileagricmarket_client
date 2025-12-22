(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/modal/modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const Modal = ({ isOpen, onClose, children, ariaLabel, maxWidth = "max-w-md", maxHeight = "max-h-[70vh]", bottomRight = false, closeOnOverlayClick = true })=>{
    _s();
    const overlayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Prevent background scroll when modal is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                document.body.classList.add("overflow-hidden");
            } else {
                document.body.classList.remove("overflow-hidden");
            }
            return ({
                "Modal.useEffect": ()=>{
                    document.body.classList.remove("overflow-hidden");
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    // Close on ESC
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen) return;
            const handleKeyDown = {
                "Modal.useEffect.handleKeyDown": (e)=>{
                    if (e.key === "Escape") onClose();
                }
            }["Modal.useEffect.handleKeyDown"];
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "Modal.useEffect": ()=>document.removeEventListener("keydown", handleKeyDown)
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        onClose
    ]);
    // Focus trap
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen || !modalRef.current) return;
            const focusableEls = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableEls.length) focusableEls[0].focus();
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: overlayRef,
        className: `fixed inset-0 z-50 flex ${bottomRight ? "items-end justify-end p-0 pb-6 md:p-6" : "items-center justify-center"} cursor-pointer bg-appBlack/40 backdrop-blur-sm`,
        "aria-modal": "true",
        role: "dialog",
        "aria-label": ariaLabel || "Modal",
        onClick: (e)=>{
            if (e.target === overlayRef.current && closeOnOverlayClick) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: modalRef,
            className: `bg-appWhite rounded-xl shadow-xl p-0 w-[95%] relative cursor-default! focus:outline-none ${maxWidth} ${maxHeight} max-md:mx-auto overflow-y-auto`,
            tabIndex: -1,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/modal/modal.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/modal/modal.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Modal, "+L0Ft/Id0+pMiDG/ajxiIzyGlXo=");
_c = Modal;
const __TURBOPACK__default__export__ = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/add.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*#__PURE__*/ __turbopack_context__.s([
    "AddIcon",
    ()=>AddIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            "clip-path": "url(#clip0_2001_975)",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z",
                fill: "#64B03F"
            }, void 0, false, {
                fileName: "[project]/components/icons/add.tsx",
                lineNumber: 3,
                columnNumber: 1
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/icons/add.tsx",
            lineNumber: 2,
            columnNumber: 1
        }, ("TURBOPACK compile-time value", void 0)),
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                id: "clip0_2001_975",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    width: "24",
                    height: "24",
                    fill: "white"
                }, void 0, false, {
                    fileName: "[project]/components/icons/add.tsx",
                    lineNumber: 7,
                    columnNumber: 1
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/icons/add.tsx",
                lineNumber: 6,
                columnNumber: 1
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/icons/add.tsx",
            lineNumber: 5,
            columnNumber: 1
        }, ("TURBOPACK compile-time value", void 0))
    ]
}, void 0, true, {
    fileName: "[project]/components/icons/add.tsx",
    lineNumber: 1,
    columnNumber: 1
}, ("TURBOPACK compile-time value", void 0));
function AddIcon({ className, color = "#92998E", size = 10 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                clipPath: "url(#clip0_2001_975)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z",
                    fill: color
                }, void 0, false, {
                    fileName: "[project]/components/icons/add.tsx",
                    lineNumber: 30,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/icons/add.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                    id: "clip0_2001_975",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        width: "24",
                        height: "24",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/components/icons/add.tsx",
                        lineNumber: 34,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/icons/add.tsx",
                    lineNumber: 33,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/icons/add.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/icons/add.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = AddIcon;
var _c;
__turbopack_context__.k.register(_c, "AddIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/arrowLeft.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeftIcon",
    ()=>ArrowLeftIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function ArrowLeftIcon({ className, color = "#92998E", size = 18 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 16 16",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7.99992 12.6666L3.33325 7.99998L7.99992 3.33331",
                stroke: color,
                strokeWidth: "1.33333",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/arrowLeft.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12.6666 8H3.33325",
                stroke: color,
                strokeWidth: "1.33333",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/arrowLeft.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/icons/arrowLeft.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
_c = ArrowLeftIcon;
var _c;
__turbopack_context__.k.register(_c, "ArrowLeftIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/chevron.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronIcon",
    ()=>ChevronIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function ChevronIcon({ className, color = "#92998E", size = 10 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 11 10",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9.9085 3.65488C10.1715 3.39068 10.1715 2.96234 9.9085 2.69815C9.64542 2.43395 9.21888 2.43395 8.95579 2.69815L5.93909 5.72771L2.92245 2.69822C2.65937 2.43403 2.23285 2.43403 1.96977 2.69822C1.70669 2.96241 1.70669 3.39076 1.96977 3.65495L5.45296 7.15296C5.45613 7.15629 5.45938 7.15958 5.46267 7.16288C5.54896 7.24958 5.65288 7.30783 5.76288 7.33763C5.76555 7.33838 5.76825 7.33908 5.77096 7.33975C5.99413 7.39733 6.24088 7.33842 6.41559 7.16296C6.41992 7.15863 6.42417 7.15425 6.42838 7.14983L9.9085 3.65488Z",
            fill: color
        }, void 0, false, {
            fileName: "[project]/components/icons/chevron.tsx",
            lineNumber: 17,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/icons/chevron.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = ChevronIcon;
var _c;
__turbopack_context__.k.register(_c, "ChevronIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/eye.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EyeIcon",
    ()=>EyeIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function EyeIcon({ className, color = "#92998E", size = 20 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
                stroke: color,
                strokeWidth: "2",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eye.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3",
                stroke: color,
                strokeWidth: "2",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eye.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/icons/eye.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
_c = EyeIcon;
var _c;
__turbopack_context__.k.register(_c, "EyeIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/eyeOff.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EyeOffIcon",
    ()=>EyeOffIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function EyeOffIcon({ className, color = "#92998E", size = 20 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.88 9.88a3 3 0 1 0 4.24 4.24",
                stroke: color,
                strokeWidth: "2",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eyeOff.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68",
                stroke: color,
                strokeWidth: "2",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eyeOff.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61",
                stroke: color,
                strokeWidth: "2",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eyeOff.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "2",
                y1: "2",
                x2: "22",
                y2: "22",
                stroke: color,
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/components/icons/eyeOff.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/icons/eyeOff.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, this);
}
_c = EyeOffIcon;
var _c;
__turbopack_context__.k.register(_c, "EyeOffIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoIcon",
    ()=>LogoIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function LogoIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "53",
        height: "51",
        viewBox: "0 0 53 51",
        fill: "none",
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "53",
                height: "51",
                fill: "url(#pattern0_2001_493)"
            }, void 0, false, {
                fileName: "[project]/components/icons/logo.tsx",
                lineNumber: 16,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                        id: "pattern0_2001_493",
                        patternContentUnits: "objectBoundingBox",
                        width: "1",
                        height: "1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("use", {
                            xlinkHref: "#image0_2001_493",
                            transform: "matrix(0.00746269 0 0 0.00775194 -1.36567 -1.43411)"
                        }, void 0, false, {
                            fileName: "[project]/components/icons/logo.tsx",
                            lineNumber: 19,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/icons/logo.tsx",
                        lineNumber: 18,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                        id: "image0_2001_493",
                        width: "500",
                        height: "500",
                        preserveAspectRatio: "none",
                        xlinkHref: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAy9klEQVR4Xu3dCYBNZf/A8ec5595ZzDDWULaSPWOPpJKi5R9lr5QWWuR9CxXtoigiS6lUUiKlVNq3N5R6SRQhOxESsrszc+855/+csbwS5s7Mveece+/3vO9tzMw5z/N7Ps+98zvLc54jBAsCCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAAC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BBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAIEEFvh/hU891stDAhwAAAAASUVORK5CYII="
                    }, void 0, false, {
                        fileName: "[project]/components/icons/logo.tsx",
                        lineNumber: 21,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/icons/logo.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/icons/logo.tsx",
        lineNumber: 7,
        columnNumber: 9
    }, this);
}
_c = LogoIcon;
var _c;
__turbopack_context__.k.register(_c, "LogoIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$add$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/add.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$arrowLeft$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/arrowLeft.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$chevron$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/chevron.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eye$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/eye.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eyeOff$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/eyeOff.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/logo.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
;
const variantClasses = {
    light: 'bg-white text-appBlack border border-border',
    dark: 'bg-appBlack text-white border border-appBlack',
    primary: 'bg-primary text-white border border-primary disabled:border-none disabled:bg-border100 disabled:text-foreground100'
};
const sizeClassesMap = {
    small: 'py-2.5 px-4',
    medium: 'py-3.5 px-5',
    large: 'py-4.5 px-6'
};
const Button = ({ variant = 'light', className = '', icon, iconPosition = 'left', size = 'small', children, isLoading = false, ...props })=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isDisabled = props.disabled || isLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('rounded-lg font-medium shadow-sm shadow-[#0A0D120D] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed hover:opacity-90', variantClasses[variant], sizeClassesMap[size], className),
        ...props,
        disabled: isDisabled,
        "aria-busy": isLoading,
        children: [
            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin text-current",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "3",
                            opacity: "0.25"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/button.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M22 12a10 10 0 0 1-10 10",
                            stroke: "currentColor",
                            strokeWidth: "3",
                            strokeLinecap: "round"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/button.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/button.tsx",
                    lineNumber: 43,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/button.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : icon && iconPosition === "left" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/ui/button.tsx",
                lineNumber: 68,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/button.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            icon && iconPosition === "right" && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/ui/button.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/icons/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eye$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/eye.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eyeOff$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/eyeOff.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Input = ({ label = '', id, value, onChange, className = '', labelClassName = '', containerClassName = '', bottomText = '', bottomClassName = '', type = 'text', ...props })=>{
    _s();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;
    const hasValue = Boolean(value && value.toString().length > 0);
    const isFloating = focused || hasValue;
    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full flex flex-col text-sm ${containerClassName}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: id,
                        type: inputType,
                        value: value,
                        onChange: onChange,
                        onFocus: ()=>setFocused(true),
                        onBlur: ()=>setFocused(false),
                        className: `peer w-full bg-transparent border border-border rounded-lg px-3 py-4 text-appBlack placeholder:text-border focus:outline-none focus:ring-2 focus:ring-primary ${isPasswordType ? 'pr-10' : ''} ${className}`,
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/components/ui/input.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: `absolute left-3 transition-all duration-300 ease-in-out pointer-events-none ${labelClassName} ${isFloating ? '-top-2 text-xs bg-white px-1 text-border' : 'top-4 text-sm text-border'}`,
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/ui/input.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    isPasswordType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: togglePasswordVisibility,
                        className: "absolute right-3.5 top-4.5 text-gray300 hover:text-border cursor-pointer focus:outline-none focus:text-border transition-colors",
                        "aria-label": showPassword ? 'Hide password' : 'Show password',
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eyeOff$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EyeOffIcon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/ui/input.tsx",
                            lineNumber: 67,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$eye$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EyeIcon"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/components/ui/input.tsx",
                            lineNumber: 69,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/ui/input.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/input.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            bottomText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: `block text-xs md:text-sm text-appBlack mt-4 ${bottomClassName}`,
                children: bottomText
            }, void 0, false, {
                fileName: "[project]/components/ui/input.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Input, "LvLBjX4v064wMmzegj+5D/ZXUws=");
_c = Input;
const __TURBOPACK__default__export__ = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Select
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/icons/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$chevron$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/chevron.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Select({ variant = "v1", className = "", options = [], value, onChange, placeholder, emptyState = "No options available", defaultValue = "", dropdownPosition = "left", minWidth, hasMore = false, onLoadMore, loadMoreLabel = "Load more", loadMoreLoading = false, label, labelClassName = "", ...rest }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [internalValue, setInternalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue || "");
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dropdownStyles, setDropdownStyles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const isControlled = value !== undefined;
    const selectedValue = (isControlled ? value : internalValue) || "";
    const flatOptions = Array.isArray(options) ? options : [];
    const selectedOption = flatOptions.find((opt)=>opt.value === selectedValue);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            const handleClick = {
                "Select.useEffect.handleClick": (e)=>{
                    const target = e.target;
                    if (ref.current && !ref.current.contains(target) && !(dropdownRef.current && dropdownRef.current.contains(target))) {
                        setOpen(false);
                    }
                }
            }["Select.useEffect.handleClick"];
            if (open) document.addEventListener("mousedown", handleClick);
            return ({
                "Select.useEffect": ()=>document.removeEventListener("mousedown", handleClick)
            })["Select.useEffect"];
        }
    }["Select.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            const MAX_DROPDOWN_HEIGHT = 420;
            const compute = {
                "Select.useEffect.compute": ()=>{
                    if (!ref.current) return;
                    const rect = ref.current.getBoundingClientRect();
                    const winX = window.scrollX || window.pageXOffset;
                    const winY = window.scrollY || window.pageYOffset;
                    const widthPx = typeof minWidth === "number" ? minWidth : typeof minWidth === "string" && minWidth.endsWith("px") ? parseInt(minWidth, 10) : Math.round(rect.width);
                    let dropdownHeightEstimate = MAX_DROPDOWN_HEIGHT;
                    if (dropdownRef.current) {
                        const measured = dropdownRef.current.offsetHeight || dropdownRef.current.scrollHeight;
                        if (measured && measured > 0) dropdownHeightEstimate = Math.min(measured, MAX_DROPDOWN_HEIGHT);
                    }
                    const availableBelow = window.innerHeight - rect.bottom;
                    const availableAbove = rect.top;
                    const preferAbove = dropdownHeightEstimate + 8 > availableBelow && availableAbove > availableBelow;
                    let topPos;
                    let finalMaxHeight = dropdownHeightEstimate;
                    if (preferAbove) {
                        finalMaxHeight = Math.min(dropdownHeightEstimate, Math.max(64, Math.floor(availableAbove - 8)));
                        topPos = rect.top + winY - finalMaxHeight - 4;
                    } else {
                        finalMaxHeight = Math.min(dropdownHeightEstimate, Math.max(64, Math.floor(availableBelow - 8)));
                        topPos = rect.bottom + winY + 4;
                    }
                    const left = dropdownPosition === "right" ? rect.right + winX - widthPx : rect.left + winX;
                    setDropdownStyles({
                        position: "absolute",
                        top: topPos,
                        left,
                        width: `${widthPx}px`,
                        maxHeight: `${finalMaxHeight}px`,
                        zIndex: 9999,
                        transformOrigin: preferAbove ? "bottom left" : "top left"
                    });
                    if (!dropdownRef.current) {
                        requestAnimationFrame({
                            "Select.useEffect.compute": ()=>{
                                if (!dropdownRef.current) return;
                                const measured = dropdownRef.current.offsetHeight || dropdownRef.current.scrollHeight || MAX_DROPDOWN_HEIGHT;
                                const newEstimate = Math.min(measured, MAX_DROPDOWN_HEIGHT);
                                const newPreferAbove = newEstimate + 8 > availableBelow && availableAbove > availableBelow;
                                const newFinalMaxHeight = newPreferAbove ? Math.min(newEstimate, Math.max(64, Math.floor(availableAbove - 8))) : Math.min(newEstimate, Math.max(64, Math.floor(availableBelow - 8)));
                                const newTop = newPreferAbove ? rect.top + winY - newFinalMaxHeight - 4 : rect.bottom + winY + 4;
                                setDropdownStyles({
                                    "Select.useEffect.compute": (s)=>({
                                            ...s,
                                            top: newTop,
                                            maxHeight: `${newFinalMaxHeight}px`,
                                            transformOrigin: newPreferAbove ? "bottom left" : "top left"
                                        })
                                }["Select.useEffect.compute"]);
                            }
                        }["Select.useEffect.compute"]);
                    }
                }
            }["Select.useEffect.compute"];
            if (open) {
                compute();
                window.addEventListener("resize", compute);
                window.addEventListener("scroll", compute, true);
            }
            return ({
                "Select.useEffect": ()=>{
                    window.removeEventListener("resize", compute);
                    window.removeEventListener("scroll", compute, true);
                }
            })["Select.useEffect"];
        }
    }["Select.useEffect"], [
        open,
        dropdownPosition,
        minWidth
    ]);
    const [highlighted, setHighlighted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Select.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (!open) setHighlighted(-1);
        }
    }["Select.useEffect"], [
        open,
        options
    ]);
    const handleSelect = (val)=>{
        if (!isControlled) setInternalValue(val);
        onChange?.({
            target: {
                value: val
            }
        });
        setOpen(false);
    };
    const handleKeyDown = (e)=>{
        const total = flatOptions.length;
        if (!open) {
            if (e.key === "Enter" || e.key === " ") setOpen(true);
            return;
        }
        if (e.key === "ArrowDown") {
            setHighlighted((h)=>Math.min(h + 1, Math.max(0, total - 1)));
        } else if (e.key === "ArrowUp") {
            setHighlighted((h)=>Math.max(h - 1, 0));
        } else if (e.key === "Enter" && highlighted >= 0 && flatOptions[highlighted]) {
            const opt = flatOptions[highlighted];
            if (opt.value && typeof opt.value === "string") handleSelect(opt.value);
            if (opt.value && typeof opt.value === "function") opt.value();
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };
    const baseClasses = "border border-border px-3 py-4 cursor-pointer relative";
    const variantClasses = variant === "v1" ? "bg-appWhite rounded-lg" : "bg-transparent rounded-full";
    const hasValue = Boolean(selectedValue);
    const isFloating = hasValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        tabIndex: 0,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])(baseClasses, variantClasses, className, "outline-none select-none"),
        onClick: ()=>setOpen((o)=>!o),
        onKeyDown: handleKeyDown,
        ...rest,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: `absolute left-3 transition-all duration-300 ease-in-out pointer-events-none ${labelClassName} ${isFloating ? '-top-2 text-xs bg-appWhite px-1 text-border' : 'top-4 text-sm text-border'}`,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate flex items-center text-xs sm:text-sm gap-2",
                        children: [
                            selectedOption?.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: selectedOption.icon
                            }, void 0, false, {
                                fileName: "[project]/components/ui/select.tsx",
                                lineNumber: 236,
                                columnNumber: 36
                            }, this),
                            selectedOption ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])("truncate", selectedOption.color ?? ""),
                                children: selectedOption.label
                            }, void 0, false, {
                                fileName: "[project]/components/ui/select.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate text-border",
                                children: placeholder
                            }, void 0, false, {
                                fileName: "[project]/components/ui/select.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$chevron$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChevronIcon"], {
                            size: 16,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])("ml-2 smooth-transition", open && "rotate-180")
                        }, void 0, false, {
                            fileName: "[project]/components/ui/select.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dropdownRef,
                style: dropdownStyles,
                className: "p-1 bg-appWhite border border-border rounded-lg shadow-lg overflow-auto animate-fadeIn",
                onClick: (e)=>e.stopPropagation(),
                children: flatOptions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 py-2 sm:px-4 sm:py-3 text-border text-xs sm:text-base truncate",
                    children: emptyState
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 262,
                    columnNumber: 15
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        flatOptions.map((opt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("w-full rounded-lg cursor-pointer text-left px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hover:bg-background/50 focus:bg-background100 transition-all", selectedValue === opt.value && "bg-primary/10 font-medium", highlighted === i && "bg-background100", "outline-none"),
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    if (typeof opt.value === "string") {
                                        handleSelect(opt.value);
                                    } else if (typeof opt.value === "function") {
                                        opt.value();
                                    }
                                },
                                onMouseEnter: ()=>setHighlighted(i),
                                tabIndex: -1,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1.5 sm:gap-2",
                                    children: [
                                        opt.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: opt.icon
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/select.tsx",
                                            lineNumber: 295,
                                            columnNumber: 36
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])("truncate", opt.color ?? ""),
                                            children: opt.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/ui/select.tsx",
                                            lineNumber: 296,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ui/select.tsx",
                                    lineNumber: 294,
                                    columnNumber: 21
                                }, this)
                            }, typeof opt.value === "string" || typeof opt.value === "number" ? opt.value : `option-${i}`, false, {
                                fileName: "[project]/components/ui/select.tsx",
                                lineNumber: 268,
                                columnNumber: 19
                            }, this)),
                        onLoadMore && hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 py-2 border-t border-border flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    if (!loadMoreLoading) onLoadMore();
                                },
                                className: "text-xs sm:text-base px-3 py-1 rounded-md bg-white border border-border hover:bg-background/50 disabled:opacity-60",
                                disabled: !!loadMoreLoading,
                                children: loadMoreLoading ? "Loading..." : loadMoreLabel
                            }, void 0, false, {
                                fileName: "[project]/components/ui/select.tsx",
                                lineNumber: 305,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ui/select.tsx",
                            lineNumber: 304,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 255,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
_s(Select, "pfs6DpVmm6ONFRRO+qJVeMoAlEY=");
_c = Select;
var _c;
__turbopack_context__.k.register(_c, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/typography.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
;
const variantStyles = {
    heading: 'text-3xl md:text-5xl font-bold',
    intro: 'text-2xl md:text-3xl font-bold',
    subheading: 'text-lg md:text-2xl font-semibold',
    base: 'text-sm md:text-base',
    normal: 'text-xs md:text-sm',
    small: 'text-xs'
};
const Typography = ({ variant = 'base', className = '', children, ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-foreground', variantStyles[variant], className),
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/typography.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Typography;
const __TURBOPACK__default__export__ = Typography;
var _c;
__turbopack_context__.k.register(_c, "Typography");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$typography$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/typography.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript) <export default as Button>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript) <export default as Input>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript) <export default as Select>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
}),
"[project]/components/modal/kycModal.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/components/modal/kycModal.tsx'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/pages/main/dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modal$2f$kycModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/modal/kycModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript) <export default as Button>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const Dashboard = ()=>{
    _s();
    const [verificationStatus, setVerificationStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("not_verified");
    const [isKycModalOpen, setIsKycModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // KycModal state
    const [number, setNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [identification, setIdentification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isPending, setIsPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const identificationOptions = [
        {
            label: "Facebook",
            value: "facebook"
        },
        {
            label: "Instagram",
            value: "instagram"
        },
        {
            label: "Twitter",
            value: "twitter"
        },
        {
            label: "LinkedIn",
            value: "linkedin"
        },
        {
            label: "Friend",
            value: "friend"
        },
        {
            label: "Other",
            value: "other"
        }
    ];
    const handleKycDone = ()=>{
        setIsPending(true);
        // Simulate API call
        setTimeout(()=>{
            setIsPending(false);
            setIsKycModalOpen(false);
            setVerificationStatus("in_progress");
        }, 1000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col items-center pt-20 px-4",
        children: [
            verificationStatus === "not_verified" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-4xl bg-[#F3F4F6] p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "24",
                                height: "24",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
                                        stroke: "#374151",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/main/dashboard.tsx",
                                        lineNumber: 42,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 8V12",
                                        stroke: "#374151",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/main/dashboard.tsx",
                                        lineNumber: 43,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 16H12.01",
                                        stroke: "#374151",
                                        strokeWidth: "1.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/main/dashboard.tsx",
                                        lineNumber: 44,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/main/dashboard.tsx",
                                lineNumber: 41,
                                columnNumber: 14
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-700 text-sm sm:text-base",
                                children: "You are not verified yet. Please proceed to verify your profile to list your farms."
                            }, void 0, false, {
                                fileName: "[project]/pages/main/dashboard.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/main/dashboard.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        variant: "primary",
                        className: "whitespace-nowrap",
                        onClick: ()=>setIsKycModalOpen(true),
                        children: "VERIFY YOUR PROFILE"
                    }, void 0, false, {
                        fileName: "[project]/pages/main/dashboard.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/main/dashboard.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            verificationStatus === "in_progress" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-4xl bg-[#F3F4F6] p-4 rounded-md flex items-center gap-3 mb-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
                                stroke: "#374151",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/pages/main/dashboard.tsx",
                                lineNumber: 61,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 8V12",
                                stroke: "#374151",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/pages/main/dashboard.tsx",
                                lineNumber: 62,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 16H12.01",
                                stroke: "#374151",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/pages/main/dashboard.tsx",
                                lineNumber: 63,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/main/dashboard.tsx",
                        lineNumber: 60,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-700",
                        children: "Your verification is in progress"
                    }, void 0, false, {
                        fileName: "[project]/pages/main/dashboard.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/main/dashboard.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl sm:text-3xl font-semibold text-black text-center",
                children: "THIS IS THE FARMER DASHBOARD"
            }, void 0, false, {
                fileName: "[project]/pages/main/dashboard.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$modal$2f$kycModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isKycModalOpen,
                onClose: ()=>setIsKycModalOpen(false),
                number: number,
                setNumber: setNumber,
                identification: identification,
                setIdentification: setIdentification,
                identificationOptions: identificationOptions,
                isPending: isPending,
                onDone: handleKycDone
            }, void 0, false, {
                fileName: "[project]/pages/main/dashboard.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/main/dashboard.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Dashboard, "U741Dc5l79ihZMfA3FgGIg1UD5U=");
_c = Dashboard;
const __TURBOPACK__default__export__ = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_2569eccd._.js.map