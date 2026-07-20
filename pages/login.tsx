import Head from 'next/head';

export default function Login() {
    // Esta función redirigirá al usuario a tu flujo de OAuth
    const handleLogin = () => {
        // Redirige a la ruta de tu API que inicia la autenticación
        window.location.href = '/api/auth/login'; 
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' }}>
            <Head>
                <title>Iniciar Sesión - EstudioApp</title>
            </Head>

            <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ marginBottom: '10px', fontSize: '24px', color: '#333' }}>Bienvenida a EstudioApp</h1>
                <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.5' }}>
                    Para acceder al taller y tus herramientas de estudio, por favor autentícate con tu cuenta institucional.
                </p>

                <button
                    onClick={handleLogin}
                    style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
}