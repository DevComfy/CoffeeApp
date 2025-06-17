// script.js

// ...existing code...

function showMeetingDetails(meetingId) {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const details = `
        Meeting Time: ${meeting.time}
        Department: ${meeting.department}
        Attendees: ${meeting.attendees}
        Orders: ${JSON.stringify(meeting.orders, null, 2)}
    `;
    alert(details); // You might want to use a modal instead
}

function restoreCancelledOrder(meetingId) {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    meeting.cancelled = false;
    saveMeetings();
    displayMeetings();
}

function saveMeetings() {
    fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetings)
    });
}

// Modify the displayMeetings function to include view and restore buttons
function displayMeetings() {
    // ...existing code...
    meetings.forEach(meeting => {
        const row = document.createElement('tr');
        row.innerHTML = `
            // ...existing code...
            <td>
                <button onclick="showMeetingDetails('${meeting.id}')">View</button>
                ${meeting.cancelled ? 
                    `<button onclick="restoreCancelledOrder('${meeting.id}')">Restore</button>` : 
                    ''
                }
            </td>
        `;
        // ...existing code...
    });
    // ...existing code...
}