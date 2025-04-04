export function getTimeAgo(dateString) {
    let createdAt = new Date(dateString);
    let now = new Date();
    let diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } 
    let diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }
    let diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    }
    let diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    }
    let diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} weeks ago`;
    }
    let diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} months ago`;
    }
    let diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago`;
}