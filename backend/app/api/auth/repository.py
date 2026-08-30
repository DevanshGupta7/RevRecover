import re
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.organisation import Organisation
from app.models.organisation_member import OrganisationMember
from app.models.user import User


def generate_slug(name: str) -> str:
    """
    Generate a URL-friendly slug from an organisation name.
    """

    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")

    return slug


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Find a user using their email address.
    """

    statement = select(User).where(User.email == email)

    return db.scalar(statement)


def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    """
    Find a user using their UUID.
    """

    statement = select(User).where(User.id == user_id)

    return db.scalar(statement)


def get_membership(db: Session, user_id: UUID) -> OrganisationMember | None:
    """
    Find the organisation membership associated
    with a user.
    """

    statement = select(OrganisationMember).where(OrganisationMember.user_id == user_id)

    return db.scalar(statement)


def create_user(db: Session, email: str, full_name: str, password_hash: str) -> User:
    """
    Create and persist a new user.
    """

    user = User(email=email, full_name=full_name, password_hash=password_hash)

    db.add(user)
    db.flush()

    return user


def create_organisation(db: Session, name: str) -> Organisation:
    """
    Create a new organisation.
    """

    base_slug = generate_slug(name)
    slug = base_slug
    counter = 1

    while db.query(Organisation).filter(Organisation.slug == slug).first() is not None:
        slug = f"{base_slug}-{counter}"
        counter += 1

    organisation = Organisation(name=name, slug=slug)

    db.add(organisation)
    db.flush()

    return organisation


def create_membership(
    db: Session, user_id: UUID, organisation_id: UUID, role
) -> OrganisationMember:
    """
    Create the relationship between a user
    and an organisation.
    """

    membership = OrganisationMember(
        user_id=user_id, organisation_id=organisation_id, role=role
    )

    db.add(membership)
    db.flush()

    return membership
