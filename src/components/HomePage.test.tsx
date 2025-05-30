import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { BrowserRouter } from 'react-router-dom';
import * as firestore from 'firebase/firestore';

jest.mock('../firebase', () => ({
  db: {},
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('HomePage', () => {
  it('displays an error message if recovery fails', async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(new Error('Firestore fetch error'));

    render(  
        <HomePage />
      );
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load recipes/i)).toBeInTheDocument();
    });
  });
});
