import { Task, Project, Tag, PomodoroSession, DailyPriority, UserProfile, CalendarEvent } from './types';

// Demo Tags
export const demoTags: Tag[] = [
  { id: '1', name: 'Trabalho', color: '#3B82F6' },
  { id: '2', name: 'Pessoal', color: '#10B981' },
  { id: '3', name: 'Urgente', color: '#EF4444' },
  { id: '4', name: 'Estudos', color: '#8B5CF6' },
  { id: '5', name: 'Saúde', color: '#F59E0B' },
  { id: '6', name: 'Casa', color: '#06B6D4' }
];

// Demo Projects
export const demoProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Redesenhar o website da empresa com nova identidade visual',
    color: '#3B82F6',
    goal: 'Aumentar conversões em 30%',
    dueDate: '2024-08-15',
    tasks: ['task-1', 'task-2', 'task-3'],
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-19T14:30:00Z'
  },
  {
    id: 'proj-2',
    name: 'App Mobile',
    description: 'Desenvolvimento do aplicativo mobile da startup',
    color: '#10B981',
    goal: 'Lançar MVP até dezembro',
    dueDate: '2024-12-01',
    tasks: ['task-4', 'task-5'],
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-07-19T16:15:00Z'
  },
  {
    id: 'proj-3',
    name: 'Curso React',
    description: 'Estudar React e TypeScript para melhorar skills',
    color: '#8B5CF6',
    goal: 'Completar certificação',
    dueDate: '2024-09-30',
    tasks: ['task-6', 'task-7', 'task-8'],
    createdAt: '2024-07-05T11:30:00Z',
    updatedAt: '2024-07-19T12:45:00Z'
  }
];

