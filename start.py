import os
import subprocess
import threading
import socket
import platform
import argparse
import sys

# THIS IS THE SCRIPT TO RUN THE WHOLE APPLICATION
USERS = [
    {
        "name": "John Doe",
        "username": "univpm",
        "password": "1234"
    },
    {
        "name": "Alice Smith",
        "username": "alice",
        "password": "secure123"
    },
    {
        "name": "Bob Johnson",
        "username": "bob",
        "password": "password456"
    }
]


# funzione per il thread del frontend
def startFrontend():
    frontendPath = os.getcwd() + "/frontend"
    print("Frontend Started")
    subprocess.run(
        ["npm", "run", "dev"], text=True, stdout=sys.stdout, cwd=frontendPath
    )


# funzione per il thread del backend
def startBackend():
    system = platform.system()
    backendPath = os.getcwd() + "/backend/src"
    print("Backend Started")
    if system == "Linux" or "macOS":
        subprocess.run(
            ["python3", "app.py"], stdout=sys.stdout, text=True, cwd=backendPath
        )
    else:
        # questo serve per far girare lo script anche su windows che usa un comando diverso rispetto a linux
        subprocess.run(
            ["python", "app.py"], stdout=sys.stdout, text=True, cwd=backendPath
        )


# funzione per aggiornare il .env
# def updateEnv(mode, username, password):
#     try:
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         # connessine alla porta del dns di google per otenere l'indirizzo ip del dispositivo
#         s.connect(("8.8.8.8", 80))
#         ip = s.getsockname()[0]
#         if mode != "local":
#             os.environ["MODE"] = ip
#         s.close()
#         envPath = (
#             os.getcwd() + "/frontend/.env"
#         )  #  configurazione per inserire il file .env
#         with open(envPath, "w") as f:
#             f.write(
#                 f"VITE_IP={ip}\nVITE_MODE={mode}\nAUTHUSER={username}\nAUTHPASSWORD={password}\n"
#             )
#         return ip
#     except Exception:
#         print("Couldn't get the device ip")
#         exit(1)

def updateEnv(mode, users):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # connessione alla porta del dns di google per ottenere l'indirizzo ip del dispositivo
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        if mode != "local":
            os.environ["MODE"] = ip
        s.close()
        
        envPath = os.getcwd() + "/frontend/.env"
        
        # Build the .env content
        env_content = [
            f"VITE_IP={ip}",
            f"VITE_MODE={mode}",
            ""  # Empty line for separation
        ]
        
        # Add legacy format (first user for backward compatibility)
        if users:
            env_content.extend([
                f"AUTHNAME={users[0]['name']}",
                f"AUTHUSER={users[0]['username']}",
                f"AUTHPASSWORD={users[0]['password']}",
                ""
            ])
        
        # Add numbered users
        for i, user in enumerate(users, start=1):
            env_content.extend([
                f"AUTHNAME_{i}={user['name']}",
                f"AUTHUSER_{i}={user['username']}",
                f"AUTHPASSWORD_{i}={user['password']}"
            ])
        
        # Write to .env file
        with open(envPath, "w") as f:
            f.write("\n".join(env_content))
        
        print(f"\n{'='*50}")
        print(f"Environment configured successfully!")
        print(f"{'='*50}")
        print(f"Mode: {mode}")
        print(f"IP Address: {ip}")
        print(f"Configured users: {len(users)}")
        for i, user in enumerate(users, start=1):
            print(f"  {i}. {user['name']} (username: {user['username']})")
        print(f"{'='*50}\n")
        
        return ip
    except Exception as e:
        print(f"Error: Couldn't get the device ip - {e}")
        exit(1)

def validate_users():
    """Validate that all users have required fields."""
    if not USERS:
        print("Error: No users configured! Please add at least one user to the USERS list.")
        exit(1)
    
    required_fields = ["name", "username", "password"]
    for i, user in enumerate(USERS, start=1):
        for field in required_fields:
            if field not in user or not user[field]:
                print(f"Error: User {i} is missing required field '{field}'")
                exit(1)
    
    # Check for duplicate usernames
    usernames = [user["username"] for user in USERS]
    if len(usernames) != len(set(usernames)):
        print("Error: Duplicate usernames found! Each user must have a unique username.")
        exit(1)

mode = None

# codice per leggere la flag iniziale variando dalla versione local (localhost), alla versione sulla porta ip esposta alla rete locale
flagParser = argparse.ArgumentParser()
flagParser.add_argument("-l", "--local", action="store_true")
flagParser.add_argument("-p", "--production", action="store_true")

args = flagParser.parse_args()

if args.local:
    mode = "local"
elif args.production:
    mode = "production"
else:
    print("You need to provide a mode to run the script")
    exit(1)

# aggiornamento del file .env che sta nella directory frontend
# il file deve stare in quella directory perchè usando Vite gli serve avere il file nella sua root per poter accedere facilmente alle variabili
ip = updateEnv(mode, USERS)

backThread = threading.Thread(target=startBackend)
frontThread = threading.Thread(target=startFrontend)


backThread.start()
frontThread.start()


# funzione per fare in modo che l'esecuzione del codice non si fermi fino alla chiusura di entrambi i thread con Ctrl+C
backThread.join()
frontThread.join()

# .env
# VITE_API_BASE_URL=https://r5d6khydzg.execute-api.eu-north-1.amazonaws.com/test
# VITE_COGNITO_LOGIN_URL=https://eu-north-1qhkbsil11.auth.eu-north-1.amazoncognito.com/login?client_id=2ntetl7enceatficlfvlu09nqp&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Farchitetture.83fk81g8730d2.eu-west-3.cs.amazonlightsail.com%2F
