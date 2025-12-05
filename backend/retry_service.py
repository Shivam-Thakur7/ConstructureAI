"""
Retry Logic for Resilience
Handles transient errors with exponential backoff
"""
import asyncio
from typing import Callable, Any, Optional
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class RetryConfig:
    """Configuration for retry behavior"""
    MAX_RETRIES = 3
    BASE_DELAY = 1  # seconds
    MAX_DELAY = 10  # seconds
    EXPONENTIAL_BASE = 2


async def async_retry(
    func: Callable,
    *args,
    max_retries: int = RetryConfig.MAX_RETRIES,
    base_delay: float = RetryConfig.BASE_DELAY,
    max_delay: float = RetryConfig.MAX_DELAY,
    **kwargs
) -> Any:
    """
    Retry an async function with exponential backoff
    """
    last_exception = None
    
    for attempt in range(max_retries + 1):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            last_exception = e
            
            if attempt < max_retries:
                # Calculate delay with exponential backoff
                delay = min(
                    base_delay * (RetryConfig.EXPONENTIAL_BASE ** attempt),
                    max_delay
                )
                
                logger.warning(
                    f"Attempt {attempt + 1}/{max_retries + 1} failed: {str(e)}. "
                    f"Retrying in {delay}s..."
                )
                
                await asyncio.sleep(delay)
            else:
                logger.error(f"All {max_retries + 1} attempts failed: {str(e)}")
    
    raise last_exception


def with_retry(max_retries: int = RetryConfig.MAX_RETRIES):
    """
    Decorator to add retry logic to async functions
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await async_retry(func, *args, max_retries=max_retries, **kwargs)
        return wrapper
    return decorator
