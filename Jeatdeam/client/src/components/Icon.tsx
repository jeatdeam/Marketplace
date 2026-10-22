import type { SVGProps } from 'react';

import { iconPaths, type IconName } from './iconPaths';

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    'data-menu-opener'?: boolean;
}

export default function Icon({ name, fill = '#000000', ...props }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fill} {...props}>
            <path d={iconPaths[name]} />
        </svg>
    );
}
