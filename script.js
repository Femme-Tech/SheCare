// Add this script at the end of the body
<script>
document.addEventListener('DOMContentLoaded', () => {
    fetchTopics();
    setupFormHandler();
});

function setupFormHandler() {
    const form = document.getElementById('topic-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createTopic();
    });
}

function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = type === 'success' ? 'success-message' : 'error-message';
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    setTimeout(() => messageElement.remove(), 5000);
}

async function createTopic() {
    try {
        const title = document.getElementById('topic-title').value.trim();
        const content = document.getElementById('topic-content').value.trim();
        const isAnonymous = document.getElementById('anonymous').checked;

        if (!title || !content) {
            throw new Error('Please fill in all required fields');
        }

        const response = await fetch('/api/create_topic.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                content,
                is_anonymous: isAnonymous ? 1 : 0,
                user_id: 1 // Replace with actual user ID from session
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            document.getElementById('topic-form').reset();
            showMessage('Topic created successfully!');
            await fetchTopics();
        } else {
            throw new Error(data.message || 'Failed to create topic');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function fetchTopics() {
    try {
        const topicsDiv = document.getElementById('topics');
        topicsDiv.innerHTML = '<div class="loading">Loading topics...</div>';

        const response = await fetch('/api/fetch_topics.php');
        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to fetch topics');
        }

        topicsDiv.innerHTML = '';

        if (!data.topics || data.topics.length === 0) {
            topicsDiv.innerHTML = '<p class="no-topics">No topics available. Be the first to create one!</p>';
            return;
        }

        data.topics.forEach(topic => {
            topicsDiv.appendChild(createTopicElement(topic));
        });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function createTopicElement(topic) {
    const topicElement = document.createElement('div');
    topicElement.className = 'topic';
    topicElement.innerHTML = `
        <div class="topic-header">
            <h3 class="topic-title">${escapeHtml(topic.title)}</h3>
            <span class="topic-author">Posted by: ${escapeHtml(topic.author)}</span>
        </div>
        <div class="topic-content">
            <p>${escapeHtml(topic.content)}</p>
        </div>
        <div class="stats">
            <span><i class="far fa-heart"></i> ${topic.like_count || 0}</span>
            <span><i class="far fa-comment"></i> ${topic.comment_count || 0}</span>
        </div>
        <div class="topic-actions">
            <button onclick="likeTopic(${topic.id})" class="btn btn-secondary">
                <i class="far fa-heart"></i> Like
            </button>
            <button onclick="toggleComments(${topic.id})" class="btn btn-secondary">
                <i class="far fa-comment"></i> Comments
            </button>
            <button onclick="reportTopic(${topic.id})" class="btn btn-secondary">
                <i class="far fa-flag"></i> Report
            </button>
        </div>
        <div id="comments-section-${topic.id}" class="comments-section" style="display: none;">
            <div id="comments-${topic.id}"></div>
            <div class="form-group">
                <textarea id="comment-input-${topic.id}" placeholder="Write a comment..."></textarea>
                <button onclick="addComment(${topic.id})" class="btn btn-primary">Post Comment</button>
            </div>
        </div>
    `;
    return topicElement;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function likeTopic(topicId) {
    try {
        const response = await fetch('/api/like_topic.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic_id: topicId,
                user_id: 1 // Replace with actual user ID
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            await fetchTopics();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function reportTopic(topicId) {
    try {
        if (!confirm('Are you sure you want to report this topic?')) {
            return;
        }

        const response = await fetch('/api/report_topic.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic_id: topicId,
                user_id: 1 // Replace with actual user ID
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            showMessage('Topic reported successfully');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function toggleComments(topicId) {
    const commentsSection = document.getElementById(`comments-section-${topicId}`);
    const isHidden = commentsSection.style.display === 'none';
    
    if (isHidden) {
        commentsSection.style.display = 'block';
        await loadComments(topicId);
    } else {
        commentsSection.style.display = 'none';
    }
}

async function loadComments(topicId) {
    try {
        const response = await fetch(`/api/get_comments.php?topic_id=${topicId}`);
        const data = await response.json();
        
        const commentsContainer = document.getElementById(`comments-${topicId}`);
        commentsContainer.innerHTML = '';

        if (data.comments && data.comments.length > 0) {
            data.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <p>${escapeHtml(comment.content)}</p>
                    <small>${comment.is_anonymous ? 'Anonymous' : escapeHtml(comment.author)} - ${new Date(comment.created_at).toLocaleString()}</small>
                `;
                commentsContainer.appendChild(commentElement);
            });
        } else {
            commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function addComment(topicId) {
    try {
        const input = document.getElementById(`comment-input-${topicId}`);
        const content = input.value.trim();

        if (!content) {
            throw new Error('Comment cannot be empty');
        }

        const response = await fetch('/api/add_comment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic_id: topicId,
                content: content,
                user_id: 1, // Replace with actual user ID
                is_anonymous: false
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            input.value = '';
            await loadComments(topicId);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}
</script>