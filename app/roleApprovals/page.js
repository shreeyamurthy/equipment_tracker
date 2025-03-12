import Navbar from '../../components/navbar';
import Approvals from '../../components/approvals';

const RoleApprovalsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <Approvals />
      </div>
    </div>
  );
};

export default RoleApprovalsPage;