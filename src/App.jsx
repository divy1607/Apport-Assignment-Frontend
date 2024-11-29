import React, { useState, useEffect } from "react";
import add from './assets/add.svg';
import dots from './assets/3dot.svg';
import backlog from './assets/Backlog.svg';
import cancel from './assets/Cancelled.svg';
import display from './assets/Display.svg';
import done from './assets/Done.svg';
import down from './assets/down.svg';
import high from './assets/highp.svg';
import progress from './assets/in-progress.svg';
import low from './assets/lowp.svg';
import med from './assets/medp.svg';
import no from './assets/No-priority.svg';
import todo from './assets/To-do.svg';
import urgcolor from './assets/urgcolor.svg';
import urggrey from './assets/urggrey.svg';

const priorityLabels = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority'
};

// Mapping group types to icons
const groupIcons = {
  "priority": urgcolor, // or any default icon for priority grouping
  "status": backlog,    // icon for status
  "user": high,         // icon for user grouping
};

// Mapping priorities to SVG icons
const priorityIcons = {
  4: urgcolor, // Urgent
  3: high,     // High
  2: med,      // Medium
  1: low,      // Low
  0: no,       // No priority
};

const priorityyIcons = {
  "Urgent": urgcolor, // Urgent
  "High": high,     // High
  "Medium": med,      // Medium
  "Low": low,      // Low
  "No priority": no,       // No priority
};

// Mapping statuses to SVG icons
const statusIcons = {
  "Backlog": backlog,
  "Cancelled": cancel,
  "Done": done,
  "In progress": progress,
  "Todo": todo,
};

// TicketCard Component
const TicketCard = ({ ticket, users }) => {
  const user = users.find(user => user.id === ticket.userId);
  const userName = user ? user.name : "Unknown User";

  // Priority mapping schema
  const priorityLabels = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No priority'
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px'
    }}>
      <div style={{
        fontWeight: 'bold',
        color: '#444',
        fontSize: '14px',
      }}>
        {ticket.id}
      </div>
      <div style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
      }}>
        <img src={statusIcons[ticket.status]} alt="" style={{ marginTop: '8px', marginRight: '8px' }} />
        {ticket.title}
      </div>
      <div style={{
        display: 'flex',
        gap: '5px',
      }}>
        <img src={priorityIcons[ticket.priority]} alt="" style={{ marginTop: '8px', marginRight: '8px' }} />

        {ticket.tag.map((tag, index) => (
          <span key={index} style={{
            borderColor: '#d3d3d3',
            padding: '8px',
            borderRadius: '5px',
            fontSize: '12px',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// Sorting logic
const sortTicketsInGroup = (groupedTickets, sortOption) => {
  return Object.keys(groupedTickets).reduce((sortedGroups, groupKey) => {
    const sortedGroup = groupedTickets[groupKey].sort((a, b) => {
      if (sortOption === "priority") {
        return b.priority - a.priority; // Sort by priority (desc)
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title); // Sort by title (alphabetical)
      }
      return 0; // Default, if no sorting option is selected
    });
    sortedGroups[groupKey] = sortedGroup;
    return sortedGroups;
  }, {});
};

const groupTickets = (tickets, grouping, users) => {
  return tickets.reduce((acc, ticket) => {
    let groupKey = ticket[grouping];
    if (grouping === "user") {
      const user = users.find(user => user.id === ticket.userId);
      groupKey = user ? user.name : "Unknown User";
    } else if (grouping === "priority") {
      groupKey = priorityLabels[ticket.priority];
    }
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(ticket);
    return acc;
  }, {});
};

// Main App Component
const App = () => {
  const [tickets, setTickets] = useState([]);
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [sortOption, setSortOption] = useState("priority");

  // Toggle the dropdown visibility when the button is clicked
  const toggleDisplayOptions = () => {
    setDisplayOptionsVisible((prev) => !prev);
  };

  // Fetch tickets and users from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const data = await response.json();
        if (Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          console.error("Invalid ticket data");
        }

        if (Array.isArray(data.users)) {
          setUsers(data.users); // Store the users data
        } else {
          console.error("Invalid users data");
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // Group and sort the tickets
  const groupAndSortTickets = (tickets, grouping, sortOption, users) => {
    // First, group the tickets by the selected grouping option
    const groupedTickets = groupTickets(tickets, grouping, users);

    // Then, sort each group individually based on the selected sorting option
    return sortTicketsInGroup(groupedTickets, sortOption);
  };

  // Get the grouped and sorted tickets
  const groupedAndSortedTickets = groupAndSortTickets(tickets, grouping, sortOption, users);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        position: 'relative', // Needed for absolute positioning of the dropdown
      }}>
        {/* Main Display dropdown */}
        <div>
          <button
            onClick={toggleDisplayOptions}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '200px', // Adjust the width as needed
            }}
          >
            <img src={display} alt="" style={{ marginRight: '8px' }} />
            <span>Display</span>
            <span style={{ marginLeft: 'auto' }}>
              {displayOptionsVisible ? <img src={down} alt="" /> : <img src={down} />} {/* Change the icon based on the visibility */}
            </span>
          </button>

          {/* Display options (Group By and Sort By) */}
          {displayOptionsVisible && (
            <div style={{
              position: 'absolute',
              top: '40px', // Adjust this to place it next to the button
              left: '0', // Align it to the left of the button
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              width: '250px',
              zIndex: 10, // Ensure the dropdown appears above other elements
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {/* Grouping Dropdown */}
                <div>
                  <label htmlFor="grouping">Group By: </label>
                  <select
                    id="grouping"
                    value={grouping}
                    onChange={(e) => setGrouping(e.target.value)}
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                {/* Sorting Dropdown */}
                <div>
                  <label htmlFor="sort">Sort By: </label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {/* Display grouped and sorted tickets */}
        {Object.keys(groupedAndSortedTickets).map((groupKey) => (
          <div key={groupKey} style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            width: '400px',
            marginRight: '20px'
          }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {grouping === "priority" && (
                  <img
                    src={priorityyIcons[groupKey] || no} // Default to 'no' if no priority icon is found
                    alt="Priority"
                    style={{ width: '16px', height: '16px' }}
                  />
                )}
                {grouping === "status" && (
                  <img
                    src={statusIcons[groupKey] || backlog} // Default to 'backlog' if no status icon is found
                    alt="Status"
                    style={{ width: '16px', height: '16px' }}
                  />
                )}
                <span>{groupKey}</span>
                <span style={{ scale: '0.7', color: '#514247' }}>{groupedAndSortedTickets[groupKey].length}</span> {/* Show count of tickets */}
              </div>

              <div>
                <img src={add} alt="" style={{ marginRight: '8px' }} />
                <img src={dots} alt="" />
              </div>
            </h3>

            {groupedAndSortedTickets[groupKey].map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} users={users} />
            ))}
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default App;
