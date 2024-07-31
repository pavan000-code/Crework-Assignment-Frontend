'use client';

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import Image from 'next/image'
import styles from './dashboard.module.css'
import SlidingPane from 'react-sliding-pane'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import ToDoCreation from '../to-do-creation/page'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import profileIcon from '../../../public/profile.png'
import frameIcon from '../../../public/Frame.png'
import sunIcon from '../../../public/sun.png'
import nextIcon from '../../../public/next.png'
import frameHomeIcon from '../../../public/FrameHome.png'
import frameBoardsIcon from '../../../public/FrameBoards.png'
import frameSettingsIcon from '../../../public/FrameSettings.png'
import frameTeamsIcon from '../../../public/FrameTeams.png'
import frameAnalyticsIcon from '../../../public/FrameAnalytics.png'
import framePlusIcon from '../../../public/FramePlus.png'
import newTagIcon from '../../../public/NewTag.png'
import shareIcon from '../../../public/Share.png'
import viewIcon from '../../../public/View.png'
import frameSearchIcon from '../../../public/FrameSearch.png'
import calendarIcon from '../../../public/calendarIcon.png'
import automationIcon from '../../../public/automationIcon.png'
import filterIcon from '../../../public/filterIcon.png'
import shareIcon1 from '../../../public/shareIcon.png'
import closeIcon from '../../../public/Close.png'
import maximizeIcon from '../../../public/Maximize.png'
import favoriteIcon from '../../../public/Favorite.png'
import timeIcon from '../../../public/Time.png'

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string;
}

function SortableTask({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.task}>
      <h4 style={{
        fontFamily: 'Inter, sans-serif',
        color: '#606060',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '19.36px'
      }}>{task.title}</h4>
      <p style={{
        backgroundColor: 
          task.priority === 'Low' ? '#0ECC5A' :
          task.priority === 'Medium' ? '#FFA235' :
          task.priority === 'Urgent' ? '#FF6B6B' : 'transparent',
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        color: 'white'
      }}>{task.priority}</p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '8px'
      }}>
        <p>{new Date(task.deadline).toLocaleDateString()}</p>
        <Image 
          src={timeIcon} 
          alt="Time Icon" 
          width={16} 
          height={16} 
          style={{ marginLeft: 'auto' }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [fullname, setFullname] = useState('User')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const storedFullname = localStorage.getItem('fullname')
    if (storedFullname) {
      setFullname(storedFullname)
    }
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://65.2.9.76:8000/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fullname')
    router.push('/login')
  }

  const openPanel = () => setIsPanelOpen(true)
  const closePanel = () => setIsPanelOpen(false)

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t._id === active.id);
        const newIndex = tasks.findIndex((t) => t._id === over.id);
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        
        const newStatus = over.id;
        
        if (newTasks[newIndex].status !== newStatus) {
          newTasks[newIndex] = { ...newTasks[newIndex], status: newStatus };
          updateTaskStatus(newTasks[newIndex]._id, newStatus);
        }

        return newTasks;
      });
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://65.2.9.76:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.userInfo}>
            <Image src={profileIcon} alt="Profile" width={30} height={30} />
            <h2>{fullname}</h2>
          </div>
          <div className={styles.iconContainer}>
            <Image src={frameIcon} alt="Frame"  />
            <Image src={sunIcon} alt="Sun"  />
            <Image src={nextIcon} alt="Next"  />
            <div className={styles.logoutButton}>
            <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <nav>
            <ul>
              <li className={styles.navItem}><Image src={frameHomeIcon} alt="Home" /> Home</li>
              <li className={styles.navItem}><Image src={frameBoardsIcon} alt="Boards" /> Boards</li>
              <li className={styles.navItem}><Image src={frameSettingsIcon} alt="Settings" /> Settings</li>
              <li className={styles.navItem}><Image src={frameTeamsIcon} alt="Teams" /> Teams</li>
              <li className={styles.navItem}><Image src={frameAnalyticsIcon} alt="Analytics" /> Analytics</li>
            </ul>
          </nav>
          <button className={styles.createTask} onClick={openPanel}>
            Create new task
            <Image src={framePlusIcon} alt="Add" />
          </button>
        </div>

        <div className={styles.content}>
          <header>
            <h1>Good morning, {fullname}!</h1>
          </header>

          <div className={styles.featureCards}>
            <div className={styles.card}>
              <Image src={newTagIcon} alt="New Tag" />
              <div className={styles.cardContent}>
                <h3>Introducing tags</h3>
                <p>Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.</p>
              </div>
            </div>
            <div className={styles.card}>
              <Image src={shareIcon} alt="Share" />
              <div className={styles.cardContent}>
                <h3>Share Notes Instantly</h3>
                <p>Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.</p>
              </div>
            </div>
            <div className={styles.card}>
              <Image src={viewIcon} alt="View" />
              <div className={styles.cardContent}>
                <h3>Access Anywhere</h3>
                <p>Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.</p>
              </div>
            </div>
          </div>

          <div className={styles.toolBar}>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search" />
              <Image src={frameSearchIcon} alt="Search" />
            </div>
            <div className={styles.toolBarItems}>
              <p>Calendar View</p>
              <Image src={calendarIcon} alt="Calendar View" />
              <p>Automation</p>
              <Image src={automationIcon} alt="Automation" />
              <p>Filter</p>
              <Image src={filterIcon} alt="Filter" />
              <p>Share</p>
              <Image src={shareIcon1} alt="Share" />
              <button className={styles.createTask1} onClick={openPanel}>
                Create new 
                <Image src={framePlusIcon} alt="Add" />
              </button>
            </div>
          </div>

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.board}>
              {['To Do', 'In Progress', 'Under Review', 'Completed'].map((status) => (
                <div key={status} className={styles.column}>
                  <h3>{status}</h3>
                  <SortableContext
                    id={status}
                    items={tasks.filter(t => t.status === status).map(t => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks
                      .filter(task => task.status === status)
                      .map(task => (
                        <SortableTask key={task._id} task={task} />
                      ))}
                  </SortableContext>
                  <button 
                    style={{
                      backgroundColor: '#3A3A3A',
                      color: '#ffffff',
                      width: '100%',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                    }} 
                    onClick={openPanel}
                  >
                    <span style={{ textAlign: 'left' }}>Add new</span>
                    <Image 
                      src={framePlusIcon} 
                      alt='plus'
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              ))}
            </div>
          </DndContext>
        </div>
      </main>
      <SlidingPane
        isOpen={isPanelOpen}
        onRequestClose={closePanel}
        width="50%"
        hideHeader={true}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
          <div>
            <Image
              src={closeIcon}
              alt="Close"
              width={24}
              height={24}
              onClick={closePanel}
              style={{ cursor: 'pointer', marginRight: '10px' }}
            />
            <Image
              src={maximizeIcon}
              alt="Maximize"
              width={24}
              height={24}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#797979', border: 'none', height: '30px' }}>
              Share
              <Image
                src={shareIcon1}
                alt="Share"
                width={24}
                height={24}
                style={{ marginLeft: '8px' }}
              />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#797979', border: 'none', height: '30px' }}>
              Favorite
              <Image
                src={favoriteIcon}
                alt="Favorite"
                width={24}
                height={24}
                style={{ marginLeft: '8px' }}
              />
            </button>
          </div>
        </div>
        <ToDoCreation isOpen={isPanelOpen} onClose={closePanel} onTaskAdded={fetchTasks} />
      </SlidingPane>
    </div>
  )
}
