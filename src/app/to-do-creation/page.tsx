"use client"
import React, { useState, useRef, useEffect } from 'react';
import styles from './to-do-creation.module.css';
import StatusIcon from '../../../public/Status.png';
import PriorityIcon from '../../../public/Priority.png';
import DeadlineIcon from '../../../public/Deadline.png';
import DescriptionIcon from '../../../public/Description.png';
import PlusIcon from '../../../public/Plus.png';
import Image from 'next/image';

export default function ToDoCreation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const [isDeadlineFocused, setIsDeadlineFocused] = useState(false);
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
    const [showAddTaskButton, setShowAddTaskButton] = useState(false);

    const statusRef = useRef<HTMLDivElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);
    const deadlineRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const toggleStatusDropdown = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

    const togglePriorityDropdown = () => {
        setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setIsStatusDropdownOpen(false);
    };

    const handlePriorityChange = (newPriority: string) => {
        setPriority(newPriority);
        setIsPriorityDropdownOpen(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Low': return '#0ECC5A';
            case 'Medium': return '#FFA235';
            case 'Urgent': return '#FF6B6B';
            default: return '#C1BDBD';
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
            if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
                setIsPriorityDropdownOpen(false);
            }
            if (deadlineRef.current && !deadlineRef.current.contains(event.target as Node)) {
                setIsDeadlineFocused(false);
            }
            if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
                setIsDescriptionFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const allFieldsFilled = title && status && priority && deadline && description;
        setShowAddTaskButton(allFieldsFilled);
    }, [title, status, priority, deadline, description]);

    const handleAddTask = async () => {
        const taskData = {
            title,
            status,
            priority,
            deadline,
            description,
        };

        try {
            const response = await fetch('http://65.2.9.76:8000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                onClose();
                
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    className={styles.titleInput} 
                    onChange={handleInputChange}
                    value={title}
                    style={{
                        fontFamily: 'Barlow, sans-serif',
                        fontWeight: 600,
                        color: title ? '#000000' : '#CCCCCC',
                        border: 'none',
                        fontSize: '24px',
                        lineHeight: '40px',
                        width: '100%',
                        height: '40px',
                        padding: '0 10px',
                    }}
                />
            </div>
            <div className={styles.statusField} onClick={toggleStatusDropdown} ref={statusRef}>
                <div className={styles.fieldContent}>
                    <Image src={StatusIcon} alt="Status" width={24} height={24} />
                    <span className={`${styles.placeholder} ${styles.centerPlaceholder}`}>
                        <span style={{ color: '#666666' }}>Status:</span> <span style={{ color: status ? '#000000' : '#C1BDBD' }}>{status || "Not Selected"}</span>
                    </span>
                </div>
                {isStatusDropdownOpen && (
                    <div className={styles.statusDropdown}>
                        <div onClick={() => handleStatusChange('To Do')}>To Do</div>
                        <div onClick={() => handleStatusChange('In Progress')}>In Progress</div>
                        <div onClick={() => handleStatusChange('Under Review')}>Under Review</div>
                        <div onClick={() => handleStatusChange('Completed')}>Completed</div>
                    </div>
                )}
            </div>
            <div className={styles.priorityField} onClick={togglePriorityDropdown} ref={priorityRef}>
                <div className={styles.fieldContent}>
                    <Image src={PriorityIcon} alt="Priority" width={24} height={24} />
                    <span className={`${styles.placeholder} ${styles.centerPlaceholder}`}>
                        <span style={{ color: '#666666' }}>Priority:</span> <span style={{ color: getPriorityColor(priority) }}>{priority || "Not Selected"}</span>
                    </span>
                </div>
                {isPriorityDropdownOpen && (
                    <div className={styles.priorityDropdown}>
                        <div onClick={() => handlePriorityChange('Low')} style={{ color: '#0ECC5A' }}>Low</div>
                        <div onClick={() => handlePriorityChange('Medium')} style={{ color: '#FFA235' }}>Medium</div>
                        <div onClick={() => handlePriorityChange('Urgent')} style={{ color: '#FF6B6B' }}>Urgent</div>
                    </div>
                )}
            </div>
            <div className={styles.deadlineField} ref={deadlineRef}>
                <div 
                    className={styles.fieldContent}
                    onClick={() => setIsDeadlineFocused(true)}
                >
                    <Image src={DeadlineIcon} alt="Deadline" width={24} height={24} />
                    <span className={`${styles.placeholder} ${styles.centerPlaceholder}`}>
                        <span style={{ color: '#666666' }}>Deadline:</span> <span style={{ color: deadline ? '#000000' : '#C1BDBD' }}>{deadline || "Not Selected"}</span>
                    </span>
                </div>
                {isDeadlineFocused && (
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        onBlur={() => setIsDeadlineFocused(false)}
                        className={styles.deadlineInput}
                        autoFocus
                    />
                )}
            </div>
            <div className={styles.descriptionField} onClick={() => setIsDescriptionFocused(true)} ref={descriptionRef}>
                <div className={styles.fieldContent}>
                    <Image src={DescriptionIcon} alt="Description" width={24} height={24} />
                    <span className={`${styles.placeholder} ${styles.centerPlaceholder}`}>
                        <span style={{ color: '#666666' }}>Description:</span> <span style={{ color: description ? '#000000' : '#C1BDBD' }}>{description || "Not Selected"}</span>
                    </span>
                </div>
                {isDescriptionFocused && (
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setIsDescriptionFocused(false)}
                        className={styles.descriptionInput}
                        placeholder="Description"
                        autoFocus
                    />
                )}
            </div>
            <div className={styles.customPropertyButton} style={{ marginTop: '32px' }}>
                <Image src={PlusIcon} alt="Add" width={24} height={24} />
                <span>Add custom property</span>
            </div>
            <div className={styles.horizontalLine}></div>
            <p className={styles.dragFileText}>
                Start writing, or drag your own files here.
            </p>
            {showAddTaskButton && (
                <button className={styles.addTaskButton} onClick={handleAddTask}>
                    Add Task
                </button>
            )}
        </div>
    );
}
