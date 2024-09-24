import React, { useState, useEffect } from 'react';
import './Section.css';
import TextBlock from './TextBlock/TextBlock'; // Import the TextBlock component

function Section() {
    const [blocks, setBlocks] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Effect to handle clicking outside of the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            const dropdown = document.querySelector('.dropdown-menu');
            const button = document.querySelector('.add-block-button');

            // Check if the click is outside the dropdown and button
            if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
                setShowDropdown(false); // Close the dropdown
                dropdown.classList.remove('show');
                dropdown.classList.add('hide');
            }
        }

        // Add event listener to detect clicks outside
        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener when the component is unmounted or re-renders
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Effect to handle dropdown animation after show/hide state changes
    useEffect(() => {
        const dropdown = document.querySelector('.dropdown-menu');

        if (dropdown) {
            // Add the animationend listener for hiding the dropdown
            dropdown.addEventListener('animationend', function () {
                if (dropdown.classList.contains('hide')) {
                    dropdown.style.display = 'none'; // Hide the dropdown after the closing animation
                }
            });
        }
    }, [showDropdown]);

    // Function to handle toggling the dropdown menu
    const toggleDropdown = () => {
        const dropdown = document.querySelector('.dropdown-menu');

        if (dropdown.classList.contains('show')) {
            // Start the closing animation
            dropdown.classList.remove('show');
            dropdown.classList.add('hide');
        } else {
            // Start the opening animation
            dropdown.classList.remove('hide');
            dropdown.style.display = 'block';
            dropdown.classList.add('show');
        }
        setShowDropdown(!showDropdown); // Toggle the dropdown state
    };

    return (
        <div className="section-container">
            {/* Top Add Section Button */}
            <button className="add-section-button top">+ Add section</button>

            {/* Section Content */}
            <div className="section-content">
                {/* Add Block Button with Dropdown */}
                <div className="add-block-container">
                    <button
                        className="add-block-button"
                        onClick={toggleDropdown} // Handle dropdown toggle on click
                    >
                        + Add block
                    </button>

                    <div className="dropdown-menu">
                        <div className="dropdown-section">
                            <span className="dropdown-section-title">Basic</span>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">T</span> Text
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">H</span> Heading
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">•</span> Bulleted list
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">#</span> Numbered list
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🔘</span> Button
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">—</span> Divider
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🔗</span> Social link
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">📨</span> Form
                            </button>
                        </div>

                        <div className="dropdown-section">
                            <span className="dropdown-section-title">Media</span>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🖼</span> Image
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🎥</span> Video
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🔗</span> Rich link
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🐦</span> Tweet
                            </button>
                        </div>

                        <div className="dropdown-section">
                            <span className="dropdown-section-title">Layout</span>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">📑</span> Card
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">🗂</span> Stack
                            </button>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">📖</span> Accordion
                            </button>
                        </div>

                        <div className="dropdown-section">
                            <span className="dropdown-section-title">Embed</span>
                            <button className="dropdown-item">
                                <span className="dropdown-item-icon">&lt;/&gt;</span> HTML
                            </button>
                        </div>
                    </div>
                </div>

                {/* Render Blocks */}
                {blocks.map((block, index) => (
                    <div key={index} className="block">
                        {block.type === 'text' && <TextBlock />}
                    </div>
                ))}
            </div>

            {/* Bottom Add Section Button */}
            <button className="add-section-button bottom">+ Add section</button>
        </div>
    );
}

export default Section;
