from flask import Blueprint, request, jsonify
import random
import uuid
from datetime import datetime

story_bp = Blueprint('story', __name__)

# In-memory storage for demo purposes (in production, use a database)
story_sessions = {}

# Action-oriented story templates and data
SETTINGS = {
    'military_base': {
        'name': 'Military Base',
        'locations': ['command center', 'armory', 'training ground', 'barracks', 'perimeter fence'],
        'scenarios': [
            'discovers {friend1} is selling weapons to enemy forces',
            'finds classified intel that {friend2} is planning a coup against the commanding officer',
            'catches {friend3} sabotaging critical mission equipment',
            'uncovers evidence that {friend1} has been feeding information to hostile operatives',
            'witnesses {friend2} executing unauthorized strikes against civilian targets'
        ]
    },
    'zombie_apocalypse': {
        'name': 'Zombie Apocalypse',
        'locations': ['abandoned warehouse', 'rooftop', 'underground bunker', 'supply depot', 'quarantine zone'],
        'scenarios': [
            'discovers {friend1} has been hoarding medical supplies while others die',
            'finds out {friend2} was bitten but is hiding the infection',
            'catches {friend3} making deals with hostile survivor groups',
            'realizes {friend1} sabotaged the radio to prevent rescue',
            'uncovers that {friend2} caused the outbreak at their previous safe house'
        ]
    },
    'space_station': {
        'name': 'Space Station',
        'locations': ['command bridge', 'engineering bay', 'airlock chamber', 'life support systems', 'cargo hold'],
        'scenarios': [
            'discovers {friend1} is planning to jettison crew members to save oxygen',
            'finds evidence that {friend2} sabotaged the navigation system',
            'catches {friend3} stealing critical resources for personal survival',
            'uncovers that {friend1} is secretly communicating with hostile alien forces',
            'realizes {friend2} has been poisoning the water supply to eliminate competition'
        ]
    },
    'underground_fight_club': {
        'name': 'Underground Fight Club',
        'locations': ['fighting pit', 'betting floor', 'underground tunnels', 'weapons cache', 'medical bay'],
        'scenarios': [
            'discovers {friend1} has been fixing fights and stealing prize money',
            'finds out {friend2} is working with law enforcement to shut down the operation',
            'catches {friend3} using illegal performance enhancers',
            'uncovers that {friend1} murdered the previous champion',
            'realizes {friend2} has been selling fight footage to rival organizations'
        ]
    },
    'heist_crew': {
        'name': 'Heist Crew',
        'locations': ['safe house', 'target building', 'getaway vehicle', 'weapons depot', 'surveillance room'],
        'scenarios': [
            'discovers {friend1} is planning to double-cross the crew and take all the money',
            'finds evidence that {friend2} is an undercover federal agent',
            'catches {friend3} selling crew information to rival criminal organizations',
            'uncovers that {friend1} killed their previous partner for a bigger cut',
            'realizes {friend2} has been skimming money from previous jobs'
        ]
    },
    'spy_agency': {
        'name': 'Spy Agency',
        'locations': ['headquarters', 'safe house', 'enemy embassy', 'black site facility', 'extraction point'],
        'scenarios': [
            'discovers {friend1} is a double agent working for enemy intelligence',
            'finds classified files proving {friend2} assassinated innocent civilians',
            'catches {friend3} selling state secrets to the highest bidder',
            'uncovers that {friend1} framed their mentor for treason',
            'realizes {friend2} has been running unauthorized assassination operations'
        ]
    }
}

PERSONALITY_EFFECTS = {
    'Ruthless': ['eliminates threats without hesitation', 'shows no mercy to enemies', 'prioritizes mission over lives'],
    'Strategic': ['calculates every move carefully', 'sets elaborate traps', 'thinks three steps ahead'],
    'Reckless': ['charges into danger without thinking', 'takes unnecessary risks', 'acts on pure instinct'],
    'Loyal': ['refuses to abandon teammates', 'takes bullets for allies', 'never breaks under interrogation'],
    'Backstabber': ['betrays allies for personal gain', 'switches sides when convenient', 'plants evidence against friends'],
    'Hot-Headed': ['explodes into violent rage', 'makes impulsive decisions', 'starts fights over minor slights'],
    'Cold-Blooded': ['kills without emotion', 'manipulates others ruthlessly', 'shows no empathy for victims'],
    'Heroic': ['sacrifices self for others', 'always tries to save everyone', 'refuses to compromise morals'],
    'Paranoid': ['suspects everyone of betrayal', 'sees conspiracies everywhere', 'trusts no one completely'],
    'Fearless': ['faces impossible odds', 'never backs down from a fight', 'laughs in the face of death']
}

