// Get references to elements
const getStudentListBtn = document.getElementById('getStudentListBtn');
const attendancePanel = document.getElementById('attendancePanel');
const attendancePanelTitle = document.getElementById('attendancePanelTitle');
const studentListContainer = document.getElementById('studentListContainer');
const attendanceDateInput = document.getElementById('attendanceDate');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const sessionDateDisplay = document.getElementById('sessionDateDisplay');
const markAllPresentCheckbox = document.getElementById('markAllPresent');
const saveChangesBtn = document.getElementById('saveChangesBtn');
const attendanceTakenGoBackBtn = document.getElementById('attendanceTakenGoBackBtn');

// Dropdown references for resetting
const yearDropdown = document.getElementById('year');
const branchDropdown = document.getElementById('branch');
const classDropdown = document.getElementById('class');

// --- Expanded Dummy Student Data ---
// Each student now has year, branch, and class properties
const allStudentsData = [
    // Year FE - INFT
    { id: 'BU/FE/INFT/C1/001', name: 'Alice Smith', year: 'FE', branch: 'INFT', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/INFT/C1/002', name: 'Bob Johnson', year: 'FE', branch: 'INFT', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/INFT/C2/003', name: 'Charlie Brown', year: 'FE', branch: 'INFT', class: 'Class 2', status: 'Not Marked' },
    { id: 'BU/FE/INFT/C2/004', name: 'David Green', year: 'FE', branch: 'INFT', class: 'Class 2', status: 'Not Marked' },

    // Year FE - CS
    { id: 'BU/FE/CS/C1/005', name: 'Eve White', year: 'FE', branch: 'CS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/CS/C1/006', name: 'Frank Black', year: 'FE', branch: 'CS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/CS/C2/007', name: 'Grace Lee', year: 'FE', branch: 'CS', class: 'Class 2', status: 'Not Marked' },

    // Year FE - EXTC
    { id: 'BU/FE/EXTC/C1/008', name: 'Harry Potter', year: 'FE', branch: 'EXTC', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/EXTC/C2/009', name: 'Ivy Queen', year: 'FE', branch: 'EXTC', class: 'Class 2', status: 'Not Marked' },

    // Year FE - ELECTRICAL
    { id: 'BU/FE/ELECTRICAL/C1/010', name: 'Jack Sparrow', year: 'FE', branch: 'ELECTRICAL', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/ELECTRICAL/C2/011', name: 'Kelly Clarkson', year: 'FE', branch: 'ELECTRICAL', class: 'Class 2', status: 'Not Marked' },

    // Year FE - ECS
    { id: 'BU/FE/ECS/C1/012', name: 'Liam Neeson', year: 'FE', branch: 'ECS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/FE/ECS/C2/013', name: 'Mia Khalifa', year: 'FE', branch: 'ECS', class: 'Class 2', status: 'Not Marked' },

    // Year SE - INFT
    { id: 'BU/SE/INFT/C1/014', name: 'Noah Centineo', year: 'SE', branch: 'INFT', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/SE/INFT/C2/015', name: 'Olivia Rodrigo', year: 'SE', branch: 'INFT', class: 'Class 2', status: 'Not Marked' },

    // Year SE - CS
    { id: 'BU/SE/CS/C1/016', name: 'Peter Parker', year: 'SE', branch: 'CS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/SE/CS/C2/017', name: 'Quinn Fabray', year: 'SE', branch: 'CS', class: 'Class 2', status: 'Not Marked' },

    // Year SE - EXTC
    { id: 'BU/SE/EXTC/C1/018', name: 'Rachel Green', year: 'SE', branch: 'EXTC', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/SE/EXTC/C2/019', name: 'Steve Rogers', year: 'SE', branch: 'EXTC', class: 'Class 2', status: 'Not Marked' },

    // Year SE - ELECTRICAL
    { id: 'BU/SE/ELECTRICAL/C1/020', name: 'Tina Fey', year: 'SE', branch: 'ELECTRICAL', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/SE/ELECTRICAL/C2/021', name: 'Uma Thurman', year: 'SE', branch: 'ELECTRICAL', class: 'Class 2', status: 'Not Marked' },

    // Year SE - ECS
    { id: 'BU/SE/ECS/C1/022', name: 'Victor Stone', year: 'SE', branch: 'ECS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/SE/ECS/C2/023', name: 'Wendy Darling', year: 'SE', branch: 'ECS', class: 'Class 2', status: 'Not Marked' },

    // Year TE - INFT
    { id: 'BU/TE/INFT/C1/024', name: 'Xavier Woods', year: 'TE', branch: 'INFT', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/TE/INFT/C2/025', name: 'Yara Shahidi', year: 'TE', branch: 'INFT', class: 'Class 2', status: 'Not Marked' },

    // Year TE - CS
    { id: 'BU/TE/CS/C1/026', name: 'Zack Morris', year: 'TE', branch: 'CS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/TE/CS/C2/027', name: 'Amy Adams', year: 'TE', branch: 'CS', class: 'Class 2', status: 'Not Marked' },

    // Year TE - EXTC
    { id: 'BU/TE/EXTC/C1/028', name: 'Ben Affleck', year: 'TE', branch: 'EXTC', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/TE/EXTC/C2/029', name: 'Chloe Grace', year: 'TE', branch: 'EXTC', class: 'Class 2', status: 'Not Marked' },

    // Year TE - ELECTRICAL
    { id: 'BU/TE/ELECTRICAL/C1/030', name: 'Daniel Craig', year: 'TE', branch: 'ELECTRICAL', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/TE/ELECTRICAL/C2/031', name: 'Emma Stone', year: 'TE', branch: 'ELECTRICAL', class: 'Class 2', status: 'Not Marked' },

    // Year TE - ECS
    { id: 'BU/TE/ECS/C1/032', name: 'Finn Wolfhard', year: 'TE', branch: 'ECS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/TE/ECS/C2/033', name: 'Gigi Hadid', year: 'TE', branch: 'ECS', class: 'Class 2', status: 'Not Marked' },

    // Year BE - INFT
    { id: 'BU/BE/INFT/C1/034', name: 'Hugh Jackman', year: 'BE', branch: 'INFT', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/BE/INFT/C2/035', name: 'Isla Fisher', year: 'BE', branch: 'INFT', class: 'Class 2', status: 'Not Marked' },

    // Year BE - CS
    { id: 'BU/BE/CS/C1/036', name: 'Jake Gyllenhaal', year: 'BE', branch: 'CS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/BE/CS/C2/037', name: 'Kate Winslet', year: 'BE', branch: 'CS', class: 'Class 2', status: 'Not Marked' },

    // Year BE - EXTC
    { id: 'BU/BE/EXTC/C1/038', name: 'Leo DiCaprio', year: 'BE', branch: 'EXTC', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/BE/EXTC/C2/039', name: 'Meryl Streep', year: 'BE', branch: 'EXTC', class: 'Class 2', status: 'Not Marked' },

    // Year BE - ELECTRICAL
    { id: 'BU/BE/ELECTRICAL/C1/040', name: 'Natalie Portman', year: 'BE', branch: 'ELECTRICAL', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/BE/ELECTRICAL/C2/041', name: 'Owen Wilson', year: 'BE', branch: 'ELECTRICAL', class: 'Class 2', status: 'Not Marked' },

    // Year BE - ECS
    { id: 'BU/BE/ECS/C1/042', name: 'Penelope Cruz', year: 'BE', branch: 'ECS', class: 'Class 1', status: 'Not Marked' },
    { id: 'BU/BE/ECS/C2/043', name: 'Quentin Tarantino', year: 'BE', branch: 'ECS', class: 'Class 2', status: 'Not Marked' },
];

// currentStudents will be filtered and hold the current session's attendance
let currentStudents = []; 
// This variable will store the key for localStorage for the currently loaded class
let currentLocalStorageKey = '';

// Function to render student list
function renderStudentList(students) {
    studentListContainer.innerHTML = ''; // Clear previous list
    if (students.length === 0) {
        studentListContainer.innerHTML = '<p class="text-center text-gray-500 py-4">No students found for the selected criteria.</p>';
        return;
    }
    students.forEach(student => {
        const studentRow = document.createElement('div');
        studentRow.className = 'grid grid-cols-3 gap-4 py-3 px-4 items-center';
        studentRow.dataset.studentId = student.id; // Store student ID on the row

        // Determine initial status styling for the status badge
        let statusBadgeClass = 'bg-gray-200 text-gray-700'; // Default 'Not Marked'
        if (student.status === 'Present') {
            statusBadgeClass = 'bg-green-100 text-green-700';
        } else if (student.status === 'Absent') {
            statusBadgeClass = 'bg-red-100 text-red-700';
        } else if (student.status === 'Excused') {
            statusBadgeClass = 'bg-yellow-100 text-yellow-700';
        }

        studentRow.innerHTML = `
            <div>
                <p class="font-medium text-gray-900">${student.name} <span class="text-sm text-gray-500">(${student.id})</span></p>
            </div>
            <div>
                <span class="status-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}">
                            ${student.status}
                        </span>
                    </div>
                    <div class="flex space-x-2">
                        <button data-action="present" class="action-btn flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200">
                            <i class="ph-fill ph-check text-lg mr-1"></i> Present
                        </button>
                        <button data-action="absent" class="action-btn flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200">
                            <i class="ph-fill ph-x text-lg mr-1"></i> Absent
                        </button>
                        <button data-action="excused" class="action-btn flex items-center bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors duration-200">
                            <i class="ph-fill ph-info text-lg mr-1"></i> Excused
                        </button>
                    </div>
                `;
                studentListContainer.appendChild(studentRow);
            });
        }

        // Function to update a student's status
        function updateStudentStatus(studentId, newStatus) {
            const studentIndex = currentStudents.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                currentStudents[studentIndex].status = newStatus;
                renderStudentList(currentStudents); // Re-render the list to update UI
                saveAttendanceToLocalStorage(); // Save changes immediately after status update
            }
        }

        // Function to save current attendance to localStorage
        function saveAttendanceToLocalStorage() {
            if (currentLocalStorageKey && currentStudents.length > 0) {
                try {
                    localStorage.setItem(currentLocalStorageKey, JSON.stringify(currentStudents));
                    console.log(`Attendance saved to localStorage for ${currentLocalStorageKey}`);
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                    displayMessage("Error saving attendance locally.", "error");
                }
            }
        }

        // Event listener for "Get Student List" button
        getStudentListBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button behavior
            console.log("Get Student List button clicked."); // Debug log

            const selectedYear = yearDropdown.value;
            const selectedBranch = branchDropdown.value;
            const selectedClass = classDropdown.value;

            console.log("Selected values:", { selectedYear, selectedBranch, selectedClass }); // Debug log

            if (!selectedYear || !selectedBranch || !selectedClass) {
                displayMessage("Please select a value for all fields.", "error");
                console.log("Validation failed: All fields not selected."); // Debug log
                return;
            }

            // --- Show Loading State ---
            getStudentListBtn.disabled = true; // Disable button
            getStudentListBtn.innerHTML = '<i class="ph-fill ph-circle-notch animate-spin text-lg mr-2"></i> Loading...'; // Add spinner and text
            getStudentListBtn.classList.add('cursor-not-allowed', 'opacity-70', 'flex', 'items-center', 'justify-center'); // Add flex and justify for centering spinner
            getStudentListBtn.style.width = 'auto'; // Ensure width adjusts to content

            setTimeout(() => { // Simulate loading time
                // --- Hide Loading State ---
                getStudentListBtn.disabled = false; // Re-enable button
                getStudentListBtn.innerHTML = 'Get Student List'; // Restore original text
                getStudentListBtn.classList.remove('cursor-not-allowed', 'opacity-70', 'flex', 'items-center', 'justify-center'); // Remove disabled styling
                getStudentListBtn.style.width = ''; // Reset width to auto or previous value

                console.log("Validation passed. Proceeding to show attendance panel."); // Debug log

                // --- Determine localStorage key for this selection ---
                currentLocalStorageKey = `attendance_${selectedYear}_${selectedBranch}_${selectedClass}`;
                console.log("LocalStorage key:", currentLocalStorageKey);

                // --- Try to load attendance from localStorage ---
                const savedAttendance = localStorage.getItem(currentLocalStorageKey);
                if (savedAttendance) {
                    try {
                        currentStudents = JSON.parse(savedAttendance);
                        console.log("Loaded attendance from localStorage.");
                    } catch (e) {
                        console.error("Error parsing saved attendance from localStorage:", e);
                        currentStudents = []; // Fallback to empty if parsing fails
                    }
                } else {
                    // If no saved attendance, filter from allStudentsData and set to 'Not Marked'
                    currentStudents = allStudentsData.filter(student =>
                        student.year === selectedYear &&
                        student.branch === selectedBranch &&
                        student.class === selectedClass
                    ).map(student => ({ ...student, status: 'Not Marked' })); // Reset status for filtered students
                    console.log("No saved attendance found. Filtering and defaulting to 'Not Marked'.");
                }
                
                // If after loading/filtering, currentStudents is empty, display message
                if (currentStudents.length === 0 && !savedAttendance) {
                    displayMessage("No students found for this selection. Please check data or add students.", "info");
                }


                // Update panel title
                attendancePanelTitle.textContent = `Attendance for Class ${selectedClass.toUpperCase()} - Branch ${selectedBranch.toUpperCase()} - Year ${selectedYear}`;
                console.log("Panel title updated."); // Debug log

                // Set current date and time as defaults
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const dd = String(today.getDate()).padStart(2, '0');
                const formattedDate = `${yyyy}-${mm}-${dd}`;
                
                attendanceDateInput.value = formattedDate;
                sessionDateDisplay.textContent = new Date(formattedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                console.log("Date and time inputs set."); // Debug log

                // Set default start and end times (e.g., 9:00 AM - 10:00 AM)
                startTimeInput.value = '09:00';
                endTimeInput.value = '10:00';

                // Show the attendance panel
                attendancePanel.classList.remove('hidden');
                console.log("Attendance panel 'hidden' class removed."); // Debug log

                // Render the filtered/loaded student list
                renderStudentList(currentStudents);
                // Check Mark All Present checkbox state based on currentStudents (if all are present)
                markAllPresentCheckbox.checked = currentStudents.length > 0 && currentStudents.every(s => s.status === 'Present');
                console.log("Student list rendered."); // Debug log
            }, 500); // Reduced loading time to 0.5 seconds
        });

        // Event listener for individual action buttons (Present, Absent, Excused)
        studentListContainer.addEventListener('click', function(event) {
            const targetButton = event.target.closest('.action-btn');
            if (targetButton) {
                const studentRow = targetButton.closest('[data-student-id]');
                const studentId = studentRow.dataset.studentId;
                const action = targetButton.dataset.action;
                
                // Update status
                updateStudentStatus(studentId, action.charAt(0).toUpperCase() + action.slice(1)); // Capitalize first letter
                console.log(`Student ${studentId} status updated to ${action}.`); // Debug log
            }
        });

        // Event listener for "Mark All Present" checkbox
        markAllPresentCheckbox.addEventListener('change', function() {
            const newStatus = this.checked ? 'Present' : 'Not Marked';
            currentStudents.forEach(student => {
                student.status = newStatus;
            });
            renderStudentList(currentStudents); // Re-render to reflect changes
            saveAttendanceToLocalStorage(); // Save changes immediately
            console.log(`Mark All Present checkbox changed. New status: ${newStatus}`); // Debug log
        });

        // Event listener for "Save Changes" button
        saveChangesBtn.addEventListener('click', function() {
            saveAttendanceToLocalStorage(); // Explicitly save when Save Changes is clicked
            console.log("Saving attendance changes:", currentStudents); // Debug log
            displayMessage("Attendance saved successfully!", "info");
        });

        // Event listener for date input change to update session date display
        attendanceDateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            sessionDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            console.log("Attendance date changed to:", this.value); // Debug log
        });

        // Updated Event listener for "Attendance Taken / Go Back" button
        attendanceTakenGoBackBtn.addEventListener('click', function() {
            console.log("Attendance Taken / Go Back button clicked."); // Debug log

            saveAttendanceToLocalStorage(); // Ensure latest changes are saved before going back

            displayMessage("Attendance has been recorded.", "info"); // Updated message

            // Clear the displayed list (don't reset currentStudents here, as it's saved)
            studentListContainer.innerHTML = ''; 

            // Hide the attendance panel
            attendancePanel.classList.add('hidden');
            console.log("Attendance panel hidden."); // Debug log

            // Reset dropdowns in the main form
            yearDropdown.value = '';
            branchDropdown.value = '';
            classDropdown.value = '';
            console.log("Main form dropdowns reset."); // Debug log
            
            // Clear the current localStorage key to prevent accidental loading for a new session
            currentLocalStorageKey = '';
        });


        // Function to display messages to the user (instead of alert())
        function displayMessage(message, type = 'info') {
            const messageBox = document.createElement('div');
            messageBox.textContent = message;
            messageBox.className = `p-3 mt-4 rounded-lg text-white text-center ${type === 'error' ? 'bg-red-500' : 'bg-blue-500'} absolute top-4 right-4 z-50 shadow-lg`;
            
            document.body.appendChild(messageBox); 
            console.log(`Displaying message: ${message} (${type})`); // Debug log

            setTimeout(() => {
                messageBox.remove();
                console.log("Message removed."); // Debug log
            }, 3000);
        }

