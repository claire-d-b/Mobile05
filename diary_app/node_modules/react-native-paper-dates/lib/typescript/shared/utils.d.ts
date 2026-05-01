import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';
import Color from 'color';
export declare const supportedOrientations: ('portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right')[];
export type PaperTheme = typeof MD3DarkTheme | typeof DefaultTheme;
export declare function useLatest<T>(value: T): import("react").RefObject<T>;
export declare function useHeaderBackgroundColor(): string;
export declare function useHeaderTextColor(): string;
export declare function useTextColorOnPrimary(): string;
export declare function range(start: number, end: number): number[];
export declare function lightenBy(color: InstanceType<typeof Color>, ratio: number): import("color").ColorInstance;
export declare function darkenBy(color: InstanceType<typeof Color>, ratio: number): import("color").ColorInstance;
//# sourceMappingURL=utils.d.ts.map