// Demo Tasks
export const demoTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Criar wireframes das páginas principais',
    description: 'Definir layout e estrutura das páginas home, sobre e contato',
    priority: 'alta',
    status: 'done',
    dueDate: '2024-07-20',
    projectId: 'proj-1',
    tags: ['1', '3'],
    completed: true,
    createdAt: '2024-07-01T10:15:00Z',
    updatedAt: '2024-07-18T15:30:00Z',
    subtasks: [
      { id: 'sub-1', title: 'Wireframe da homepage', completed: true },
      { id: 'sub-2', title: 'Wireframe da página sobre', completed: true },
      { id: 'sub-3', title: 'Wireframe da página contato', completed: true }
    ]
  },
  {
    id: 'task-2',
    title: 'Implementar design system',
    description: 'Criar componentes reutilizáveis seguindo o design system',
    priority: 'alta',
    status: 'doing',
    dueDate: '2024-07-25',
    projectId: 'proj-1',
    tags: ['1'],
    completed: false,
    createdAt: '2024-07-05T14:20:00Z',
    updatedAt: '2024-07-19T09:15:00Z',
    subtasks: [
      { id: 'sub-4', title: 'Definir paleta de cores', completed: true },
      { id: 'sub-5', title: 'Criar componentes básicos', completed: false },
      { id: 'sub-6', title: 'Documentar componentes', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Desenvolver páginas responsivas',
    description: 'Implementar todas as páginas com design responsivo',
    priority: 'media',
    status: 'todo',
    dueDate: '2024-08-10',
    projectId: 'proj-1',
    tags: ['1'],
    completed: false,
    createdAt: '2024-07-10T16:30:00Z',
    updatedAt: '2024-07-19T11:20:00Z',
    subtasks: []
  },
  {
    id: 'task-4',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Setup inicial do projeto React Native',
    priority: 'alta',
    status: 'done',
    dueDate: '2024-07-22',
    projectId: 'proj-2',
    tags: ['1', '4'],
    completed: true,
    createdAt: '2024-06-20T08:45:00Z',
    updatedAt: '2024-07-15T10:30:00Z',
    subtasks: [
      { id: 'sub-7', title: 'Instalar React Native CLI', completed: true },
      { id: 'sub-8', title: 'Configurar ESLint e Prettier', completed: true }
    ]
  },
  {
    id: 'task-5',
    title: 'Implementar autenticação',
    description: 'Sistema de login e registro de usuários',
    priority: 'alta',
    status: 'doing',
    dueDate: '2024-07-28',
    projectId: 'proj-2',
    tags: ['1', '3'],
    completed: false,
    createdAt: '2024-07-08T13:15:00Z',
    updatedAt: '2024-07-19T14:45:00Z',
    subtasks: [
      { id: 'sub-9', title: 'Tela de login', completed: true },
      { id: 'sub-10', title: 'Tela de registro', completed: false },
      { id: 'sub-11', title: 'Integração com API', completed: false }
    ]
  },
  {
    id: 'task-6',
    title: 'Estudar React Hooks',
    description: 'Aprender useState, useEffect e hooks customizados',
    priority: 'media',
    status: 'done',
    dueDate: '2024-07-30',
    projectId: 'proj-3',
    tags: ['4'],
    completed: true,
    createdAt: '2024-07-05T19:20:00Z',
    updatedAt: '2024-07-16T20:15:00Z',
    subtasks: []
  },
  {
    id: 'task-7',
    title: 'Praticar TypeScript',
    description: 'Exercícios práticos de TypeScript com React',
    priority: 'media',
    status: 'doing',
    dueDate: '2024-08-05',
    projectId: 'proj-3',
    tags: ['4'],
    completed: false,
    createdAt: '2024-07-12T17:45:00Z',
    updatedAt: '2024-07-19T18:30:00Z',
    subtasks: [
      { id: 'sub-12', title: 'Tipos básicos', completed: true },
      { id: 'sub-13', title: 'Interfaces e types', completed: false },
      { id: 'sub-14', title: 'Generics', completed: false }
    ]
  },
  {
    id: 'task-8',
    title: 'Fazer exercícios de React',
    description: 'Completar 20 exercícios práticos no freeCodeCamp',
    priority: 'baixa',
    status: 'todo',
    dueDate: '2024-08-15',
    projectId: 'proj-3',
    tags: ['4'],
    completed: false,
    createdAt: '2024-07-18T21:10:00Z',
    updatedAt: '2024-07-19T21:10:00Z',
    subtasks: []
  },
  {
    id: 'task-9',
    title: 'Exercitar-se pela manhã',
    description: 'Fazer 30 minutos de exercício todos os dias',
    priority: 'media',
    status: 'doing',
    tags: ['2', '5'],
    completed: false,
    createdAt: '2024-07-01T06:00:00Z',
    updatedAt: '2024-07-19T07:30:00Z',
    subtasks: [],
    isQuick: true
  },
  {
    id: 'task-10',
    title: 'Limpar a casa',
    description: 'Organizar todos os cômodos da casa',
    priority: 'baixa',
    status: 'todo',
    dueDate: '2024-07-21',
    tags: ['2', '6'],
    completed: false,
    createdAt: '2024-07-19T14:20:00Z',
    updatedAt: '2024-07-19T14:20:00Z',
    subtasks: [
      { id: 'sub-15', title: 'Quarto', completed: false },
      { id: 'sub-16', title: 'Sala', completed: false },
      { id: 'sub-17', title: 'Cozinha', completed: false }
    ]
  }
];

// Demo Pomodoro Sessions
export const demoPomodoroSessions: PomodoroSession[] = [
  {
    id: 'pomo-1',
    startTime: '2024-07-19T09:00:00Z',
    endTime: '2024-07-19T09:25:00Z',
    taskId: 'task-2',
    projectId: 'proj-1',
    completed: true,
    duration: 25
  },
  {
    id: 'pomo-2',
    startTime: '2024-07-19T09:35:00Z',
    endTime: '2024-07-19T10:00:00Z',
    taskId: 'task-2',
    projectId: 'proj-1',
    completed: true,
    duration: 25
  },
  {
    id: 'pomo-3',
    startTime: '2024-07-19T14:15:00Z',
    endTime: '2024-07-19T14:40:00Z',
    taskId: 'task-5',
    projectId: 'proj-2',
    completed: true,
    duration: 25
  },
  {
    id: 'pomo-4',
    startTime: '2024-07-18T16:30:00Z',
    endTime: '2024-07-18T16:55:00Z',
    taskId: 'task-7',
    projectId: 'proj-3',
    completed: true,
    duration: 25
  },
  {
    id: 'pomo-5',
    startTime: '2024-07-18T10:00:00Z',
    endTime: '2024-07-18T10:25:00Z',
    taskId: 'task-1',
    projectId: 'proj-1',
    completed: true,
    duration: 25
  }
];

// Demo Daily Priorities
export const demoDailyPriorities: DailyPriority[] = [
  {
    id: 'daily-1',
    date: '2024-07-19',
    taskIds: ['task-2', 'task-5', 'task-9']
  },
  {
    id: 'daily-2',
    date: '2024-07-18',
    taskIds: ['task-1', 'task-7', 'task-9']
  }
];

// Demo User Profile
export const demoProfile: UserProfile = {
  name: 'João Silva',
  avatar: undefined,
  points: 180,
  streak: 5,
  lastActivity: '2024-07-19T16:30:00Z',
  totalTasksCompleted: 12,
  totalPomodorosCompleted: 8
};

// Demo Calendar Events
export const demoCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Reunião de projeto',
    description: 'Discussão sobre progresso do website redesign',
    startDate: '2024-07-22T14:00:00Z',
    endDate: '2024-07-22T15:00:00Z',
    allDay: false,
    repeat: 'none',
    reminder: 15,
    color: '#3B82F6'
  },
  {
    id: 'cal-2',
    title: 'Exercícios matinais',
    description: 'Rotina de exercícios diários',
    startDate: '2024-07-20T07:00:00Z',
    endDate: '2024-07-20T07:30:00Z',
    allDay: false,
    repeat: 'daily',
    reminder: 10,
    color: '#10B981'
  },
  {
    id: 'cal-3',
    title: 'Deadline Website',
    description: 'Entrega final do projeto de redesign',
    startDate: '2024-08-15T00:00:00Z',
    allDay: true,
    repeat: 'none',
    reminder: 1440,
    color: '#EF4444'
  }
];