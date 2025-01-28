import { ChevronDown, ChevronUp, MailMinus, Users,BriefcaseBusiness, PenTool, FileClock} from 'lucide-react'

const SidebarData = [
    {
        title: 'Desprendibles',
        path: '/desprendibles',
        icon: <MailMinus />,
    },
    {
        title: 'Colaboradores',
        path: '/colaboradores',
        icon: <Users />,        
        iconClosed: <ChevronDown />,
        iconOpened: <ChevronUp />,
        subNav:[
            { 
                title: 'Empleados',
                path: '/colaboradores/empleados',
                icon:<BriefcaseBusiness />
            },
            { 
                title: 'Instructores',
                path: '/colaboradores/instructores',
                icon:<PenTool />
            }
        ]
    },
    {
        title: 'Historial',
        path: '/historial',
        icon: <FileClock />
    },
];

export default SidebarData;