def generate_custom_scenario(custom_setting, characters):
    """Generate a scenario for custom settings"""
    action_templates = [
        f"discovers {characters['friend1']} has been secretly working against the group",
        f"finds evidence that {characters['friend2']} betrayed their previous team",
        f"catches {characters['friend3']} stealing valuable resources",
        f"uncovers a conspiracy involving {characters['friend1']} and outside forces",
        f"realizes {characters['friend2']} has been lying about their true identity"
    ]
    
    locations = ['main area', 'secure location', 'hidden chamber', 'control room', 'emergency exit']
    
    return {
        'scenarios': action_templates,
        'locations': locations
    }

def generate_story_beat(session_data, choice=None):
    """Generate a new story beat based on current session and choice"""
    setting = session_data['setting']
    characters = session_data['characters']
    personality_tags = session_data.get('personality_tags', [])
    story_history = session_data.get('story_history', [])
    
    # Determine intensity level based on story progression
    intensity_level = min(len(story_history) * 25 + 20, 100)
    
    if len(story_history) == 0:
        # Opening scenario
        if setting in SETTINGS:
            setting_data = SETTINGS[setting]
        else:
            # Custom setting
            setting_data = generate_custom_scenario(setting, characters)
        
        scenario_template = random.choice(setting_data['scenarios'])
        location = random.choice(setting_data.get('locations', ['the area']))
        
        # Replace character placeholders
        scenario = scenario_template.format(
            main=characters['main'],
            friend1=characters['friend1'],
            friend2=characters['friend2'],
            friend3=characters['friend3'],
            friend4=characters['friend4']
        )
        
        content = f"{characters['main']} enters {location} and immediately senses danger. {scenario}. The situation is about to explode into chaos..."
        
    else:
        # Continuation based on previous choice
        if choice:
            if any(word in choice.lower() for word in ['attack', 'fight', 'strike', 'assault']):
                content = f"{characters['main']} launches into action! {characters['friend1']} draws weapons while {characters['friend2']} calls for backup. The situation has escalated to full combat..."
            elif any(word in choice.lower() for word in ['investigate', 'gather', 'intel', 'evidence']):
                content = f"{characters['main']} moves stealthily to gather intelligence. {characters['friend3']} provides overwatch while {characters['friend1']} discovers shocking evidence. The conspiracy runs deeper than anyone imagined..."
            elif any(word in choice.lower() for word in ['confront', 'direct', 'face']):
                content = f"{characters['main']} confronts the threat head-on. {characters['friend2']} backs them up as tensions reach a breaking point. Someone's about to make a fatal mistake..."
            elif any(word in choice.lower() for word in ['escape', 'retreat', 'evacuate']):
                content = f"The tactical retreat begins! {characters['main']} coordinates the escape while {characters['friend1']} covers their six. But the enemy is closing in fast..."
            elif any(word in choice.lower() for word in ['sabotage', 'destroy', 'eliminate']):
                content = f"{characters['main']} initiates sabotage protocols. {characters['friend3']} sets charges while {characters['friend2']} eliminates security. The mission just became a demolition job..."
            else:
                content = f"The tactical situation evolves rapidly. {characters['main']} adapts to new threats while {characters['friend1']} and {characters['friend2']} execute contingency plans. Every second counts..."
        else:
            content = "The mission continues with deadly precision as new threats emerge from the shadows..."
    
    # Add personality-based action flavor
    if personality_tags:
        tag = random.choice(personality_tags)
        if tag in PERSONALITY_EFFECTS:
            effect = random.choice(PERSONALITY_EFFECTS[tag])
            content += f" {characters['main']} {effect}."
    
    return {
        'id': len(story_history) + 1,
        'character': characters['main'],
        'content': content,
        'timestamp': 'Just now' if len(story_history) == 0 else f'{(len(story_history) * 30)} seconds ago',
        'likes': random.randint(100, 800),
        'comments': random.randint(25, 150),
        'intensity_level': intensity_level
    }

