import {
    ChevronDown,
    ChevronUp,
    MailMinus,
    Users,
    BriefcaseBusiness,
    PenTool,
    FileClock
} from 'lucide-react';

const SidebarData = [
    {
        title: 'Desprendibles',
        path: '/desprendibles',
        Icon: MailMinus, // Guardamos el componente, no JSX
    },
    {
        title: 'Colaboradores',
        path: '/colaboradores',
        Icon: Users,
        IconClosed: ChevronDown,
        IconOpened: ChevronUp,
        subNav: [
            {
                title: 'Empleados',
                path: '/colaboradores/empleados',
                Icon: BriefcaseBusiness
            },
            {
                title: 'Instructores',
                path: '/colaboradores/instructores',
                Icon: PenTool
            }
        ]
    },
    {
        title: 'Historial',
        path: '/historial',
        Icon: FileClock
    },
];

export default SidebarData;