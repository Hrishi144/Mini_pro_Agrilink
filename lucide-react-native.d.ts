declare module 'lucide-react-native' {
    import { ComponentType } from 'react';

    export interface LucideProps {
        size?: number;
        color?: string;
        strokeWidth?: number;
        absoluteStrokeWidth?: boolean;
        [key: string]: any;
    }

    export const Camera: ComponentType<LucideProps>;
    export const ClipboardList: ComponentType<LucideProps>;
    export const LayoutGrid: ComponentType<LucideProps>;
    export const TrendingUp: ComponentType<LucideProps>;
    export const User: ComponentType<LucideProps>;
    export const X: ComponentType<LucideProps>;
    export const RotateCcw: ComponentType<LucideProps>;
    export const Sprout: ComponentType<LucideProps>;
    export const Sun: ComponentType<LucideProps>;
    export const Droplet: ComponentType<LucideProps>;
    export const ShoppingCart: ComponentType<LucideProps>;
    export const AlertTriangle: ComponentType<LucideProps>;
    export const Package: ComponentType<LucideProps>;
    export const Plus: ComponentType<LucideProps>;
    export const RefreshCw: ComponentType<LucideProps>;
    export const BarChart: ComponentType<LucideProps>;
    export const DollarSign: ComponentType<LucideProps>;
    export const Eye: ComponentType<LucideProps>;
    export const LogOut: ComponentType<LucideProps>;
    export const Mail: ComponentType<LucideProps>;
    export const Settings: ComponentType<LucideProps>;
    export const Bell: ComponentType<LucideProps>;
    export const Shield: ComponentType<LucideProps>;
}
