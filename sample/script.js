function calculateAttendance() {
            const total = parseInt(document.getElementById('totalClasses').value);
            const attended = parseInt(document.getElementById('attendedClasses').value);
            const required = parseFloat(document.getElementById('requiredPercentage').value);

            if (!total || !attended || !required) {
                showNotification('⚠️ Please fill in all fields!', 'warning');
                return;
            }

            if (attended > total) {
                showNotification('❌ Attended classes cannot exceed total classes!', 'error');
                return;
            }

            const currentPercent = ((attended / total) * 100).toFixed(2);
            const difference = currentPercent - required;

            // Show results
            document.getElementById('results').classList.add('active');

            // Update current percentage
            document.getElementById('currentPercent').textContent = currentPercent + '%';

            // Update status card
            const statusCard = document.getElementById('statusCard');
            const statusEmoji = document.getElementById('statusEmoji');
            const statusText = document.getElementById('statusText');

            if (currentPercent >= required) {
                statusCard.className = 'stat-card success';
                statusEmoji.textContent = '✅';
                statusText.textContent = 'Safe';
            } else if (currentPercent >= required - 5) {
                statusCard.className = 'stat-card warning';
                statusEmoji.textContent = '⚠️';
                statusText.textContent = 'Warning';
            } else {
                statusCard.className = 'stat-card danger';
                statusEmoji.textContent = '❌';
                statusText.textContent = 'Critical';
            }

            // Update current card color
            const currentCard = document.getElementById('currentCard');
            if (currentPercent >= required) {
                currentCard.className = 'stat-card success';
            } else if (currentPercent >= required - 5) {
                currentCard.className = 'stat-card warning';
            } else {
                currentCard.className = 'stat-card danger';
            }

            // Update progress bar
            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = Math.min(currentPercent, 100) + '%';
            
            if (currentPercent < required - 5) {
                progressFill.className = 'progress-fill low';
            } else if (currentPercent < required) {
                progressFill.className = 'progress-fill medium';
            } else {
                progressFill.className = 'progress-fill';
            }

            // Calculate predictions
            let predictions = '<div>';

            if (currentPercent >= required) {
                // Calculate how many classes can be missed
                let canMiss = 0;
                for (let i = 0; i <= total; i++) {
                    if (((attended / (total + i)) * 100) >= required) {
                        canMiss = i;
                    } else {
                        break;
                    }
                }

                predictions += `
                    <div class="prediction-item">
                        <span class="prediction-label">🎉 Classes You Can Miss</span>
                        <span class="prediction-value">${canMiss} classes</span>
                    </div>
                `;

                // Calculate buffer percentage
                const buffer = (currentPercent - required).toFixed(2);
                predictions += `
                    <div class="prediction-item">
                        <span class="prediction-label">💪 Buffer Percentage</span>
                        <span class="prediction-value">+${buffer}%</span>
                    </div>
                `;

                predictions += `<span class="status-badge safe">You're doing great! Keep it up! 🌟</span>`;

            } else {
                // Calculate classes needed
                let classesNeeded = 0;
                let tempAttended = attended;
                let tempTotal = total;

                while (((tempAttended / tempTotal) * 100) < required) {
                    tempAttended++;
                    tempTotal++;
                    classesNeeded++;
                }

                predictions += `
                    <div class="prediction-item">
                        <span class="prediction-label">📚 Classes to Attend (100%)</span>
                        <span class="prediction-value">${classesNeeded} classes</span>
                    </div>
                `;

                // Calculate days needed (assuming 5 classes per day)
                const daysNeeded = Math.ceil(classesNeeded / 5);
                predictions += `
                    <div class="prediction-item">
                        <span class="prediction-label">📅 Approx. Days Needed</span>
                        <span class="prediction-value">${daysNeeded} days</span>
                    </div>
                `;

                // Percentage shortage
                const shortage = (required - currentPercent).toFixed(2);
                predictions += `
                    <div class="prediction-item">
                        <span class="prediction-label">📉 Shortage</span>
                        <span class="prediction-value">-${shortage}%</span>
                    </div>
                `;

                if (currentPercent < required - 10) {
                    predictions += `<span class="status-badge critical">Urgent! Attend all upcoming classes! ⚠️</span>`;
                } else {
                    predictions += `<span class="status-badge warning">Time to catch up! You got this! 💪</span>`;
                }
            }

            predictions += '</div>';
            document.getElementById('predictions').innerHTML = predictions;

            // Show success notification
            showNotification('✅ Calculation Complete!', 'success');

            // Smooth scroll to results
            document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function resetForm() {
            document.getElementById('totalClasses').value = '';
            document.getElementById('attendedClasses').value = '';
            document.getElementById('requiredPercentage').value = '75';
            document.getElementById('results').classList.remove('active');
        }

        // Add enter key support
        document.addEventListener('DOMContentLoaded', function() {
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        calculateAttendance();
                    }
                });
            });
        });

        // Custom notification function
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: ${type === 'error' ? 'linear-gradient(135deg, #e22134, #ff4757)' : 
                             type === 'warning' ? 'linear-gradient(135deg, #ff9500, #ffa726)' : 
                             'linear-gradient(135deg, #1ed760, #1fdf64)'};
                color: ${type === 'warning' ? '#000' : '#fff'};
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 40px ${
                    type === 'error' ? 'rgba(226, 33, 52, 0.4)' : 
                    type === 'warning' ? 'rgba(255, 149, 0, 0.4)' : 
                    'rgba(30, 215, 96, 0.4)'
                };
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.4s ease-out;
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.4s ease-out';
                setTimeout(() => notification.remove(), 400);
            }, 3000);
        }

        // Add slide in/out animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);