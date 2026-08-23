from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    """
    Hash a plaintext password using Argon2id.

    The plaintext password is never stored in the database.
    Only the resulting password hash is persisted.
    """
    
    return password_hash.hash(password)

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a plaintext password against its stored Argon2id hash.

    Returns:
        True if the password matches.
        False otherwise.
    """
    
    return password_hash.verify(
        plain_password,
        hashed_password
    )
