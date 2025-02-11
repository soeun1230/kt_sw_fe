// export async function getUserInfo() {
//     const token = localStorage.getItem('jwt');
//     if (!token) return null;
//
//     const response = await fetch('http://localhost:8080/user/me', {
//         headers: { 'Authorization': `Bearer ${token}` }
//     });
//
//     return response.ok ? await response.json() : null;
// }
