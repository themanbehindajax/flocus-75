import { useAppStore } from './store';
import { 
  demoTasks, 
  demoProjects, 
  demoTags, 
  demoPomodoroSessions, 
  demoDailyPriorities, 
  demoProfile, 
  demoCalendarEvents 
} from './demoData';

export const loadDemoData = () => {
  const store = useAppStore.getState();
  
  // Adicionar dados demo sem substituir dados existentes
  const newTasks = [...store.tasks, ...demoTasks.filter(task => 
    !store.tasks.some(existing => existing.id === task.id)
  )];
  
  const newProjects = [...store.projects, ...demoProjects.filter(project =>
    !store.projects.some(existing => existing.id === project.id)
  )];
  
  const newTags = [...store.tags, ...demoTags.filter(tag =>
    !store.tags.some(existing => existing.id === tag.id)
  )];
  
  const newPomodoroSessions = [...store.pomodoroSessions, ...demoPomodoroSessions.filter(session =>
    !store.pomodoroSessions.some(existing => existing.id === session.id)
  )];
  
  const newDailyPriorities = [...store.dailyPriorities, ...demoDailyPriorities.filter(priority =>
    !store.dailyPriorities.some(existing => existing.id === priority.id)
  )];
  
  const newCalendarEvents = [...store.calendarEvents, ...demoCalendarEvents.filter(event =>
    !store.calendarEvents.some(existing => existing.id === event.id)
  )];
  
  // Atualizar o store com os novos dados
  useAppStore.setState({
    tasks: newTasks,
    projects: newProjects,
    tags: newTags,
    pomodoroSessions: newPomodoroSessions,
    dailyPriorities: newDailyPriorities,
    calendarEvents: newCalendarEvents,
    // Só atualizar profile se ainda for o padrão
    profile: store.profile.name === 'Usuário' && store.profile.points === 0 ? demoProfile : store.profile
  });
  
  console.log('✅ Dados demo carregados com sucesso!');
};

export const clearAllData = () => {
  useAppStore.setState({
    tasks: [],
    projects: [],
    tags: [],
    pomodoroSessions: [],
    dailyPriorities: [],
    calendarEvents: [],
    profile: {
      name: 'Usuário',
      points: 0,
      streak: 0,
      lastActivity: new Date().toISOString(),
      totalTasksCompleted: 0,
      totalPomodorosCompleted: 0
    }
  });
  
  console.log('🗑️ Todos os dados foram limpos!');
};