def generate_choices(session_data):
    """Generate action-oriented choice options based on current story state"""
    story_history = session_data.get('story_history', [])
    personality_tags = session_data.get('personality_tags', [])
    
    if len(story_history) == 1:
        # First set of choices - tactical options
        choices = [
            {
                'id': 1,
                'text': 'Launch immediate assault',
                'preview': 'Go in guns blazing...'
            },
            {
                'id': 2,
                'text': 'Gather intelligence first',
                'preview': 'Knowledge is power...'
            },
            {
                'id': 3,
                'text': 'Set up an ambush',
                'preview': 'Turn the tables...'
            }
        ]
    elif len(story_history) == 2:
        # Second set of choices - escalation
        choices = [
            {
                'id': 4,
                'text': 'Call in reinforcements',
                'preview': 'Bring the cavalry...'
            },
            {
                'id': 5,
                'text': 'Execute sabotage mission',
                'preview': 'Destroy from within...'
            },
            {
                'id': 6,
                'text': 'Attempt tactical extraction',
                'preview': 'Live to fight another day...'
            }
        ]
    elif len(story_history) == 3:
        # Third set of choices - critical decisions
        choices = [
            {
                'id': 7,
                'text': 'Sacrifice yourself for the mission',
                'preview': 'Ultimate heroic sacrifice...'
            },
            {
                'id': 8,
                'text': 'Eliminate all witnesses',
                'preview': 'Leave no loose ends...'
            },
            {
                'id': 9,
                'text': 'Expose the conspiracy publicly',
                'preview': 'Blow the whole thing open...'
            }
        ]
    else:
        # Final choices - resolution
        choices = [
            {
                'id': 10,
                'text': 'Become the new leader',
                'preview': 'Seize control of everything...'
            },
            {
                'id': 11,
                'text': 'Disappear into the shadows',
                'preview': 'Vanish without a trace...'
            },
            {
                'id': 12,
                'text': 'Start a revolution',
                'preview': 'Burn it all down...'
            }
        ]
    
    # Add personality-influenced choices
    if 'Ruthless' in personality_tags:
        choices.append({
            'id': 98,
            'text': 'Execute all traitors immediately',
            'preview': 'Show no mercy...'
        })
    
    if 'Strategic' in personality_tags:
        choices.append({
            'id': 99,
            'text': 'Implement complex multi-phase plan',
            'preview': 'Chess, not checkers...'
        })
    
    return choices

@story_bp.route('/start', methods=['POST'])
def start_story():
    """Start a new story session"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('characters', {}).get('main'):
        return jsonify({'error': 'Main character name is required'}), 400
    
    if not data.get('setting'):
        return jsonify({'error': 'Setting is required'}), 400
    
    # Create new session
    session_id = str(uuid.uuid4())
    session_data = {
        'id': session_id,
        'characters': data['characters'],
        'setting': data['setting'],
        'personality_tags': data.get('personality_tags', []),
        'story_history': [],
        'created_at': datetime.now().isoformat()
    }
    
    # Generate opening story beat
    opening_beat = generate_story_beat(session_data)
    session_data['story_history'].append(opening_beat)
    
    # Generate initial choices
    choices = generate_choices(session_data)
    
    # Store session
    story_sessions[session_id] = session_data
    
    return jsonify({
        'session_id': session_id,
        'story_beat': opening_beat,
        'choices': choices,
        'drama_level': opening_beat['intensity_level']
    })

@story_bp.route('/choice', methods=['POST'])
def make_choice():
    """Process a choice and generate next story beat"""
    data = request.get_json()
    
    session_id = data.get('session_id')
    choice_id = data.get('choice_id')
    choice_text = data.get('choice_text')
    
    if not session_id or session_id not in story_sessions:
        return jsonify({'error': 'Invalid session'}), 400
    
    session_data = story_sessions[session_id]
    
    # Generate next story beat based on choice
    next_beat = generate_story_beat(session_data, choice_text)
    session_data['story_history'].append(next_beat)
    
    # Generate next choices (if story isn't complete)
    if len(session_data['story_history']) < 5:  # Limit story length
        choices = generate_choices(session_data)
    else:
        choices = []  # Story complete
    
    return jsonify({
        'story_beat': next_beat,
        'choices': choices,
        'drama_level': next_beat['intensity_level'],
        'story_complete': len(choices) == 0
    })

@story_bp.route('/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get current session data"""
    if session_id not in story_sessions:
        return jsonify({'error': 'Session not found'}), 404
    
    return jsonify(story_sessions[session_id])

@story_bp.route('/sessions', methods=['GET'])
def list_sessions():
    """List all active sessions (for debugging)"""
    return jsonify({
        'sessions': list(story_sessions.keys()),
        'count': len(story_sessions)
    })

